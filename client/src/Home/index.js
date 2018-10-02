import React from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import logo from '../images/gear.svg';
import DatabaseList from '../Components/DatabaseList';
import LoginForm from '../Components/Login';
import LogoutButton from '../Components/Logout';
import API from '../utils/API';
import { auth } from  '../firebase';

const mapStateToHomeProps = (state) => {
  return {
    // Database Info
    databases: state.dbManager.databases,
    selectedDB: state.dbManager.selectedDB,
    selectedTable: state.dbManager.selectedTable,
    dbError: state.dbManager.error,

    // Modals
    showDBModal: state.modalManager.showDBModal,
    showTableModal: state.modalManager.showTableModal, 
    showFieldModal: state.modalManager.showFieldModal, 
    showProjectModal: state.modalManager.showProjectModal, 

    // Database Modal
    dbTitle: state.formManager.dbTitle,
    dbSummary: state.formManager.dbSummary,
    dbType: state.formManager.dbType,

    // Table Modal
    tbTitle: state.formManager.tbTitle,
    tbSummary: state.formManager.tbSummary,
    tbRecordCount: state.formManager.tbRecordCount,

    // Field Modal
    fdTitle: state.formManager.fdTitle,
    fdSummary: state.formManager.fdSummary,
    fdDataType: state.formManager.fdDataType,
    fdDataLength: state.formManager.fdDataLength,
    fdAllowNull: state.formManager.fdAllowNull,
    fdKey: state.formManager.fdKey,
    fdDefaultValue: state.formManager.fdDefaultValue,

    // Project Modal
    prjTitle: state.formManager.prjTitle,
    prjSummary: state.formManager.prjSummary,
    prjWebsite: state.formManager.prjWebsite,

    // User Info
    authUser: state.userManager.authUser,
    userId: state.userManager.userId,

    query: state.formManager.query,

  }
};

const mapDispatchToHomeProps = (dispatch) => {
  return {
    updateError(error){
      dispatch({
        type: 'RECORD_ERROR',
        error: error
      })
    },
    loadUserData: (user) => {
      dispatch({
        type: 'AUTHENTICATED_USER',
        user: user
      });
      // Fetch user's databases
      API.getDatabases(user.uid)
        .then(resp => dispatch({
          type: 'LOAD_DB_LIST',
          databases: resp.data
        }))
        .catch(err => dispatch({
          type: 'RECORD_ERROR',
          error: err
        }));
    },
    addDatabase: (event, newDB) => {
      event.preventDefault();
  
      API.addDatabase(newDB)
        .then(() => 
          API.getDatabases(newDB.userId)
            .then(resp => dispatch({
              type: 'UPDATE_DATABASES',
              databases: resp.data
            }))
            .catch(err => dispatch({
              type: 'RECORD_ERROR',
              error: err
            }))
        )
        .catch(err => dispatch({
          type: 'RECORD_ERROR',
          error: err
        }));
    },
    addTable: (event, newTable) => {
      event.preventDefault();
  
      API.addTable(newTable)
        .then(() =>
          API.getDatabases(newTable.userId)
          .then(resp => dispatch({
            type: 'UPDATE_TABLES',
            databases: resp.data
          }))
          .catch(err => dispatch({
            type: 'RECORD_ERROR',
            error: err
          }))
        )
        .catch(err => dispatch({
          type: 'RECORD_ERROR',
          error: err
        }));
    },
    addField: (event, newField) => {
      event.preventDefault();
  
      API.addField(newField)
        .then(() => 
          API.getDatabases(newField.userId)
            .then(resp => dispatch({
              type: 'UPDATE_FIELDS',
              databases: resp.data
            }))
            .catch(err => dispatch({
              type: 'RECORD_ERROR',
              error: err
            }))
        )
        .catch(err => dispatch({
          type: 'RECORD_ERROR',
          error: err
        }))
    },
    handleInputChange: (name, value) => { 
      dispatch({
        type: 'ADD_INPUT_CHANGE',
        name: name,
        value: value
      })
    },
    toggleModal: (modalName) => {
      dispatch({
        type: 'CLEAR_FORM_MANAGER'
      });
      dispatch({
        type: 'TOGGLE_MODAL',
        name: modalName
      });
    },
    addProjectToDB(event, userId, dbId, projData){
      event.preventDefault();
 
      API.addProject(projData)
        .then(resp => {
          console.log('addProject response:',resp);
          // Link new project to the database
          API.addDBProject(dbId, { userId: userId, projectId: resp.data._id })
            .then((dbResp) => {
              console.log('addDBProject response:',dbResp);
              API.getDatabases(userId)
                .then(dbs => {
                  console.log('getDatabases response:',dbs);
                  dispatch({
                    type: 'UPDATE_DATABASES',
                    databases: dbs.data
                  });
                })
                .catch(err => dispatch({
                  type: 'RECORD_ERROR',
                  error: err
                }));
            }
            )
            .catch(err => dispatch({
              type: 'RECORD_ERROR',
              error: err
            }));
        })
        .catch(err => dispatch({
          type: 'RECORD_ERROR',
          error: err
        }));
    },
    searchFor: (query) => {
      dispatch({
        type: 'SEARCH_QUERY',
        query: query
      })
    }
  }
};

