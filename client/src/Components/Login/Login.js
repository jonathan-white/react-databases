import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Alert } from 'reactstrap';
import { auth } from '../../firebase';
import './Login.css';
import API from '../../utils/API';

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

          // Fetch user's databases
          API.getDatabases(resp.user.uid)
            .then(resp => dispatch({
              type: 'REFRESH_DB_LIST',
              databases: resp.data
            }))
            .catch(err => dispatch({
              type: 'RECORD_ERROR',
              error: err
            }));
        })
        .catch(err => dispatch({
          type: 'FORM_ERROR',
          error: err
        }));
    }
  }
}

// Presentational Component
const LoginForm = ({ username, password, error, handleInputChange, submitCredentials }) => (
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
);

const Login = connect(
  mapStateToLoginProps,
  mapsDispatchToLoginProps
)(LoginForm);

export default Login;
