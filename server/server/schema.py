import graphene
import graphql_jwt
from accounts.mutations import (
    LoginMutation, RegisterMutation, SendConfirmationEmailMutation,
    ResetPasswordMutation, UserEditMutation
)
from accounts.schema import Query as AccountsQuery
from core.mutations import (ProjectCreateMutation, ProjectUpdateMutation,
                            CreatePersonMutation, UndoProjectLastChangeMutation,
                            ApproveProjectChangesMutation, ApproveProjectCreationMutation)
from core.schema import Query as CoreQuery


class Query(AccountsQuery, CoreQuery, graphene.ObjectType):
    pass


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    register = RegisterMutation.Field()
    login = LoginMutation.Field()
    edit_user = UserEditMutation.Field()
    confirm_email = SendConfirmationEmailMutation.Field()
    reset_password = ResetPasswordMutation.Field()
    create_project = ProjectCreateMutation.Field()
    update_project = ProjectUpdateMutation.Field()
    create_person = CreatePersonMutation.Field()
    undo_last_project_change = UndoProjectLastChangeMutation.Field()
    approve_project_changes = ApproveProjectChangesMutation.Field()
    approve_project_creation = ApproveProjectCreationMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
