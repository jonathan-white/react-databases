import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import logo from '../images/gear.svg';
import DatabaseList from '../Components/Database';
import LoginForm from '../Components/Login';
import LogoutButton from '../Components/Logout';
import API from '../utils/API';
import { auth } from  '../firebase';

class Home extends Component {
  constructor(props){
    super(props);

    this.addDatabase = this.addDatabase.bind(this);
    this.addTable = this.addTable.bind(this);
    this.addField = this.addField.bind(this);
    this.removeDB = this.removeDB.bind(this);
  };

  componentDidMount() {
    const { store } = this.context;

    auth.hasAuthStateChanged((user) => {
      if(user){
        console.log('user is signed in.');
        store.dispatch({
          type: 'AUTHENTICATED_USER',
          user: user
        });

        // Fetch user's databases
        API.getDatabases(user.uid)
          .then(resp => store.dispatch({
            type: 'REFRESH_DB_LIST',
            databases: resp.data
          }))
          .catch(err => store.dispatch({
            type: 'RECORD_ERROR',
            error: err
          }));
      } else {
        console.log('No user is signed in.');
      }
    })

    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  refreshDBList() {
    const { store } = this.context;
    const state = store.getState();

    API.getDatabases(state.formManager.userId)
      .then(resp => store.dispatch({
        type: 'REFRESH_DB_LIST',
        databases: resp.data
      }))
      .catch(err => store.dispatch({
        type: 'RECORD_ERROR',
        error: err
      }));
  };

  refreshSelectedDB(){
    const { store } = this.context;
    const state = store.getState();

    if(state.dbManager.selectedDB) {
      API.getDatabase(state.formManager.userId, state.dbManager.selectedDB._id)
        .then(resp => this.setState({
          selectedDB: resp.data[0],
          tables: resp.data[0].tables
        }))
        .catch(err => this.setState({ error: err }));
    }
  };

  refreshSelectedTable(){
    const { store } = this.context;
    const state = store.getState();

    if(state.dbManager.selectedTable) {
      API.getTable(state.formManager.userId, state.dbManager.selectedTable._id)
        .then(resp => this.setState({ selectedTable: resp.data }))
        .catch(err => this.setState({ error: err }));
    }
  };

  updateError(error){
    const { store } = this.context;
    store.dispatch({
      type: 'RECORD_ERROR',
      error: error
    })
  };

  // Create API
  addDatabase(event, newDB) {
    event.preventDefault();
    const { store } = this.context;

    API.addDatabase(newDB)
      .then(() => {
        API.getDatabases(newDB.userId)
          .then(resp => store.dispatch({
            type: 'UPDATE_DATABASES',
            databases: resp.data
          }))
          .catch(err => this.updateError(err));
      })
      .catch(err => this.updateError(err));
  };

  addTable(event, newTable) {
    event.preventDefault();
    const { store } = this.context;

    API.addTable(newTable)
      .then(() =>
        API.getDatabases(newTable.userId)
        .then(resp => store.dispatch({
          type: 'UPDATE_TABLES',
          databases: resp.data
        }))
        .catch(err => this.updateError(err))
      )
      .catch(err => this.updateError(err));
  };

  addField(event, newField) {
    event.preventDefault();
    const { store } = this.context;

    API.addField(newField)
      .then(() => 
        API.getDatabases(newField.userId)
          .then(resp => store.dispatch({
            type: 'UPDATE_FIELDS',
            databases: resp.data
          }))
          .catch(err => this.updateError(err))
      )
      .catch(err => this.updateError(err));
  };

  // Delete API
  removeDB(userId, id){
    API.removeDB(userId,id)
      .then(() => this.refreshDBList())
      .catch(err => this.updateError(err));
  };

  handleInputChange(event){
    const { store } = this.context;
    const { value, name } = event.target;

    store.dispatch({
      type: 'ADD_INPUT_CHANGE',
      name: name,
      value: value
    });
  };

  toggleModal(modalName) {
    const { store } = this.context;
    store.dispatch({
      type: 'TOGGLE_MODAL',
      name: modalName
    })
  };

  addProjectToDB(event, userId, dbId, projData){
    event.preventDefault();
    const { store } = this.context;

    API.addProject(projData)
      .then(resp => {
        // Link new project to the database
        API.addDBProject(dbId, { projectId: resp.data._id })
          .then(result => {
            store.dispatch({
              type: 'REFRESH_DB',
              database: resp.data
            });
          })
          .catch(err => this.updateError(err));

        // Reset the error
        this.updateError(null)
      })
      .catch(err => this.updateError(err));
  };

  render() {
    const { store } = this.context;
    const state = store.getState();
    console.log(state);

    const { databases, selectedDB, selectedTable, error } = state.dbManager;
    const { showDBModal, showTableModal, showFieldModal, showProjectModal } = state.modalManager;
    const { authUser, userId, dbTitle, dbSummary, dbType, tbTitle, tbSummary, tbRecordCount,
    fdTitle, fdSummary, fdDataType, fdDataLength, fdAllowNull, fdKey, fdDefaultValue,
    prjTitle, prjSummary, prjWebsite } = state.formManager;

    // Filter the list of databases
    let dbList;
    if(databases && state.formManager.query){
      dbList = databases.filter(d => {
        if(d.title.toLowerCase().includes(state.formManager.query.toLowerCase() || '')){
          return d;
        } else {
          return false;
        }
      });
    }
    dbList = dbList || databases;
    
    // Database Form Data
    const dbData = {
      userId: userId,
      title: dbTitle,
      summary: dbSummary,
      type: dbType || 'MySQL'
    };
    const isValidDB = dbTitle !== null && dbTitle !== '' &&
    dbSummary !== null && dbSummary !== '' &&
    dbType !== null && dbType !== '';
    
    // Table Form Data
    const tableData = {
      userId: userId,
      databaseId: (selectedDB) ? selectedDB._id : '',
      title: tbTitle,
      summary: tbSummary,
      recordCount: tbRecordCount || 0
    };
    const isValidTable = tbTitle !== null && tbTitle !== '';
    
    // Field Form Data
    const fieldData = {
      userId: userId,
      tableId: (selectedTable) ? selectedTable._id : null,
      title: fdTitle,
      summary: fdSummary,
      dataType: fdDataType || 'varchar',
      dataLength: fdDataLength,
      allowNull: fdAllowNull || false,
      key: fdKey,
      defaultValue: fdDefaultValue
    };
    const isValidField = fdTitle !== null && fdTitle !== '';
    
    // Project Form Data
    const projectData = {
      userId: userId,
      title: prjTitle,
      summary: prjSummary,
      website: prjWebsite
    };
    const isValidProject = prjTitle !== null && prjTitle !== '' &&
    prjSummary !== null && prjSummary !== '';

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
                  onChange={(e) => {
                    store.dispatch({
                      type: 'SEARCH_QUERY',
                      query: e.target.value
                    });
                  }}
                />
              </div>
            </div>
            <div className="row column-headers">
              <div className="col-4">
                <h4>
                  <span className="mr-2">Databases</span>
                  <FontAwesomeIcon className="btn-add text-success"
                    icon="plus-circle" onClick={() => this.toggleModal('showDBModal')} />
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
              <DatabaseList
                databases={dbList}
                removeDB={this.removeDB}
                removeTable={this.removeTable}
                removeField={this.removeField}
              />
            </div>
          </div>
        )}
        
