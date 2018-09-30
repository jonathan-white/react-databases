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
  }
};

class TableEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editMode: false,
      editTitle: false,
      editRecordCount: false,

      // Table state
      tbTitle: this.props.table.title || '',
      tbSummary: this.props.table.summary || '',
      tbRecordCount: this.props.table.recordCount || 0,

      // Change status
      hasChangedTitle: false,
      hasChangedSummary: false,
      hasChangedRecordCount: false,
    };

    this.toggleTbSelection = this.toggleTbSelection.bind(this);
    this.toggleState = this.toggleState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.updateError = this.updateError.bind(this);
    this.submitChanges = this.submitChanges.bind(this);
    this.selectField = this.selectField.bind(this);
  };

  toggleTbSelection(table){
    this.props.dispatch({
      type: 'TOGGLE_TBL_SELECTION',
      table: table
    })
  };

  toggleState = (name) => {
    this.setState((prevState) => ({ [name]: !prevState[name] }))
  };

  updateState = (name, value) => {
    this.setState({ [name]: value});
  };

  updateError(error){
    this.props.dispatch({
      type: 'RECORD_ERROR',
      error: error
    })
  };

  submitChanges() {
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
        .then(resp => {
          console.log('Response:',resp.data);
          API.getDatabases(this.props.userId)
          .then(resp => {
            this.props.dispatch({
              type: 'UPDATE_TABLES',
              databases: resp.data
            });
          })
          .catch(err => this.updateError(err));

        })
        .catch(err => this.updateError(err));
    }
  };

  selectField(field){
    this.props.dispatch({
      type: 'SELECT_FIELD',
      field: field
    })
  };
  

  render(){

    const { table, toggleModal, removeTable, removeField } = this.props;
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
                    onChange={(e) => {
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
            onClick={() => this.toggleTbSelection(table)}></div>
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
                <ListGroupItem key={field._id} className="field-item"
                  onClick={() => this.selectField(field)}
                >
                  <span>{field.title}</span>
                  <FontAwesomeIcon className="remove-field"
                    icon="window-close" size="2x" onClick={() =>
                      removeField(field._id)
                    }/>
                </ListGroupItem>
              ))}
            </ListGroup>
          </CardBody>
          <CardFooter>
            <Button color="primary" style={{width: '40%'}} className="mr-2"
              onClick={() => toggleModal('showFieldModal')}>Add Field</Button>{' '}
            <Button color="danger" style={{width: '50%'}}
              onClick={() => removeTable(table._id)}>Delete Table</Button>
          </CardFooter>
        </Collapse>
      </Card>
    )
  }
};

const TableRecord = connect(mapStateToTBProps)(TableEntry);

export default TableRecord;
