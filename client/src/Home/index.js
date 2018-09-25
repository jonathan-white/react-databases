import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import logo from '../images/gear.svg';
import DatabaseList from '../Components/Database';
import API from '../utils/API';

class Home extends Component {
  constructor(props){
    super(props);

    this.addDatabase = this.addDatabase.bind(this);
    this.addTable = this.addTable.bind(this);
    this.addField = this.addField.bind(this);
    this.removeDB = this.removeDB.bind(this);
    this.removeTable = this.removeTable.bind(this);
    this.removeField = this.removeField.bind(this);
    this.toggleDBModal = this.toggleDBModal.bind(this);
  };

  componentDidMount() {
    this.refreshDBList(); //To be removed

    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  refreshDBList() {
    const { store } = this.context;

    API.getDatabases()
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
      API.getDatabase(state.dbManager.selectedDB._id)
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
      API.getTable(state.dbManager.selectedTable._id)
        .then(resp => this.setState({ selectedTable: resp.data }))
        .catch(err => this.setState({ error: err }));
    }
  };

  // Create API
  addDatabase(event, newDB) {
    event.preventDefault();
    console.log('newDB:',newDB);

    API.addDatabase(newDB)
      .then(() => this.refreshDBList())
      .catch(err => this.setState({error: err}));
  };

  addTable(event, newTable) {
    event.preventDefault();
    console.log('newTable:',newTable);

    API.addTable(newTable)
      .then(() => this.refreshSelectedDB())
      .catch(err => this.setState({error: err}));
  };

  addField(event, newField) {
    event.preventDefault();
    console.log('newField:',newField);

    API.addField(newField)
      .then(() => this.refreshSelectedDB())
      .catch(err => this.setState({error: err}));
  };

  // Delete API
  removeDB(id){
    API.removeDB(id)
      .then(() => this.refreshDBList())
      .catch(err => this.setState({error: err}));
  };

  removeTable(id){
    API.removeTable(id)
      .then(() => this.refreshSelectedDB())
      .catch(err => this.setState({error: err}));
  };

  removeField(id){
    const { store } = this.context;
    const state = store.getState();

    API.removeField(id)
      .then(() => {
        if(state.dbManager.selectedField) {
          if(id === state.dbManager.selectedField._id){
            this.setState({selectedField: null});
          }
        }
        this.refreshSelectedDB();
      })
      .catch(err => this.setState({error: err}));
  };

  toggleDBModal() {
    this.setState((prevState) => ({ dbModal: !prevState.dbModal }));
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
  }

  render() {
    const { store } = this.context;
    const state = store.getState();
    console.log(state);

    const { databases, selectedDB, selectedTable, selectedField, error } = state.dbManager;
    const { showDBModal, showTableModal, showFieldModal } = state.modalManager;
    const { dbTitle, dbSummary, dbType, tbTitle, tbSummary, tbRecordCount,
    fdTitle, fdSummary, fdDataType, fdDataLength, fdAllowNull, fdKey, fdDefaultValue } = state.formManager;

    // Filter the list of databases
    let dbList;
    if(databases && state.formManager.query){
      dbList = databases.filter(d => {
        if(d.title.toLowerCase().includes(state.formManager.query.toLowerCase() || '')){
          return d;
        }
      });
    }
    dbList = dbList || databases;

    // Set
    const dbData = {
      title: dbTitle,
      summary: dbSummary,
      type: dbType || 'MySQL'
    };

    const tableData = {
      databaseId: (selectedDB) ? selectedDB._id : '',
      title: tbTitle,
      summary: tbSummary || '',
      recordCount: tbRecordCount || ''
    };

    const fieldData = {
      tableId: (selectedTable) ? selectedTable._id : null,
      title: fdTitle,
      summary: fdSummary,
      dataType: fdDataType || 'varchar',
      dataLength: fdDataLength,
      allowNull: fdAllowNull || false,
      key: fdKey,
      defaultValue: fdDefaultValue
    };

    const isValidDB = dbTitle !== null && dbTitle !== '' &&
      dbSummary !== null && dbSummary !== '' &&
      dbType !== null && dbType !== '';
    const isValidTable = tbTitle !== null && tbTitle !== '';
    const isValidField = fdTitle !== null && fdTitle !== '';

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Database Management</h1>
        </header>
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
              addDatabase={this.addDatabase}
              addTable={this.addTable}
              addField={this.addField}
              removeDB={this.removeDB}
              removeTable={this.removeTable}
              removeField={this.removeField}
            />
          </div>
        </div>
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
                <Input type="text" name="dbTitle" id="dbTitle"
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
                <Input type="text" name="tbTitle" id="tbTitle"
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
                  onChange={(e) => this.handleInputChange(e)} />
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
        {error && <Alert color="danger" className="error-message">{error}</Alert>}
      </div>
    );
  }
};
Home.contextTypes = {
  store: PropTypes.object
};

export default Home;