        {/* New Database */}
        <Modal isOpen={showDBModal} toggle={() => this.toggleModal('showDBModal')}>
          <Form>
            <ModalHeader toggle={() => this.toggleModal('showDBModal')}>
              Add Database
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="dbTitle">
                  Database Name <span className="required">*</span>
                </Label>
                <Input type="text" name="dbTitle" id="dbTitle" autoFocus
                  onChange={(e) => this.handleInputChange(e)} />
              </FormGroup>
              <FormGroup>
                <Label for="dbSummary">
                  Description <span className="required">*</span>
                </Label>
                <Input type="textarea" name="dbSummary" id="dbSummary"
                  onChange={(e) => this.handleInputChange(e)}/>
              </FormGroup>
              <FormGroup>
                <Label for="dbType">
                  Type <span className="required">*</span>
                </Label>
                <Input type="select" name="dbType" id="dbType"
                  onChange={(e) => this.handleInputChange(e)}>
                  <option>MySQL</option>
                  <option>MongoDB</option>
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <FormText color="muted">* Required Field</FormText>
              <Button color={`${isValidDB ? 'primary' : 'secondary'}`}
                disabled={!isValidDB} onClick={(e) => {
                  this.toggleModal('showDBModal');
                  this.addDatabase(e, dbData);
                }}>Save</Button>{' '}
              <Button color="danger" onClick={() => this.toggleModal('showDBModal')}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* New Table Modal Form*/}
        <Modal isOpen={showTableModal} toggle={() => this.toggleModal('showTableModal')}>
          <Form>
            <ModalHeader toggle={() => this.toggleModal('showTableModal')}>
              Add New Table
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="tbTitle">
                  Table Name <span className="required">*</span>
                </Label>
                <Input type="text" name="tbTitle" id="tbTitle" autoFocus
                  onChange={(e) => this.handleInputChange(e)} />
              </FormGroup>
              <FormGroup>
                <Label for="tbSummary">Description</Label>
                <Input type="textarea" name="tbSummary" id="tbSummary"
                  onChange={(e) => this.handleInputChange(e)}/>
              </FormGroup>
              <FormGroup>
                <Label for="tbRecordsCount">Number of Records</Label>
                <Input type="number" name="tbRecordCount" id="tbRecordCount"
                  onChange={(e) => this.handleInputChange(e)} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <FormText color="muted">* Required Field</FormText>
              <Button color={`${isValidTable ? 'primary' : 'secondary'}`}
                disabled={!isValidTable} onClick={(e) => {
                  this.toggleModal('showTableModal');
                  this.addTable(e, tableData);
                }}>Save</Button>{' '}
              <Button color="danger" onClick={() => this.toggleModal('showTableModal')}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* New Field Modal Form */}
        <Modal isOpen={showFieldModal} toggle={() => this.toggleModal('showFieldModal')}>
          <Form>
            <ModalHeader toggle={() => this.toggleModal('showFieldModal')}>
              New Field Details
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="fdTitle">
                  Field Name <span className="required">*</span>
                </Label>
                <Input type="text" name="fdTitle" id="fdTitle"
                  onChange={(e) => this.handleInputChange(e)}/>
              </FormGroup>
              <FormGroup>
                <Label for="fdSummary">Description</Label>
                <Input type="textarea" name="fdSummary" id="fdSummary"
                  onChange={(e) => this.handleInputChange(e)}/>
              </FormGroup>
              <div className="d-flex">
                <div className="mr-2">
                  <FormGroup>
                    <Label for="fdDataType">Data Type</Label>
                    <Input type="select" name="fdDataType" id="fdDataType"
                      defaultValue="varchar"
                      onChange={(e) => this.handleInputChange(e)}>
                      <option>boolean</option>
                      <option>datetime</option>
                      <option>decimal</option>
                      <option>double</option>
                      <option>int</option>
                      <option>text</option>
                      <option>tinyint</option>
                      <option>varchar</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="fdDataLength">Length</Label>
                    <Input type="number" name="fdDataLength" id="fdDataLength"
                      onChange={(e) => this.handleInputChange(e)} />
                  </FormGroup>
                </div>
                <div className="ml-2">
                  <FormGroup>
                    <Label for="fdDefaultValue">Default Value</Label>
                    <Input type="text" name="fdDefaultValue" id="fdDefaultValue"
                      onChange={(e) => this.handleInputChange(e)} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="fdKey">Key</Label>
                    <Input type="text" name="fdKey" id="fdKey"
                      onChange={(e) => this.handleInputChange(e)} />
                  </FormGroup>
                  <FormGroup check>
                    <Label check for="fdAllowNull">
                      <Input type="checkbox" name="fdAllowNull" id="fdAllowNull"
                        onClick={() => this.toggleAllowNulls()} />
                      Allow Nulls
                    </Label>
                  </FormGroup>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <FormText color="muted">* Required Field</FormText>
              <Button color={`${isValidField ? 'primary' : 'secondary'}`}
                disabled={!isValidField} onClick={(e) => {
                  this.toggleModal('showFieldModal');
                  this.addField(e, fieldData);
                }}>Save</Button>{' '}
              <Button color="danger" onClick={() => this.toggleModal('showFieldModal')}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Project Modal */}
        <Modal isOpen={showProjectModal} toggle={() => this.toggleModal('showProjectModal')}>
          <Form>
            <ModalHeader toggle={() => this.toggleModal('showProjectModal')}>
              Add Project
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="prjTitle">
                  Project Name <span className="required">*</span>
                </Label>
                <Input type="text" name="prjTitle" id="prjTitle"
                  onChange={(e) => this.handleInputChange(e)} />
              </FormGroup>
              <FormGroup>
                <Label for="prjSummary">
                  Description <span className="required">*</span>
                </Label>
                <Input type="textarea" name="prjSummary" id="prjSummary"
                  onChange={(e) => this.handleInputChange(e)}/>
              </FormGroup>
              <FormGroup>
                <Label for="prjWebsite">
                  Website
                </Label>
                <Input type="url" name="prjWebsite" id="prjWebsite"
                  onChange={(e) => this.handleInputChange(e)} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <FormText color="muted">* Required Field</FormText>
              <Button color={`${isValidProject ? 'primary' : 'secondary'}`}
                disabled={!isValidProject}
                onClick={(e) => {
                  this.addProjectToDB(e, selectedDB._id, projectData);
                  this.toggleModal('showProjectModal');
                }}>Save</Button>{' '}
              <Button color="danger"
                onClick={() => this.toggleModal('showProjectModal')}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>
        {error && <Alert color="danger" className="error-message">{error.message}</Alert>}
      </div>
    );
  }
};
Home.contextTypes = {
  store: PropTypes.object
};

export default Home;
