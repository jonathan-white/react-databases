import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { auth } from '../../firebase';
import './Logout.css';

const mapStateToLoginProps = (state) => {
  return {
    error: state.formManager.error
  }
};

const mapsDispatchToLoginProps = (dispatch) => {
  return {
    logout: (event) => {
      event.preventDefault();
      // Use Firebase to check auth status
      auth.doSignOut();
      dispatch({
        type: 'LOGOUT_USER'
      });
      document.querySelector('#username').value = '';
      document.querySelector('#password').value = '';
      localStorage.removeItem('uid');
    }
  }
}

// Presentational Component
const LogoutButton = ({ logout }) => (
    <Button color="dark" className="btn-logout" onClick={(e) => logout(e)}>
        Logout
    </Button>
);

const Logout = connect(
  mapStateToLoginProps,
  mapsDispatchToLoginProps
)(LogoutButton);


export default Logout;