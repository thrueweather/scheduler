import json
from datetime import datetime
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField, JSONField
from django.core.serializers.json import DjangoJSONEncoder
from django.core.validators import RegexValidator
from django.db import models

from accounts.models import User
from djmoney.models.fields import MoneyField, Money
from localflavor.us.models import USStateField, USZipCodeField


class ApproveMixin(models.Model):
    """An abstract base class for approve or decline model changes"""

    is_approved = models.BooleanField(default=True)
    raw_data = JSONField(null=True, blank=True, default=dict)
    changes_list = ArrayField(models.CharField(
        max_length=255, blank=True), blank=True, default=list, editable=False)
    creation_approved = models.BooleanField(default=False)

    class Meta:
        abstract = True

    def init_raw_data(self, form_data):
        for key, value in form_data:
            if value != self.__dict__[key]:
                self.raw_data[key] = json.dumps(
                    value, cls=DjangoJSONEncoder)
        self.save()
        self.init_changes_list()

    def init_changes_list(self):
        """Creates array of strings that describe changes for approve on the site"""
        raw_data = self.raw_data.copy()
        self.changes_list = []
        if 'manager_id' in raw_data:
            if (int(raw_data['manager_id']) != self.manager.id):
                new_pm = User.objects.get(
                    id=json.loads(raw_data['manager_id']))
                self.changes_list.append(
                    'Change PM from {} {} to {} {}'.format(
                        self.manager.first_name, new_pm.first_name,
                        self.manager.last_name, new_pm.last_name,
                    )
                )
                del raw_data['manager_id']
        if 'superintendent_id' in raw_data:
            if (
                int(raw_data['superintendent_id']) != self.superintendent_id and
                int(raw_data['superintendent_id']) != 0
            ):
                new_super = Person.objects.get(
                    id=json.loads(raw_data['superintendent_id']))
                if self.superintendent:
                    self.changes_list.append(
                        'Change superintendent from {} {} to {} {}'.format(
                            self.superintendent.first_name,
                            self.superintendent.last_name, new_super.first_name,
                            new_super.last_name
                        )
                    )
                else:
                    self.changes_list.append(
                        'Superintendent {} {} assign to project {}'.format(
                            new_super.first_name, new_super.last_name, self.name
                        )
                    )
            if int(raw_data['superintendent_id']) == 0:
                if self.superintendent:
                    self.changes_list.append(
                        'Unassign superintendent {} {}'.format(
                            self.superintendent.first_name,
                            self.superintendent.last_name
                        )
                    )

            del raw_data['superintendent_id']
        for field in raw_data:
            if json.dumps(
                    self.__dict__[field], cls=DjangoJSONEncoder) != raw_data[field]:
                self.changes_list.append('Change {} from {} to {} '.format(
                    field, self.__dict__[field], raw_data[field]))
        self.save()

    def approve_changes(self):
        raw_data = self.raw_data.copy()
        if 'manager_id' in raw_data:
            self.manager_id = raw_data['manager_id']
            del raw_data['manager_id']

        if 'start_date' in raw_data:
            try:
                self.start_date = datetime.strptime(json.loads(
                    raw_data['start_date']), '%Y-%m-%dT%H:%M:%SZ')
            except Exception:
                self.start_date = datetime.strptime(json.loads(
                    raw_data['start_date']), '%Y-%m-%dT%H:%M:%S.%fZ')

        if 'end_date' in raw_data:
            try:
                self.end_date = datetime.strptime(json.loads(
                    raw_data['end_date']), '%Y-%m-%dT%H:%M:%SZ')
            except Exception:
                self.end_date = datetime.strptime(json.loads(
                    raw_data['end_date']), '%Y-%m-%dT%H:%M:%S.%fZ')

        for field in raw_data:
            if (field == 'superintendent_id') and (int(raw_data[field]) == 0):
                self.superintendent_id = None
            else:
                self.__dict__[field] = json.loads(raw_data[field])
        self.clear_changes()

    def clear_changes(self):
        self.raw_data = {}
        self.changes_list = []
        self.is_approved = True
        self.save()