class HomeDisplay extends React.Component {
  
  componentDidMount(){
    auth.hasAuthStateChanged((user) => {
      if(user){
        console.log('user is signed in.');
        this.props.loadUserData(user);
      } else {
        console.log('No user is signed in.');
      }
    })
  }

  render() {
    const { authUser, userId, databases, selectedDB, selectedTable, dbError, 
      showDBModal, showTableModal, showFieldModal, showProjectModal, dbTitle, 
      dbSummary, dbType, tbTitle, tbSummary, tbRecordCount, fdTitle, fdSummary, 
      fdDataType, fdDataLength, fdAllowNull, fdKey, fdDefaultValue, prjTitle, 
      prjSummary, prjWebsite, query } = this.props;
    
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
              <DatabaseList
                databases={dbList}
                removeDB={this.removeDB}
                removeTable={this.removeTable}
                removeField={this.removeField}
              />
            </div>
          </div>
        )}
        
        {/* New Database Modal Form */}
        <Modal isOpen={showDBModal} toggle={() => this.props.toggleModal('showDBModal')}>
          <Form>
            <ModalHeader toggle={() => this.props.toggleModal('showDBModal')}>
              Add Database
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="dbTitle">
                  Database Name <span className="required">*</span>
                </Label>
                <Input type="text" name="dbTitle" id="dbTitle" autoFocus
                  onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="dbSummary">
                  Description <span className="required">*</span>
                </Label>
                <Input type="textarea" name="dbSummary" id="dbSummary"
                  onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}/>
              </FormGroup>
              <FormGroup>
                <Label for="dbType">
                  Type <span className="required">*</span>
                </Label>
                <Input type="select" name="dbType" id="dbType"
                  onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}>
                  <option>MySQL</option>
                  <option>MongoDB</option>
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <FormText color="muted">
                <span className="required">*</span> = Required Field
              </FormText>
              <Button color={`${isValidDB ? 'primary' : 'secondary'}`}
                disabled={!isValidDB} onClick={(e) => {
                  this.props.toggleModal('showDBModal');
                  this.props.addDatabase(e, dbData);
                }}>Save</Button>{' '}
              <Button color="danger" onClick={() => this.props.toggleModal('showDBModal')}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* New Table Modal Form*/}
        <Modal isOpen={showTableModal} toggle={() => this.props.toggleModal('showTableModal')}>
          <Form>
            <ModalHeader toggle={() => this.props.toggleModal('showTableModal')}>
              Add New Table
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="tbTitle">
                  Table Name <span className="required">*</span>
                </Label>
                <Input type="text" name="tbTitle" id="tbTitle" autoFocus
                  onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="tbSummary">Description</Label>
                <Input type="textarea" name="tbSummary" id="tbSummary"
                  onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}/>
              </FormGroup>
              <FormGroup>
                <Label for="tbRecordsCount">Number of Records</Label>
                <Input type="number" name="tbRecordCount" id="tbRecordCount"
                  onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <FormText color="muted">
                <span className="required">*</span> = Required Field
              </FormText>
              <Button color={`${isValidTable ? 'primary' : 'secondary'}`}
                disabled={!isValidTable} onClick={(e) => {
                  this.props.toggleModal('showTableModal');
                  this.props.addTable(e, tableData);
                }}>Save</Button>{' '}
              <Button color="danger" onClick={() => this.props.toggleModal('showTableModal')}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* New Field Modal Form */}
        <Modal isOpen={showFieldModal} toggle={() => this.props.toggleModal('showFieldModal')}>
          <Form>
            <ModalHeader toggle={() => this.props.toggleModal('showFieldModal')}>
              New Field Details
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="fdTitle">
                  Field Name <span className="required">*</span>
                </Label>
                <Input type="text" name="fdTitle" id="fdTitle"
                  onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}/>
              </FormGroup>
              <FormGroup>
                <Label for="fdSummary">Description</Label>
                <Input type="textarea" name="fdSummary" id="fdSummary"
                  onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}/>
              </FormGroup>
              <div className="d-flex">
                <div className="mr-2">
                  <FormGroup>
                    <Label for="fdDataType">Data Type</Label>
                    <Input type="select" name="fdDataType" id="fdDataType"
                      defaultValue="varchar"
                      onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}>
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
                      onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
                  </FormGroup>
                </div>
                <div className="ml-2">
                  <FormGroup>
                    <Label for="fdDefaultValue">Default Value</Label>
                    <Input type="text" name="fdDefaultValue" id="fdDefaultValue"
                      onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="fdKey">Key</Label>
                    <Input type="text" name="fdKey" id="fdKey"
                      onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
                  </FormGroup>
                  <FormGroup check>
                    <Label check for="fdAllowNull">
                      <Input type="checkbox" name="fdAllowNull" id="fdAllowNull"
                        onChange={(e) => this.props.handleInputChange(e.target.name, e.target.checked)} />
                      Allow Nulls
                    </Label>
                  </FormGroup>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <FormText color="muted">
                <span className="required">*</span> = Required Field
              </FormText>
              <Button color={`${isValidField ? 'primary' : 'secondary'}`}
                disabled={!isValidField} onClick={(e) => {
                  this.props.toggleModal('showFieldModal');
                  this.props.addField(e, fieldData);
                }}>Save</Button>{' '}
              <Button color="danger" onClick={() => this.props.toggleModal('showFieldModal')}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Project Modal */}
        <Modal isOpen={showProjectModal} toggle={() => this.props.toggleModal('showProjectModal')}>
          <Form>
            <ModalHeader toggle={() => this.props.toggleModal('showProjectModal')}>
              Add Project
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="prjTitle">
                  Project Name <span className="required">*</span>
                </Label>
                <Input type="text" name="prjTitle" id="prjTitle"
                  onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
              </FormGroup>
              <FormGroup>
                <Label for="prjSummary">
                  Description <span className="required">*</span>
                </Label>
                <Input type="textarea" name="prjSummary" id="prjSummary"
                  onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}/>
              </FormGroup>
              <FormGroup>
                <Label for="prjWebsite">
                  Website
                </Label>
                <Input type="url" name="prjWebsite" id="prjWebsite"
                  onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <FormText color="muted">
                <span className="required">*</span> = Required Field
              </FormText>
              <Button color={`${isValidProject ? 'primary' : 'secondary'}`}
                disabled={!isValidProject}
                onClick={(e) => {
                  this.props.addProjectToDB(e, selectedDB._id, projectData);
                  this.props.toggleModal('showProjectModal');
                }}>Save</Button>{' '}
              <Button color="danger"
                onClick={() => this.props.toggleModal('showProjectModal')}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>
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