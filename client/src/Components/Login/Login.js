import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Alert } from 'reactstrap';
import './Login.css';
import { default as actions } from '../../utils/actions';

const mapStateToLoginProps = (state) => {
  return {
    username: state.formManager.username,
    password: state.formManager.password,
    error: state.formManager.error
  }
};

const mapsDispatchToLoginProps = (dispatch) => {
	return actions(dispatch);
};

const LoginForm = ({ username, password, error, handleInputChange, submitCredentials }) => (
    <div className="login">
      <Form>
        <Input id="username" type="text" autoComplete="off" name="username"
          placeholder="Username" onChange={(e) => handleInputChange(e.target.name, e.target.value)}
        />
        <Input id="password" type="password" autoComplete="off" name="password"
          placeholder="Password" onChange={(e) => handleInputChange(e.target.name, e.target.value)}
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
