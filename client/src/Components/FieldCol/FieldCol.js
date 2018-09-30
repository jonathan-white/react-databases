import React from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardText, CardBody, Badge, Alert, Input, Label } from 'reactstrap';
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
      
      fdTitle: this.props.field.title,
      fdSummary: this.props.field.summary,
      fdDataType: this.props.field.dataType,
      fdDataLength: this.props.field.dataLength,
      fdAllowNull: this.props.field.allowNull,
      fdKey: this.props.field.key,
      fdDefaultValue: this.props.field.defaultValue,

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
      API.updateField(this.props.field._id, {...fdData, userId: this.props.userId})
        .then(() => this.props.dbAction(this.props.userId, 'UPDATE_FIELDS'))
        .catch(err => this.props.updateError(err));
    }
  };

  render() {
    const { field } = this.props;

    const { editMode, editTitle, editDataType, fdTitle, fdSummary, fdDataType,
      fdDataLength, fdAllowNull, fdKey, fdDefaultValue } = this.state;

    return(
      <div className={`col-4 field-col`}>
        {field && (
          <Card className="mb-2 field-entry">
            <CardHeader className="d-flex justify-content-between">
              <span className="record-title">
                {editMode
                  ? (<div>
                    {editTitle 
                      ? (<input type="text" name="fdTitle" value={fdTitle} 
                      autoComplete="off" onBlur={() => this.toggleState('editTitle')}
                      onChange={(e) => {
                        this.updateState(e.target.name, e.target.value);
                        this.updateState('hasChangedTitle', true);
                      }}
                      />)
                      : (<div onClick={() => this.toggleState('editTitle')}>
                      {fdTitle}
                      </div>)
                    }
                  </div>)
                  : (fdTitle)
                }
              </span>
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
                <Badge color="danger">
                  {editDataType
                    ? (<Input type="select" className="badge-input" name="fdDataType" 
                      value={fdDataType} onBlur={() => this.toggleState('editDataType')}
                      onChange={(e) => {
                        this.updateState(e.target.name, e.target.value);
                        this.updateState('hasChangedDataType', true);
                      }}
                    >
                      <option>boolean</option>
                      <option>datetime</option>
                      <option>decimal</option>
                      <option>double</option>
                      <option>int</option>
                      <option>text</option>
                      <option>tinyint</option>
                      <option>varchar</option>
                    </Input>)
                    : (
                      field.dataLength 
                        ? (<span onClick={() => this.toggleState('editDataType')}>
                          {fdDataType} ({fdDataLength})
                        </span>)
                        : (<span onClick={() => this.toggleState('editDataType')}>
                        {fdDataType} 
                        </span>)
                    )
                  }
                </Badge>
              </span>
            </CardHeader>
            <CardBody>
              {editMode 
                ? (
                  <CardText>
                    <textarea className="summary" rows="2" name="fdSummary"
                    value={fdSummary} placeholder="Summary..." onChange={(e) => {
                      this.updateState(e.target.name, e.target.value);
                      this.updateState('hasChangedSummary', true);
                    }} />
                    <Input type="text" name="fdDefaultValue" value={fdDefaultValue} 
                      placeholder="Default Value" onChange={(e) => {
                        this.updateState(e.target.name, e.target.value);
                        this.updateState('hasChangedDefaultValue', true);
                    }}/>
                    <Input type="number" name="fdDataLength" value={fdDataLength} 
                      placeholder="Data Length" onChange={(e) => {
                        this.updateState(e.target.name, e.target.value);
                        this.updateState('hasChangedDataLength', true);
                    }}/>
                    <Input type="text" name="fdKey" value={fdKey} 
                      placeholder="Key" onChange={(e) => {
                        this.updateState(e.target.name, e.target.value);
                        this.updateState('hasChangedKey', true);
                    }}/>
                    <Label check for="fdAllowNull">
                      <Input type="checkbox" name="fdAllowNull" id="fdAllowNull"
                        onClick={(e) => {
                          this.updateState(e.target.name, e.target.value);
                          this.updateState('hasChangedAllowNull', true);
                        }} />
                      Allow Nulls
                    </Label>
                  </CardText>
                )
                : (<CardText>{fdSummary}</CardText>)
              }
              {fdSummary && <hr />}
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