class CSICode(models.CharField):

    def __init__(self, *args, **kwargs):

        GENERAL_CONDITIONS = '0700 Division 0'
        CONCRETE = '3000 Division 3'
        MASONRY = '4000 Division 4'
        METALS = '5000 Division 5'
        ROUGH_CARPENTRY = '6100 Division 6'
        FINISH_CARPENTRY = '6200 Division 6'
        THERMAL_AND_MOISTURE_CONTROL = '7000 Division 7'
        DOORS_FRAMES_HARDWARE = '8050 Division 8'
        GLASS_AND_GLAZING = '8800 Division 8'
        CERAMIC_TILE_AND_CERAMICS = '9300 Division 9'
        ACOUSTICAL_CEILINGS = '9500 Division 9'
        FLOORING = '9600 Division 9'
        EMPTY = '0000 NULL 0'

        CODES = (
            (GENERAL_CONDITIONS, 'General conditions'),
            (CONCRETE, 'Concrete'),
            (MASONRY, 'Masonry'),
            (METALS, 'Metals'),
            (ROUGH_CARPENTRY, 'Rough carpentry'),
            (FINISH_CARPENTRY, 'Finish carpentry(aka millwork)'),
            (THERMAL_AND_MOISTURE_CONTROL, 'Thermal and moisture control'),
            (DOORS_FRAMES_HARDWARE, 'Doors/frames/hardware'),
            (GLASS_AND_GLAZING, 'Glass and glazing'),
            (CERAMIC_TILE_AND_CERAMICS, 'Ceramic tile and ceramics'),
            (ACOUSTICAL_CEILINGS, 'Acoustical ceilings'),
            (FLOORING, 'Flooring'),
            (EMPTY, 'empty')
        )

        kwargs['choices'] = CODES
        kwargs['max_length'] = 32
        kwargs['default'] = EMPTY

        super(CSICode, self).__init__(*args, **kwargs)


class Address(models.Model):

    # Fields
    line1 = models.CharField(max_length=128, help_text="Address Line 1")
    line2 = models.CharField(max_length=128, null=True,
                             blank=True, help_text="Address Line 2")
    city = models.CharField(max_length=128)
    state = USStateField()
    zipcode = USZipCodeField()

    # Metadata
    class Meta:
        ordering = ['state', 'city', 'line1', 'line2']

    # Methods
    def __str__(self):
        addr = str(self.line1) + '\n'
        addr += (str(self.line2) + '\n') if self.line2 else ''
        addr += str(self.city) + ', ' + str(self.state) + \
            ', ' + str(self.zipcode) + '\n'
        return addr


class Company(models.Model):

    # Fields
    name = models.CharField(max_length=128)
    address = models.ForeignKey('Address', on_delete=models.PROTECT)
    phone = models.CharField(max_length=17, null=True,
                             blank=True, help_text="Company Phone Number")

    # Metadata
    class Meta:
        ordering = ['name']

    # Methods
    def __str__(self):
        return str(self.name)


class SubContractor(models.Model):

    # Fields
    person = models.ForeignKey('Person', on_delete=models.PROTECT)
    trade_division = CSICode()

    # Metadata
    class Meta:
        ordering = ['trade_division', 'person']

    # Methods
    def __str__(self):
        return str(self.person) + ': ' + str(self.trade_division)


