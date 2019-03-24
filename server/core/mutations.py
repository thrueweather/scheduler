import graphene
from datetime import datetime
import json

from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers.json import DjangoJSONEncoder

from accounts.models import User
from .forms import ProjectForm, UpdateProjectForm, PersonForm
from .models import Project, Person, Company
from .schema import ProjectType, PersonType

from serious_django_graphene import FormMutation


class ProjectCreateMutation(FormMutation):
    class Meta:
        form_class = ProjectForm

    project = graphene.Field(lambda: ProjectType)
    superintendent_has_project = graphene.String()

    @classmethod
    def perform_mutate(cls, form, info):
        superintendent_has_project = False
        superintendent = None
        start_date = form.cleaned_data['start_date']
        end_date = form.cleaned_data['end_date']

        if form.cleaned_data['superintendent_id']:
            superintendent = Person.objects.get(
                id=form.cleaned_data['superintendent_id'])
            if (
                not superintendent.can_add_project(start_date, end_date) and
                not form.cleaned_data['unassigned']
            ):
                superintendent_has_project = True
                return cls(
                    project=None,
                    superintendent_has_project=superintendent_has_project
                )
        project = form.save()

        if form.cleaned_data['manager_id']:
            project.manager_id = int(form.cleaned_data['manager_id'])
        if superintendent:
            project.superintendent_id = superintendent.id
        if info.context.user.role == 'ADMIN':
            project.creation_approved = True
        project.save()

        project_id = project.id
        project = Project.objects.get(id=project_id)
        return cls(
            project=project,
            superintendent_has_project=superintendent_has_project
        )


