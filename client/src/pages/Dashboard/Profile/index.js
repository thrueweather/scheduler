import React, { useState, Fragment } from "react";
import { graphql, compose } from "react-apollo";

import { MDBRow } from "mdbreact";
import Profile from "../../../components/Profile";
import UserEditForm from "../../../components/Forms/UserEditForm";
import Header from "../../../components/Header";

import { getBase64 } from "../../../utils";
import { withAuth } from "../../../hocs/PrivateRoute";
import { me, editUser } from "../../../queries";

const EditUser = props => {
  const [state, setState] = useState({
    avatar: "",
    imageError: null
  });

  const handleImageChange = e => {
    try {
      if (!e.target.files) {
        return;
      }
      let file = e.target.files[0];
      if (file.size <= 1048576) {
        getBase64(file)
          .then(image => (file = image))
          .then(() => setState({ avatar: file, imageError: null }));
      }
      setState({ imageError: "max size 1MB" });
    } catch (error) {}
  };

  const handleEditUser = (values, { setErrors }) => {
    let { firstName, email } = values;
    props
      .edit({
        variables: {
          firstName: firstName || props.user.me.firstName,
          email: email,
          avatar: state.avatar
        },
        refetchQueries: [{ query: me }]
      })
      .then(response => {
        if (response.data.editUser.error.validationErrors.length) {
          let errors = {};
          response.data.editUser.error.validationErrors.map(error => {
            if (error["field"] === "email") {
              errors["email"] = error["messages"].join(" ");
            } else {
              errors[error] = error["messages"];
            }
            return null;
          });
          setErrors(errors);
        }
      });
  };
  const user = props.user.me;
  if (props.user.loading) return null;
  return (
    <Fragment>
      <Header title="Profile" />
        <div className="p-5 p-4">
          <MDBRow>
            <Profile profile={user} />
            <UserEditForm
              initialValues={user}
              handleEditUser={handleEditUser}
              handleImageChange={handleImageChange}
              error={state.imageError}
            />
          </MDBRow>
        </div>
    </Fragment>
  );
};

export default compose(
  graphql(editUser, { name: "edit" }),
  graphql(me, { name: "user" })
)(withAuth(EditUser));