class SuperPerson(models.Model):

    # Roles
    PROPERTY_MANAGER = 'PROPERTY_MANAGER'
    MEP_ENGINEER = 'MEP_ENGINEER'
    ARCHITECT = 'ARCHITECT'
    CONSTRUCTION_MANAGER = 'CONSTRUCTION_MANAGER'
    BUILDING_ENGINEERING = 'BUILDING_ENGINEERING'
    PROJECT_MANAGER = 'PROJECT MANAGER'
    ASSISTANT_PROJECT_MANAGER = 'ASSISTANT_PROJECT_MANAGER'
    SUPERINTENDENT = 'SUPERINTENDENT'
    ACCOUNTING = 'ACCOUNTING'

    ROLE_MAX_LEN = 64
    ROLES = (
        (PROPERTY_MANAGER, 'Property Manager'),
        (MEP_ENGINEER, 'Mep Engineer'),
        (ARCHITECT, 'Architect'),
        (CONSTRUCTION_MANAGER, 'Construction Manager'),
        (BUILDING_ENGINEERING, 'Building Engineering'),
        (PROJECT_MANAGER, 'Project Manager'),
        (ASSISTANT_PROJECT_MANAGER, 'Assistant Project Manager'),
        (SUPERINTENDENT, 'Superintendent'),
        (ACCOUNTING, 'Accounting'),
    )

    # Fields
    person = models.ForeignKey('Person', on_delete=models.PROTECT)
    role = models.CharField(max_length=ROLE_MAX_LEN, choices=ROLES)

    # Metadata
    class Meta:
        ordering = ['role', 'person']

    # Methods
    def __str__(self):
        return str(self.person) + ': ' + str(self.role)


class Person(models.Model):
    PROPERTY_MANAGER = 'PROPERTY_MANAGER'
    MEP_ENGINEER = 'MEP_ENGINEER'
    ARCHITECT = 'ARCHITECT'
    CONSTRUCTION_MANAGER = 'CONSTRUCTION_MANAGER'
    BUILDING_ENGINEERING = 'BUILDING_ENGINEERING'
    ASSISTANT_PROJECT_MANAGER = 'ASSISTANT_PROJECT_MANAGER'
    SUPERINTENDENT = 'SUPERINTENDENT'
    ACCOUNTING = 'ACCOUNTING'

    ROLE_MAX_LEN = 64
    ROLES = (
        (PROPERTY_MANAGER, 'Property Manager'),
        (MEP_ENGINEER, 'Mep Engineer'),
        (ARCHITECT, 'Architect'),
        (CONSTRUCTION_MANAGER, 'Construction Manager'),
        (BUILDING_ENGINEERING, 'Building Engineering'),
        (ASSISTANT_PROJECT_MANAGER, 'Assistant Project Manager'),
        (SUPERINTENDENT, 'Superintendent'),
        (ACCOUNTING, 'Accounting'),
    )
    first_name = models.CharField(max_length=128, help_text="First Name")
    last_name = models.CharField(max_length=128, help_text="Last Name")
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=17, null=True,
                             blank=True, help_text="Primary Phone Number")
    cell = models.CharField(max_length=17, null=True,
                            blank=True, help_text="Cellphone Number")
    title = models.CharField(max_length=128, null=True,
                             blank=True, help_text="Professional Title")
    company = models.ForeignKey(
        'Company', on_delete=models.PROTECT, null=True, blank=True,
        help_text="Employer"
    )
    role = models.CharField(
        max_length=ROLE_MAX_LEN, choices=ROLES, null=True, blank=True
    )

    # Metadata
    class Meta:
        ordering = ['company', 'first_name', 'last_name',
                    'title', 'email', 'cell']
        # add trade_division to ordering

    # Methods
    def __str__(self):
        return str(self.name) + ', ' + str(self.company) + ': ' + str(self.title)

    @property
    def name(self):
        return str(self.first_name) + ' ' + str(self.last_name)

    def can_add_project(self, start_date, end_date, project_id=None):
        """ Check is superintendent has project in this time period"""

        for project in self.projects.all().exclude(id=project_id):
            if (start_date.date() >= project.start_date.date() and start_date.date() <= project.end_date.date()) or (start_date.date() <= project.start_date.date() and end_date.date() >= project.start_date.date()):
                return False
        return True

    def is_assigned_to_project(self, project_id):
        """Check is superintendent already assigned to a project"""

        if self.id == Project.objects.get(id=project_id).superintendent_id:
            return True
        return False


