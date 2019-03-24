from django.db import models
from django.core.mail import send_mail
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import ugettext_lazy as _

from .managers import UserManager

from colorfield.fields import ColorField


class User(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(
        _('first name'), max_length=128, help_text="First Name", null=True)
    last_name = models.CharField(
        _('last name'), max_length=128, help_text="Last Name", null=True)
    phone = models.CharField(_('phone'), max_length=17, null=True,
                             blank=True, help_text="Primary Phone Number")
    cell = models.CharField(_('cell'), max_length=17, null=True,
                            blank=True, help_text="Cellphone Number")
    title = models.CharField(_('title'), max_length=128,
                             null=True, blank=True, help_text="Professional Title")
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    company = models.ForeignKey(
        'core.Company', on_delete=models.PROTECT, help_text="Employer", blank=True, default=None, null=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_staff = models.BooleanField(_('staff'), default=True)
    role = models.CharField(max_length=255, default='PROJECT_MANAGER')
    color = ColorField(default='#FF0000', null=True, blank=True)
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        ordering = ['company', 'first_name', 'last_name',
                    'title', 'email', 'cell']
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return str(self.name) + ', ' + str(self.company) + ': ' + str(self.title)

    @property
    def name(self):
        return str(self.first_name) + ' ' + str(self.last_name)

    def email_user(self, subject, message, from_email=None, **kwargs):
        '''
        Sends an email to this User.
        '''
        send_mail(subject, message, from_email, [self.email], **kwargs)
