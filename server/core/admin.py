from django.contrib import admin

from .models import (Address, Company, SubContractor,
                     SuperPerson, Person,
                     Project, PurchaseOrder, CommonForm,
                     ToCIItem, Submittal, RFI)


admin.site.register(Address)
admin.site.register(Company)
admin.site.register(SubContractor)
admin.site.register(SuperPerson)
admin.site.register(Person)
admin.site.register(Project)
admin.site.register(PurchaseOrder)
admin.site.register(CommonForm)
admin.site.register(ToCIItem)
admin.site.register(Submittal)
admin.site.register(RFI)
