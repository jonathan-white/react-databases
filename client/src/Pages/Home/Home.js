import React from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Input } from 'reactstrap';

import logo from '../../images/gear.svg';
import DatabaseList from '../../Components/DatabaseList';
import LoginForm from '../../Components/Login';
import LogoutButton from '../../Components/Logout';
import ModalForms from '../../Components/ModalForms';

import { auth } from  '../../firebase';
import { default as actions } from '../../utils/actions';
import './Home.css';

const mapStateToHomeProps = (state) => {
  return {
    databases: state.dbManager.databases,
    dbError: state.dbManager.error,
    authUser: state.userManager.authUser,
    query: state.formManager.query,
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
    const { authUser, databases, dbError, query } = this.props;
    
    // Filter the list of databases
    let dbList;
    if(databases && query){
      dbList = databases.filter(d => {
        if(d.title.toLowerCase().includes(query.toLowerCase() || '')){
          return d;
        } else {
          return false;
        }
      });
    }
    dbList = dbList || databases;

    return (
      <div className="App">
        <header className={`${authUser ? 'signed-in' : ''}`}>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Database Management</h1>
          <LoginForm />
          {authUser && <LogoutButton /> }
        </header>
        {authUser && (
          <div className="container my-4">
            <div className="row">
              <div className="col-4">
                <Input type="text" className="search" placeholder="Search..."
                  onChange={(e) => this.props.searchFor(e.target.value)}
                />
              </div>
            </div>
            <div className="row column-headers">
              <div className="col-4">
                <h4>
                  <span className="mr-2">Databases</span>
                  <FontAwesomeIcon className="btn-add text-success"
                    icon="plus-circle" onClick={() => this.props.toggleModal('showDBModal')} />
                </h4>
              </div>
              <div className="col-4">
                <h4>Tables</h4>
              </div>
              <div className="col-4">
                <h4>Field Details</h4>
              </div>
            </div>
            <div className="row">
              <DatabaseList databases={dbList} />
            </div>
          </div>
        )}
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