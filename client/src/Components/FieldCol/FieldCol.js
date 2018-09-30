import React from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardText, CardBody, Badge, Alert } from 'reactstrap';
import moment from 'moment';

import API from '../../utils/API';
import './FieldCol.css';

const mapStateToFieldProps = (state) => {
  return {
    userId: state.userManager.userId
  }
}

const mapDispatchToFieldProps = (dispatch) => {
  return {
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
  }
};

class FieldEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editMode: false,
      editTitle: false,
      editDataType: false,
      
      fdTitle: null,
      fdSummary: null,
      fdDataType: 'varchar',
      fdDataLength: null,
      fdAllowNull: false,
      fdKey: null,
      fdDefaultValue: null,

      hasChangedTitle: false,
      hasChangedSummary: false,
      hasChangedDataType: false,
      hasChangedDataLength: false,
      hasChangedAllowNull: false,
      hasChangedKey: false,
      hasChangedDefaultValue: false,
    };

  };

  toggleState = (name) => {
    this.setState((prevState) => ({ [name]: !prevState[name] }))
  };

  updateState = (name, value) => {
    this.setState({ [name]: value});
  };

  submitChanges = () => {
    this.updateState('editTitle',false);
    this.updateState('editDataType',false);

    let fdData = {};
    if(this.state.hasChangedTitle) {
      fdData = {...fdData, title: this.state.fdTitle};
    }
    if(this.state.hasChangedSummary) {
      fdData = {...fdData, summary: this.state.fdSummary};
    }
    if(this.state.hasChangedAllowNull) {
      fdData = {...fdData, allowNull: this.state.fdAllowNull};
    }
    if(this.state.hasChangedKey) {
      fdData = {...fdData, key: this.state.fdKey};
    }
    if(this.state.hasChangedDefaultValue) {
      fdData = {...fdData, defaultValue: this.state.fdfdDefaultValue};
    }

    // If something has changed, send updated key value pairs to server
    if(Object.keys(fdData).length !== 0 && fdData.constructor === Object){
      API.updateTable(this.props.table._id, {...fdData, userId: this.props.userId})
        .then(() => this.props.dbAction(this.props.userId, 'UPDATE_TABLES'))
        .catch(err => this.props.updateError(err));
    }
  };

  render() {
    const { field } = this.props;

    return(
      <div className={`col-4 field-col`}>
        {field && (
          <Card className="mb-2 field-entry">
            <CardHeader className="d-flex justify-content-between">
              <span className="record-title">{field.title}</span>
              <span>
                <span className="btn-edit mr-3">Edit</span>
                {field.dataLength
                  ? (<Badge color="danger">
                    {field.dataType} ({field.dataLength})
                  </Badge>)
                  : (<Badge color="danger">{field.dataType}</Badge>)
                }
              </span>
            </CardHeader>
            <CardBody>
              <CardText>{field.summary}</CardText>
              {field.allowNull
                ? <Alert color="success" className="text-center">Nulls Allowed</Alert>
                : <Alert color="danger"  className="text-center">No Null Values</Alert>
              }
              <span className="dateAdded">
                Added: {moment(field.dateAdded).format('MMMM DD YYYY')}
              </span>
            </CardBody>
          </Card>
        )}
      </div>
    )
  }
};

const FieldCol = connect(
  mapStateToFieldProps, 
  mapDispatchToFieldProps
)(FieldEntry);

export default FieldCol;
