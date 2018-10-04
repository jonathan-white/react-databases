import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Alert } from 'reactstrap';
import './Login.css';
import { default as actions } from '../../utils/actions';

const mapStateToLoginProps = (state) => {
  return {
    username: state.formManager.username,
    password: state.formManager.password,
    loginError: state.userManager.loginError
  }
};

const mapsDispatchToLoginProps = (dispatch) => {
	return actions(dispatch);
};

const LoginForm = ({ username, password, loginError, handleInputChange, 
	loginUser, toggleSignUpForm
}) => (
    <div className="login">
      <Form>
        <Input id="username" type="text" autoComplete="off" name="username"
          placeholder="Username" onChange={(e) => handleInputChange(e.target.name, e.target.value)}
        />
        <Input id="password" type="password" autoComplete="off" name="password"
          placeholder="Password" onChange={(e) => handleInputChange(e.target.name, e.target.value)}
        />
        <Button color="dark" onClick={(e) => loginUser(e, username, password)}>
          Login
        </Button>
				<Button color="link" className="text-white btn-join" onClick={() => toggleSignUpForm()}>
					Signup
				</Button>
      </Form>
      {loginError && <Alert color="danger">{loginError.message}</Alert>}
    </div>
);

const Login = connect(
  mapStateToLoginProps,
  mapsDispatchToLoginProps
)(LoginForm);

export default Login;