class Project(ApproveMixin, models.Model):

    # Validators
    validate_number = RegexValidator(
        regex=r'^[A-Z]{3} [\d]{4}\.[\d]{3}$',
        message='Invalid Project Number',
        code='invalid_project_number'
    )

    BID_NEGOTATION = '1'
    BUYOUT_SUBMITTALS = '2'
    IN_PROGRESS = '3'
    PUNCHLIST = '4'
    COMPLETED = '5'
    PHASES = (
        (BID_NEGOTATION, 'Bid/Negotation'),
        (BUYOUT_SUBMITTALS, 'Buyout/Submittals'),
        (IN_PROGRESS, 'In Progress'),
        (PUNCHLIST, 'Punchlist'),
        (COMPLETED, 'Completed')
    )
    # Fields
    name = models.CharField(max_length=128, help_text="Name of Project")
    address = models.ForeignKey('Address', null=True, on_delete=models.PROTECT)
    company = models.ForeignKey('Company', null=True, on_delete=models.PROTECT)
    value = MoneyField(
        decimal_places=2, default=0, default_currency='USD', max_digits=13
    )
    number = models.CharField(
        max_length=20, help_text="Project Identification Number")
    superintendent = models.ForeignKey(
        'core.Person', null=True, blank=True, on_delete=models.PROTECT, related_name="projects")
    contact = models.ForeignKey(
        'core.Person', null=True,  on_delete=models.PROTECT, related_name="contacts")
    architect = models.ForeignKey(
        'core.Person', null=True,  on_delete=models.PROTECT, related_name="architects")
    construction_manager = models.ForeignKey(
        'core.Person', null=True, on_delete=models.PROTECT, related_name="construction_managers")
    mep = models.ForeignKey(
        'core.Person', blank=True, null=True, on_delete=models.PROTECT, related_name="meps")
    manager = models.ForeignKey(
        'accounts.User', null=True, blank=True, on_delete=models.PROTECT, related_name="managers")
    assistant_manager = models.ForeignKey(
        'core.Person', blank=True, null=True, on_delete=models.PROTECT, related_name="assistant_managers")
    phase = models.CharField(max_length=255,
                             choices=PHASES, null=True, default=0)
    start_date = models.DateTimeField(null=True)
    end_date = models.DateTimeField(null=True)
    history = ArrayField(ArrayField(models.CharField(
        max_length=255, blank=True), size=2), blank=True, default=list, editable=False)
    previous_state = JSONField(null=True, blank=True, default=dict)

    # Metadata
    class Meta:
        ordering = ['company', 'value', 'name']

    # Methods
    def __str__(self):
        return str(self.name) + ', ' + str(self.company) + ': ' + str(self.value)

    # def get_superintendents_id(self):
    #     """Get list with id of project superintendents"""
    #     return [superintendent.id for superintendent in self.superintendent.all()]

    def is_superintendent_assigned(self, superintendent_id):
        """Check is superintendent already assigned to a project"""
        if self.superintendent_id == superintendent_id:
            return True
        return False

    def save_current_state(self):
        """Save current project fields state for undo last move operation"""

        current_state = self.__dict__.copy()
        del current_state['_state']
        del current_state['previous_state']

        self.previous_state['superintendents'] = json.dumps(
            self.superintendent_id)

        self.previous_state['project_manager'] = json.dumps(
            self.manager.id)

        for field in current_state:
            if field == 'start_date' or field == 'end_date':
                self.previous_state[field] = json.dumps(
                    current_state[field], cls=DjangoJSONEncoder)
            elif field == 'value':
                self.previous_state[field] = json.dumps(
                    {
                        'amount': str(self.value.amount),
                        'currency': str(self.value.currency),
                    }
                )
            else:
                self.previous_state[field] = json.dumps(current_state[field])
        self.save()

    def undo_last_change(self):
        previous_state = self.previous_state.copy()
        try:
            self.start_date = datetime.strptime(json.loads(
                previous_state['start_date']), '%Y-%m-%dT%H:%M:%SZ')
        except Exception:
            self.start_date = datetime.strptime(json.loads(
                previous_state['start_date']), '%Y-%m-%dT%H:%M:%S.%fZ')
        try:
            self.end_date = datetime.strptime(json.loads(
                previous_state['end_date']), '%Y-%m-%dT%H:%M:%SZ')
        except Exception:
            self.end_date = datetime.strptime(json.loads(
                previous_state['end_date']), '%Y-%m-%dT%H:%M:%S.%fZ')
        del previous_state['start_date']
        del previous_state['end_date']

        self.superintendent = None
        self.superintendent_id = json.loads(previous_state['superintendents'])
        del previous_state['superintendents']

        self.manager = None
        self.manager_id = json.loads(previous_state['project_manager'])
        del previous_state['project_manager']

        for field in previous_state:
            if field == 'value':
                value = json.loads(previous_state[field])
                if value['amount'] and value['currency']:
                    self.__dict__[field] = Money(
                        Decimal(value['amount']), value['currency'])
                    break
            self.__dict__[field] = json.loads(previous_state[field])

        self.save()


