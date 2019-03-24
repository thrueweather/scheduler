import graphene
from graphene_django.types import DjangoObjectType
from graphql_jwt.decorators import login_required

from .models import User


class UserRole(graphene.Interface):
    role = graphene.String()


class UserType(DjangoObjectType):
    class Meta:
        model = User
        interfaces = (UserRole,)


class Query:
    users = graphene.List(UserType, role=graphene.String(required=False))
    me = graphene.Field(UserType)

    def resolve_users(self, info, role):
        if role != 'ALL':
            return User.objects.filter(role=role)
        return User.objects.all()

    @login_required
    def resolve_me(self, info):
        return info.context.user
