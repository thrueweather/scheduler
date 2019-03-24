# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['test_create_person_mutation1 1'] = {
    'data': {
        'createPerson': {
            'errors': [
            ],
            'person': {
                'cell': '(541) 421-0787',
                'company': {
                    'address': {
                        'id': '1',
                        'line1': 'Main address 0',
                        'line2': 'Additional address 0'
                    },
                    'id': '1',
                    'name': 'Company 0',
                    'phone': '(541) 643-2909'
                },
                'email': 'test@email.com',
                'firstName': 'Test',
                'id': '1',
                'lastName': 'Person',
                'phone': '(541) 532-1898',
                'projects': [
                ],
                'role': 'SUPERINTENDENT',
                'title': 'Test title'
            }
        }
    }
}

snapshots['test_create_person_mutation2 1'] = {
    'data': {
        'createPerson': {
            'errors': [
            ],
            'person': {
                'cell': None,
                'company': None,
                'email': None,
                'firstName': 'Test first name',
                'id': '2',
                'lastName': 'Test last name',
                'phone': None,
                'projects': [
                ],
                'role': None,
                'title': None
            }
        }
    }
}

snapshots['test_create_person_mutation3 1'] = {
    'data': {
        'createPerson': {
            'errors': [
                'Provided company does not exist'
            ],
            'person': None
        }
    }
}
