import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Alert, FormGroup, Label } from 'reactstrap';
import './Signup.css';
import { default as stateKeys } from '../../utils/stateKeys';
import { default as actions } from '../../utils/actions';

const mapStateToSignupProps = (state) => {
  return stateKeys(state);
};

const mapsDispatchToSignupProps = (dispatch) => {
	return actions(dispatch);
};

const SignupForm = ({ username, password, signUpError, handleInputChange, 
	signupUser, toggleSignUpForm
}) => (
    <div className="signup">
      <Form className="mb-4">
				<FormGroup>
					<Label for="new-username">Email Address:</Label>
					<Input id="new-username" type="text" autoComplete="off" name="username"
						onChange={(e) => handleInputChange(e.target.name, e.target.value)}
					/>
				</FormGroup>
				<FormGroup>
					<Label for="new-password">Password:</Label>
					<Input id="new-password" type="password" autoComplete="off" name="password"
						onChange={(e) => handleInputChange(e.target.name, e.target.value)}
					/>
				</FormGroup>
				<Button color="primary" className="btn-add-new-user" onClick={(e) => {
					signupUser(e, username, password);
				}}>
          Join Now
        </Button>
      </Form>
			{signUpError && <Alert color="danger">{signUpError.message}</Alert>}
			<div className="close-signup" onClick={() => toggleSignUpForm()}>Close</div>
    </div>
);

const Signup = connect(
  mapStateToSignupProps,
  mapsDispatchToSignupProps
)(SignupForm);

export default Signup;
