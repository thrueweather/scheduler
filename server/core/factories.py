import factory


class PersonFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'core.Person'

    first_name = factory.Sequence(lambda n: 'Person %s' % n)
    last_name = factory.Sequence(lambda n: 'Person %s' % n)
    email = factory.Sequence(lambda n: 'person%s@email.com' % n)
    phone = '(541) 754-3010'
    cell = '(541) 643-2909'
    title = factory.Sequence(lambda n: 'Title %s' % n)
    role = 'SUPERINTENDENT'


class AddressFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'core.Address'

    line1 = factory.Sequence(lambda n: 'Main address %s' % n)
    line2 = factory.Sequence(lambda n: 'Additional address %s' % n)
    city = factory.Sequence(lambda n: 'City %s' % n)
    state = 'NY'
    zipcode = '63100'


class CompanyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'core.Company'

    name = factory.Sequence(lambda n: 'Company %s' % n)
    address = factory.SubFactory(AddressFactory)
    phone = '(541) 643-2909'
