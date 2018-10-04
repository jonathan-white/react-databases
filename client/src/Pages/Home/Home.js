import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

import logo from '../../images/gear.svg';
import DatabaseViewer from '../../Components/DatabaseViewer';
import LoginForm from '../../Components/Login';
import SignupForm from '../../Components/Signup';
import LogoutButton from '../../Components/Logout';
import ModalForms from '../../Components/ModalForms';

import { auth } from  '../../firebase';
import { default as actions } from '../../utils/actions';
import './Home.css';

const mapStateToHomeProps = (state) => {
  return {
    dbError: state.dbManager.error,
		authUser: state.userManager.authUser,
		showSignUpForm: state.userManager.showSignUpForm
  }
};

const mapDispatchToHomeProps = (dispatch) => {
	return actions(dispatch);
};

class HomeDisplay extends React.Component {
  
  componentDidMount(){
    auth.hasAuthStateChanged((user) => {
      if(user){
        this.props.loadUserData(user);
      }
    })
  }

  render() {
    const { authUser, dbError, showSignUpForm } = this.props;

    return (
      <div className="App">
				{showSignUpForm && (
					<div className="signup-section">
						<div className="gear-1"></div>
						<div className="signup-form">
							<SignupForm />
						</div>
					</div>
				)}
        <header className={`${authUser ? 'signed-in' : ''}`}>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Database Management</h1>
          <LoginForm />
          {authUser && <LogoutButton />}
        </header>
        {authUser && <DatabaseViewer />}
        <ModalForms />
        {dbError && <Alert color="danger" className="error-message">{dbError.message}</Alert>}
      </div>
    )
  }
}

const Home = connect(
  mapStateToHomeProps,
  mapDispatchToHomeProps
)(HomeDisplay);

export default Home;