class ProjectUpdateMutation(FormMutation):
    class Meta:
        form_class = UpdateProjectForm

    project = graphene.Field(lambda: ProjectType)
    superintendent_has_project = graphene.String()

    @classmethod
    def perform_mutate(cls, form, info):
        superintendent_has_project = False
        if info.context.user.role != 'ADMIN':
            project = Project.objects.get(
                id=form.cleaned_data.pop('project_id'))
            project.is_approved = False
            project.init_raw_data(form.cleaned_data.items())
            return cls(project=project, superintendent_has_project=superintendent_has_project)
        start_date = form.cleaned_data['start_date']
        end_date = form.cleaned_data['end_date']
        superintendent_id = form.cleaned_data['superintendent_id']
        manager_id = form.cleaned_data.pop('manager_id')
        project = Project.objects.get(id=form.cleaned_data.pop('project_id'))
        project.save_current_state()
        if start_date and project.start_date != start_date:
            project.history.append([datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "Change start date from {} to {}".format(
                project.start_date.strftime("%Y-%m-%d"), start_date.strftime("%Y-%m-%d"))])
            project.start_date = start_date
        if end_date and project.end_date != end_date:
            project.history.append([datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "Change end date from {} to {}".format(
                project.end_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d"))])
            project.end_date = end_date

        if superintendent_id == 0:
            project.superintendent_id = None
            project.save()
            return cls(project=project, superintendent_has_project=superintendent_has_project)

        superintendent = Person.objects.get(
            id=superintendent_id)
        if not superintendent.is_assigned_to_project(project.id):
            if not superintendent.can_add_project(start_date, end_date, project.id):
                superintendent_has_project = True
                return cls(project=None, superintendent_has_project=superintendent_has_project)

        if manager_id != project.manager.id:
            new_pm = User.objects.get(id=manager_id)
            project.history.append([datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "Change PM from {} {} to {} {}".format(
                project.manager.first_name, project.manager.last_name, new_pm.first_name, new_pm.last_name)])
            project.manager = None
            project.manager = User.objects.get(id=manager_id)
        if not superintendent.can_add_project(start_date, end_date, project.id):
            superintendent_has_project = True
            return cls(project=None, superintendent_has_project=superintendent_has_project)
        if not superintendent.is_assigned_to_project(project.id):
            project.history.append([datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"), "Assigned superintendent {} {}".format(superintendent.first_name, superintendent.last_name)])
        else:
            project.history.append([datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "Superintendent changed from {} {} to {} {}".format(
                project.superintendent.first_name, project.superintendent.last_name, superintendent.first_name, superintendent.last_name)])
        project.superintendent_id = superintendent.id

        project.save()
        project = Project.objects.get(id=project.id)
        return cls(project=project, superintendent_has_project=superintendent_has_project)


class UndoProjectLastChangeMutation(graphene.Mutation):

    class Arguments:
        project_id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @staticmethod
    def mutate(root, info, **args):
        project_id = args.get('project_id')
        success = False
        errors = []
        try:
            project = Project.objects.get(id=project_id)
            project.undo_last_change()
            success = True
        except Exception as e:
            errors.append(e)

        return UndoProjectLastChangeMutation(errors=errors, success=success)


class ApproveProjectChangesMutation(graphene.Mutation):

    class Arguments:
        project_id = graphene.ID(required=True)
        approve = graphene.Boolean(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @staticmethod
    def mutate(root, info, **args):
        project_id = args.get('project_id')
        approve = args.get('approve')

        project = None
        success = False
        errors = []

        try:
            project = Project.objects.get(id=project_id)
        except ObjectDoesNotExist as e:
            errors.append(str(e))
            return ApproveProjectChangesMutation(errors=errors, success=success)

        if not approve:
            project.clear_changes()
            success = True
            return ApproveProjectChangesMutation(errors=errors, success=success)

        # check can superintendent has project in this time
        if 'superintendent_id' in project.raw_data and ('start_date' in project.raw_data or 'end_date' in project.raw_data):
            start_date = None
            end_date = None
            if 'start_date' in project.raw_data:
                try:
                    start_date = datetime.strptime(json.loads(
                        project.raw_data['start_date']), '%Y-%m-%dT%H:%M:%SZ')
                except Exception:
                    start_date = datetime.strptime(json.loads(
                        project.raw_data['start_date']), '%Y-%m-%dT%H:%M:%S.%fZ')
            if 'end_date' in project.raw_data:
                try:
                    end_date = datetime.strptime(json.loads(
                        project.raw_data['end_date']), '%Y-%m-%dT%H:%M:%SZ')
                except Exception:
                    end_date = datetime.strptime(json.loads(
                        project.raw_data['end_date']), '%Y-%m-%dT%H:%M:%S.%fZ')
            try:
                new_super = Person.objects.get(
                    id=int(project.raw_data['superintendent_id']))
                if not new_super.can_add_project(start_date if start_date else project.start_date, end_date if end_date else project.end_date, project.id):
                    errors.append(
                        'Provided superintendent already has project in this time')
                    return ApproveProjectChangesMutation(errors=errors, success=success)
            except ObjectDoesNotExist as e:
                errors.append(str(e))
            project.approve_changes()
            success = True
        else:
            if 'superintendent_id' in project.raw_data and int(project.raw_data['superintendent_id']) != 0:
                new_super = Person.objects.get(
                    id=int(project.raw_data['superintendent_id']))
                if not new_super.can_add_project(project.start_date, project.end_date, project.id):
                    errors.append(
                        'Provided superintendent already has project in this time')
                    return ApproveProjectChangesMutation(errors=errors, success=success)
            project.approve_changes()
            success = True
        return ApproveProjectChangesMutation(errors=errors, success=success)


class ApproveProjectCreationMutation(graphene.Mutation):

    class Arguments:
        project_id = graphene.ID(required=True)
        approve = graphene.Boolean(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @staticmethod
    def mutate(root, info, **args):
        project_id = args.get('project_id')
        approve = args.get('approve')

        project = None
        success = False
        errors = []

        try:
            project = Project.objects.get(id=project_id)
        except ObjectDoesNotExist as e:
            errors.append(str(e))
            return ApproveProjectCreationMutation(errors=errors, success=success)

        if approve:
            project.creation_approved = True
            project.save()
        else:
            project.delete()

        success = True
        return ApproveProjectCreationMutation(errors=errors, success=success)


class CreatePersonMutation(FormMutation):
    class Meta:
        form_class = PersonForm

    person = graphene.Field(lambda: PersonType)
    errors = graphene.List(graphene.String)

    @classmethod
    def perform_mutate(cls, form, info):
        errors = list()
        company_id = form.cleaned_data['company_id']

        if company_id:
            try:
                company = Company.objects.get(
                    id=company_id)
            except ObjectDoesNotExist:
                errors.append("Provided company does not exist")
                return cls(person=None, errors=errors)

        person = form.save()
        if company_id:
            person.company_id = company.id
            person.save()

        return cls(person=person, errors=errors)
