import graphene
from graphene_django.types import DjangoObjectType

from .models import Address, Company, Project, Person
from .utils import get_paginator


class Status(graphene.Interface):
    status = graphene.Int()


class AdressType(DjangoObjectType):
    class Meta:
        model = Address


class CompanyType(DjangoObjectType):
    class Meta:
        model = Company


class PhaseType(graphene.Interface):
    phase = graphene.String()


class ProjectType(DjangoObjectType):

    class Meta:
        model = Project
        interfaces = (PhaseType, )


class PersonRole(graphene.Interface):
    role = graphene.String()


class PersonType(DjangoObjectType):

    class Meta:
        model = Person
        interfaces = (PersonRole,)


class Query:
    addresses = graphene.List(AdressType)
    companies = graphene.List(CompanyType)
    projects = graphene.List(ProjectType)
    get_project = graphene.Field(
        ProjectType, project_id=graphene.Int())
    persons = graphene.List(PersonType, role=graphene.String(required=False))
    pending_changes_projects = graphene.List(ProjectType)
    pending_creation_projects = graphene.List(ProjectType)

    def resolve_addresses(self, info):
        return Address.objects.all()

    def resolve_companies(self, info):
        return Company.objects.all()

    def resolve_projects(self, info):
        return Project.objects.filter(creation_approved=True)

    def resolve_get_project(self, info, project_id):
        return Project.objects.get(id=project_id)

    def resolve_persons(self, info, role):
        if role != 'ALL':
            return Person.objects.filter(role=role)
        return Person.objects.all()

    def resolve_pending_changes_projects(self, info):
        return Project.objects.filter(is_approved=False)

    def resolve_pending_creation_projects(self, info):
        return Project.objects.filter(creation_approved=False)
