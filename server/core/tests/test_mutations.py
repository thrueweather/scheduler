import pytest

from graphene.test import Client
from server.schema import schema

from core.factories import CompanyFactory

create_person_gql = """
      mutation createPerson($email: String, $firstName: String!, $lastName: String!, $companyId: Int, $role: String, $phone: String, $cell: String, $title: String) {
        createPerson(email: $email, firstName: $firstName, lastName: $lastName, companyId: $companyId, role: $role, phone: $phone, cell: $cell, title: $title) {
          person {
            id
            firstName
            lastName
			email
			phone
			cell
			title
			company{
				id
				name
				address{
					id
					line1
					line2
				}
				phone
			}
			role
			projects{
				id
				name
				address{
					id
					line1
					line2
				}
				phase
			}
          }
		  errors
        }
      }
    """


@pytest.mark.django_db
def test_create_person_mutation1(snapshot):
    """ Test success create person mutation with full data"""

    company = CompanyFactory()

    client = Client(schema)

    executed = client.execute(create_person_gql, variable_values={
        'email': "test@email.com",
        'firstName': 'Test',
        'lastName': 'Person',
        'companyId': company.id,
        'role': 'SUPERINTENDENT',
        'phone': '(541) 532-1898',
        'cell': '(541) 421-0787',
        'title': 'Test title'
    })

    snapshot.assert_match(executed)


@pytest.mark.django_db
def test_create_person_mutation2(snapshot):
    """ Test create person mutation with required fields only"""

    client = Client(schema)

    executed = client.execute(create_person_gql, variable_values={
        'firstName': "Test first name",
        'lastName': "Test last name"
    })

    snapshot.assert_match(executed)


@pytest.mark.django_db
def test_create_person_mutation3(snapshot):
    """ Test create person mutation with incorrect data"""

    client = Client(schema)

    executed = client.execute(create_person_gql, variable_values={
        'firstName': "Test first name",
        'lastName': "Test last name",
        'companyId': -1
    })

    snapshot.assert_match(executed)
