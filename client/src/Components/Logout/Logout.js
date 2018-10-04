import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { default as actions } from '../../utils/actions';
import './Logout.css';

const mapsDispatchToLogoutProps = (dispatch) => {
	return actions(dispatch);
};

// Presentational Component
const LogoutButton = ({ logoutUser }) => (
    <Button color="dark" className="btn-logout" onClick={(e) => logoutUser(e)}>
        Logout
    </Button>
);

const Logout = connect(null,mapsDispatchToLogoutProps)(LogoutButton);


export default Logout;