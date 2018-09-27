import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Badge, Card, CardText, CardHeader, CardBody, CardFooter,
  Collapse, ListGroup, ListGroupItem, Button } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import API from '../../../utils/API';

class TableRecord extends Component {
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
      tbTitleChanged: false,
      tbSummaryChanged: false,
      tbRecordCountChanged: false,
    };

  };

  componentDidMount = () => {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount = () => {
    this.unsubscribe();
  }

  toggleTbSelection = (table) => {
    const { store } = this.context;
    store.dispatch({
      type: 'TOGGLE_TBL_SELECTION',
      table: table
    })
  };

  toggleTbEditState = (name) => {
    this.setState((prevState) => ({
      [name]: !prevState[name]
    }))
  };

  setTbEditState = (name, value) => {
    this.setState({ [name]: value});
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  updateError(error){
    const { store } = this.context;
    store.dispatch({
      type: 'RECORD_ERROR',
      error: error
    })
  };

  submitFormData = () => {
    const { store } = this.context;
    const state = store.getState();
    
    this.setTbEditState('editTitle',false);
    this.setTbEditState('editRecordCount',false);

    let tableData = { userId: state.formManager.userId};
    if(this.state.tbTitleChanged) {
      tableData = {...tableData, title: this.state.tbTitle};
    }
    if(this.state.tbSummaryChanged) {
      tableData = {...tableData, summary: this.state.tbSummary};
    }
    if(this.state.tbRecordCountChanged) {
      tableData = {...tableData, recordCount: this.state.tbRecordCount};
    }

    // If something has changed, send updated key value pairs to server
    if(Object.keys(tableData).length > 1 && tableData.constructor === Object){
      API.updateTable(this.props.table._id, tableData)
        .then(resp => 
          API.getDatabases(tableData.userId)
          .then(resp => store.dispatch({
            type: 'UPDATE_TABLES',
            databases: resp.data
          }))
          .catch(err => this.updateError(err))
        )
        .catch(err => this.updateError(err));
    }
  };
  

  render(){
    const { store } = this.context;

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
                    autoComplete="off" onBlur={() => this.toggleTbEditState('editTitle')}
                    onChange={(e) => {
                      this.handleInputChange(e);
                      this.setTbEditState('tbTitleChanged', true);
                    }}
                    />)
                    : (<div onClick={() => this.toggleTbEditState('editTitle')}>
                    {tbTitle}
                    </div>)
                  }
                </div>)
                : (table.title)
              }
            </span>
            <span>
              <Badge className="recordsCount" color="info">
                {editRecordCount
                  ? (<input type="number" className="badge-input" name="tbRecordCount" value={tbRecordCount} 
                    onBlur={() => this.toggleTbEditState('editRecordCount')}
                    onChange={(e) => {
                      this.handleInputChange(e);
                      this.setTbEditState('tbRecordCountChanged', true);
                    }}
                  />)
                  : (<div onClick={() => this.toggleTbEditState('editRecordCount')}>
                  Records: {table.recordCount}
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
                this.toggleTbEditState('editMode');
                this.submitFormData();
              }}>Save</span>)
              : (<span className="btn-edit mr-3" onClick={() => 
                this.toggleTbEditState('editMode')
              }>Edit</span>)  
            }
          </span>
        </CardHeader>
        <Collapse isOpen={table.isExpanded}>
          <CardBody>
            <CardText>
              {editMode 
                ? (<textarea className="summary" rows="3" name="tbSummary"
                value={tbSummary} onChange={(e) => {
                  this.handleInputChange(e);
                  this.setTbEditState('tbSummaryChanged', true);
                }} />)
                : (tbSummary)
              }
            </CardText>
            {tbSummary && <hr />}
            <ListGroup>
              {table.fields && table.fields.map(field => (
                <ListGroupItem key={field._id} className="field-item"
                  onClick={() => store.dispatch({
                    type: 'SELECT_FIELD',
                    field: field
                  })}
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
TableRecord.contextTypes = {
  store: PropTypes.object
};

export default TableRecord;
