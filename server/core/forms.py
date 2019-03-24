from decimal import Decimal

from django import forms
from django.forms import ModelForm

from .models import Person, Project


class ProjectForm(ModelForm):
    project_id = forms.IntegerField()
    superintendent_id = forms.IntegerField(required=False)
    manager_id = forms.IntegerField()
    start_date = forms.DateTimeField()
    end_date = forms.DateTimeField()
    unassigned = forms.BooleanField(required=False)
    value = forms.FloatField()

    def clean_value(self):
        if self.cleaned_data['value'] < Decimal('0.00'):
            raise forms.ValidationError(
                message=(
                    'Ensure this value is greater than 0.'
                ), code='min_value',
            )

        return self.cleaned_data['value']

    class Meta:
        model = Project
        fields = [
            'name', 'value',
            'number', 'superintendent_id',
            'manager_id', 'start_date', 'end_date', 'unassigned'
        ]


class UpdateProjectForm(ModelForm):
    project_id = forms.IntegerField()
    manager_id = forms.IntegerField()
    superintendent_id = forms.IntegerField(required=False)
    start_date = forms.DateTimeField(required=False)
    end_date = forms.DateTimeField(required=False)

    class Meta:
        model = Project
        fields = ['project_id', 'manager_id',
                  'superintendent_id', 'start_date', 'end_date']


class PersonForm(ModelForm):
    company_id = forms.IntegerField(required=False)

    class Meta:
        model = Person
        fields = ['email', 'first_name', 'last_name',
                  'company_id', 'role', 'phone', 'cell', 'title']