class PurchaseOrder(models.Model):

    # Types
    CHANGE_ORDER = "CHANGE_ORDER"
    BASE_BID = "BASE_BID"
    NCC = "NCC"
    BACK_CHARGE = "BACK_CHARGE"
    TYPES = (
        (CHANGE_ORDER, "Change Order"),
        (BASE_BID, "Base Bid"),
        (NCC, "NCC"),
        (BACK_CHARGE, "Back Charge"),
    )

    # Fields
    project = models.ForeignKey('Project', on_delete=models.PROTECT)
    recipient = models.ForeignKey('Person', on_delete=models.PROTECT)
    company = models.ForeignKey("Company", on_delete=models.PROTECT)
    trade_division = CSICode()
    value = models.PositiveIntegerField()
    type = models.CharField(max_length=32, choices=TYPES, default=CHANGE_ORDER)
    description = models.TextField()

    # Metadata
    class Meta:
        ordering = ['company', 'project', 'value']

    # Methods
    def __str__(self):
        return (str(self.project) + "\n"
                + "To:" + self.recipient.name + "\n"
                + str(self.value) + "\n"
                + str(self.description) + "\n")


class CommonForm(models.Model):

    # Fields
    name = models.CharField(max_length=128)
    project = models.ForeignKey(
        'Project',
        on_delete=models.PROTECT
    )
    project_recipient = models.CharField(
        choices=SuperPerson.ROLES,
        max_length=SuperPerson.ROLE_MAX_LEN,
        default=SuperPerson.ARCHITECT
    )
    project_sender = models.CharField(
        choices=SuperPerson.ROLES,
        max_length=SuperPerson.ROLE_MAX_LEN,
        default=SuperPerson.PROJECT_MANAGER
    )
    trade_division = CSICode()
    # line_items related field to ToCItem

    # Metadata
    class Meta:
        ordering = ['project', 'name', 'id']

    # Methods
    def __str__(self):
        return str(self.project.number) + ": " + str(self.project.name) + ', ' + str(self.project.company)


class ToCIItem(models.Model):

    # Fields
    line_item = models.CharField(max_length=128)
    form = models.ForeignKey(
        'CommonForm', on_delete=models.CASCADE, related_name='line_items')

    # Metadata
    class Meta:
        ordering = ['form', 'line_item']

    # Methods
    def __str__(self):
        return self.line_item


class Submittal(models.Model):

    # Fields
    form = models.ForeignKey('CommonForm', on_delete=models.CASCADE, null=True)

    # Metadata
    class Meta:
        ordering = ['form']

    # Methods
    def __str__(self):
        return '(Submittal)' + str(self.form)


class RFI(models.Model):

    # Fields
    form = models.ForeignKey('CommonForm', on_delete=models.CASCADE, null=True)
    description = models.TextField()
    plan_page_number = models.CharField(max_length=15, blank=True, null=True)
    plan_detail_number = models.CharField(max_length=15, blank=True, null=True)

    # Metadata
    class Meta:
        ordering = ['form']

    # Methods
    def __str__(self):
        return '(RFI)' + str(self.form) + '\n' + str(self.description) + '\n'
