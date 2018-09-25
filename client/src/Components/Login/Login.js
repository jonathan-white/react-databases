import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Alert } from 'reactstrap';

import { auth } from '../../firebase';
import './Login.css';

const mapStateToLoginProps = (state) => {
  return {
    username: state.formManager.username,
    password: state.formManager.password,
    error: state.formManager.error
  }
};

const mapsDispatchToLoginProps = (dispatch) => {
  return {
    handleInputChange: (event) => {
      dispatch({
        type: 'ADD_INPUT_CHANGE',
        name: event.target.name,
        value: event.target.value
      })
    },
    submitCredentials: (event, username, password) => {
      event.preventDefault();
      // Use Firebase to check auth status
      auth.doSignInWithEmailAndPassword(username, password)
        .then((resp) => {
          // Once authenticated...
          dispatch({
            type: 'AUTHENTICATED_USER',
            user: resp.user
          });
        })
        .catch(err => dispatch({
          type: 'FORM_ERROR',
          error: err
        }));
    }
  }
}

const Login = connect(
  mapStateToLoginProps,
  mapsDispatchToLoginProps
)(({ username, password, error, handleInputChange, submitCredentials }) => (
    <div className="login">
      <Form>
        <Input type="text" autoComplete="off" name="username"
          placeholder="Username" onChange={(e) => handleInputChange(e)}
        />
        <Input type="password" autoComplete="off" name="password"
          placeholder="Password" onChange={(e) => handleInputChange(e)}
        />
        <Button color="dark" onClick={(e) => submitCredentials(e, username, password)}>
          Submit
        </Button>
      </Form>
      {error && <Alert color="danger">{error.message}</Alert>}
    </div>
))

export default Login;
