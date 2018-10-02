import React from 'react';
import { connect } from 'react-redux';

import { Badge, Card, CardText, CardHeader, CardBody, CardFooter,
  Collapse, ListGroup, ListGroupItem, Button } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import API from '../../utils/API';
import "./TableRecord.css";

const mapStateToTBProps = (state) => {
  return {
    userId: state.userManager.userId,
    selectedField: state.dbManager.selectedField
  }
};

const mapDispatchToTBProps = (dispatch) => {
  return {
    toggleTbSelection: (table) => {
      dispatch({
        type: 'TOGGLE_TBL_SELECTION',
        table: table
      })
    },
    toggleModal: (modalName) => {
      dispatch({
        type: 'TOGGLE_MODAL',
        name: modalName
      })
    },
    updateError: (error) => {
      dispatch({
        type: 'RECORD_ERROR',
        error: error
      })
    },
    dbAction: (userId, actionType) => {
      API.getDatabases(userId)
        .then(resp => dispatch({
          type: actionType,
          databases: resp.data
        }))
        .catch(err => this.updateError(err))
    },
    selectField: (field) => {
      dispatch({
        type: 'SELECT_FIELD',
        field: field
      });
    }
  }
};

class TableEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editMode: false,
      editTitle: false,
      editRecordCount: false,

      tbTitle: this.props.table.title || '',
      tbSummary: this.props.table.summary || '',
      tbRecordCount: this.props.table.recordCount || 0,

      hasChangedTitle: false,
      hasChangedSummary: false,
      hasChangedRecordCount: false,
    };

    this.toggleState = this.toggleState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.submitChanges = this.submitChanges.bind(this);
    this.removeTable = this.removeTable.bind(this);
    this.removeField = this.removeField.bind(this);
  };

  toggleState = (name) => {
    this.setState((prevState) => ({ [name]: !prevState[name] }))
  };

  updateState = (name, value) => {
    this.setState({ [name]: value});
  };

  submitChanges = () => {
    this.updateState('editTitle',false);
    this.updateState('editRecordCount',false);

    let tbData = {};
    if(this.state.hasChangedTitle) {
      tbData = {...tbData, title: this.state.tbTitle};
    }
    if(this.state.hasChangedSummary) {
      tbData = {...tbData, summary: this.state.tbSummary};
    }
    if(this.state.hasChangedRecordCount) {
      tbData = {...tbData, recordCount: this.state.tbRecordCount};
    }

    // If something has changed, send updated key value pairs to server
    if(Object.keys(tbData).length !== 0 && tbData.constructor === Object){
      API.updateTable(this.props.table._id, {...tbData, userId: this.props.userId})
        .then(() => this.props.dbAction(this.props.userId, 'UPDATE_TABLES'))
        .catch(err => this.props.updateError(err));
    }
  };

  removeTable = (id) => {
    API.removeTable(this.props.userId, id)
      .then(() => this.props.dbAction(this.props.userId, 'UPDATE_TABLES'))
      .catch(err => this.props.updateError(err));
  }

  removeField = (id) => {
    API.removeField(this.props.userId, id)
      .then(() => {
        if(id === this.props.selectedField){
          this.props.selectField(null);
        }
        this.props.dbAction(this.props.userId, 'UPDATE_FIELDS');
      })
      .catch(err => this.props.updateError(err));
  };
  

  render(){

    const { table } = this.props;
    
    const { editMode, editTitle, editRecordCount, tbTitle, tbSummary, tbRecordCount } = this.state;

    return(
      <Card className={`mb-2 table-item ${table.isExpanded ? 'expanded': ''}`}
        id={table._id}>
        <CardHeader>
          <div className="header-content">
            <span className="record-title">
              {editMode
                ? (<div>
                  {editTitle 
                    ? (<input type="text" name="tbTitle" value={tbTitle} 
                    autoComplete="off" onBlur={() => this.toggleState('editTitle')}
                    className="input-title" onChange={(e) => {
                      this.updateState(e.target.name, e.target.value);
                      this.updateState('hasChangedTitle', true);
                    }}
                    />)
                    : (<div onClick={() => this.toggleState('editTitle')}>
                    {tbTitle}
                    </div>)
                  }
                </div>)
                : (tbTitle)
              }
            </span>
            <span>
              <Badge className="recordsCount" color="info">
                {editRecordCount
                  ? (<input type="number" className="badge-input" name="tbRecordCount" 
                    value={tbRecordCount} onBlur={() => this.toggleState('editRecordCount')}
                    onChange={(e) => {
                      this.updateState(e.target.name, e.target.value);
                      this.updateState('hasChangedRecordCount', true);
                    }}
                  />)
                  : (<div onClick={() => this.toggleState('editRecordCount')}>
                  Records: {tbRecordCount}
                  </div>)
                }
              </Badge>
              {table.isExpanded
                ? <FontAwesomeIcon className="up-arrow" icon="angle-up" />
                : <FontAwesomeIcon icon="angle-down" />
              }
            </span>
          </div>
          <div className={`${!editMode ? 'clickable-overlay' : ''}`}
            onClick={() => this.props.toggleTbSelection(table)}></div>
          <span>
            {editMode 
              ? (<span className="btn-edit mr-3 btn-success" onClick={() => {
                this.toggleState('editMode');
                this.submitChanges();
              }}>Save</span>)
              : (<span className="btn-edit mr-3" onClick={() => 
                this.toggleState('editMode')
              }>Edit</span>)  
            }
          </span>
        </CardHeader>
        <Collapse isOpen={table.isExpanded}>
          <CardBody>
            <CardText>
              {editMode 
                ? (<textarea className="summary" rows="3" name="tbSummary"
                value={tbSummary} placeholder="Summary..." onChange={(e) => {
                  this.updateState(e.target.name, e.target.value);
                  this.updateState('hasChangedSummary', true);
                }} />)
                : (tbSummary)
              }
            </CardText>
            {tbSummary && <hr />}
            <ListGroup>
              {table.fields && table.fields.map(field => (
                <ListGroupItem key={field._id} className="field-item">
                  <span>{field.title}</span>
                  <div className="clickable-overlay" onClick={() => this.props.selectField(field)}></div>
                  <FontAwesomeIcon className="remove-field"
                    icon="window-close" size="2x" onClick={() =>
                      this.removeField(field._id)
                    }/>
                </ListGroupItem>
              ))}
            </ListGroup>
          </CardBody>
          <CardFooter>
            <Button color="primary" className="btn-add-field mr-2"
              onClick={() => this.props.toggleModal('showFieldModal')}>Add Field</Button>
            {' '}
            <Button color="danger" className="btn-delete-table"
              onClick={() => this.removeTable(table._id)}>Delete Table</Button>
          </CardFooter>
        </Collapse>
      </Card>
    )
  }
};

const TableRecord = connect(
  mapStateToTBProps,
  mapDispatchToTBProps
)(TableEntry);

export default TableRecord;
