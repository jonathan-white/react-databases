import React from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardText, CardBody, Badge, Alert, 
  Input, Label, Form, FormGroup } from 'reactstrap';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { default as actions } from '../../utils/actions';
import API from '../../utils/API';
import './FieldCol.css';

const mapStateToFieldProps = (state) => {
  return {
    userId: state.userManager.userId,
    selectedField: state.dbManager.selectedField
  }
};

const mapDispatchToFieldProps = (dispatch) => {
	return actions(dispatch);
};

class FieldEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editMode: false,
      editTitle: false,
      editDataType: false,
      
      fdTitle: this.props.selectedField.title,
      fdSummary: this.props.selectedField.summary,
      fdDataType: this.props.selectedField.dataType,
      fdDataLength: this.props.selectedField.dataLength,
      fdAllowNull: this.props.selectedField.allowNull,
      fdKey: this.props.selectedField.key,
      fdDefaultValue: this.props.selectedField.defaultValue,

      hasChangedTitle: false,
      hasChangedSummary: false,
      hasChangedDataType: false,
      hasChangedDataLength: false,
      hasChangedAllowNull: false,
      hasChangedKey: false,
      hasChangedDefaultValue: false,
    };

    this.updateState = this.updateState.bind(this);
    this.toggleState = this.toggleState.bind(this);
    this.submitChanges = this.submitChanges.bind(this);
  };

  updateState = (name, value) => {
    if(name.constructor === Object){
      this.setState(name);
    } else {
      this.setState({ [name]: value});
    }
  };

  toggleState = (name) => {
    this.setState((prevState) => ({ [name]: !prevState[name] }))
  };

  submitChanges = () => {
    let fdData = {};
    if(this.state.hasChangedTitle) {
      fdData = {...fdData, title: this.state.fdTitle};
    }
    if(this.state.hasChangedSummary) {
      fdData = {...fdData, summary: this.state.fdSummary};
    }
    if(this.state.hasChangedDataType) {
      fdData = {...fdData, dataType: this.state.fdDataType};
    }
    if(this.state.hasChangedDataLength) {
      fdData = {...fdData, dataLength: this.state.fdDataLength};
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

    // Reset change states
    this.setState({
      hasChangedTitle: false,
      hasChangedSummary: false,
      hasChangedDataType: false,
      hasChangedDataLength: false,
      hasChangedAllowNull: false,
      hasChangedKey: false,
      hasChangedDefaultValue: false,
    })

    // If something has changed, send updated key value pairs to server
    if(Object.keys(fdData).length !== 0 && fdData.constructor === Object){
      API.updateField(this.props.field._id, {...fdData, userId: this.props.userId})
        .then((resp) => this.props.dbAction(this.props.userId, 'UPDATE_SINGLE_FIELD', resp.data[0]))
        .catch(err => this.props.updateError(err));
    }
  };

  render() {
    const { selectedField } = this.props;
    const { title, summary, dataType, dataLength, allowNull, key, defaultValue,
      dateAdded } = selectedField;

    const { editMode, editTitle, editDataType, fdTitle, fdSummary, fdDataType,
      fdDataLength, fdKey, fdDefaultValue } = this.state;

    return(
      <div className={`col-4 field-col`}>
        {selectedField && (
          <Card className="mb-2 field-entry">
            <CardHeader>
              <div className="header-content">
                <span className="record-title">
                  {editMode
                    ? (<div>
                      {editTitle 
                        ? (<input type="text" name="fdTitle" value={fdTitle} 
                        autoComplete="off" onBlur={() => this.toggleState('editTitle')}
                        className="input-title" onChange={(e) => {
                          this.updateState(e.target.name, e.target.value);
                          this.updateState('hasChangedTitle', true);
                        }}
                        />)
                        : (<div onClick={() => this.toggleState('editTitle')}>
                        {fdTitle}
                        </div>)
                      }
                    </div>)
                    : (title)
                  }
                </span>
                <span>
                  <Badge color="danger">
                    {editDataType
                      ? (<Input type="select" className="badge-input" name="fdDataType" 
                        value={fdDataType} onBlur={() => this.toggleState('editDataType')}
                        bsSize="sm" onChange={(e) => {
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
                      : (dataLength 
                          ? (<span onClick={() => this.toggleState('editDataType')}>
                            {dataType} ({dataLength})
                          </span>)
                          : (<span onClick={() => this.toggleState('editDataType')}>
                          {dataType} 
                          </span>)
                      )
                    }
                  </Badge>
                </span>
              </div>
              <div className={`${!editMode ? 'clickable-overlay' : ''}`}></div>
              <span>
                {editMode 
                  ? (<span className="btn-edit mr-3 btn-success" onClick={() => {
                    this.toggleState('editMode');
                    this.updateState({
                      editTitle: false,
                      editDataType: false
                    });
                    this.submitChanges();
                  }}>Save</span>)
                  : (<span className="btn-edit mr-3" onClick={() => {
                    this.toggleState('editMode');
                    this.updateState({
                      fdTitle: title,
                      fdSummary: summary,
                      fdDataType: dataType,
                      fdDataLength: dataLength,
                      fdAllowNull: allowNull,
                      fdKey: key,
                      fdDefaultValue: defaultValue,
                      editTitle: false,
                      editDataType: false
                    });
                  }}>Edit</span>)
                }
              </span>
            </CardHeader>
            <CardBody>
              {editMode 
                ? (<Form className="edit-form">
                    <Input type="textarea" className="summary" rows="2" name="fdSummary"
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
                    <FormGroup>
                      <Label check for="fdAllowNull" className="ckbAllowNull">
                        <input type="checkbox" name="fdAllowNull" id="fdAllowNull"
                          onChange={(e) => {
                            this.updateState(e.target.name, e.target.checked);
                            this.updateState('hasChangedAllowNull', true);
                          }} />
                        Allow Nulls
                      </Label>
                    </FormGroup>
                  </Form>)
                : (<div>
                  <div><CardText>{summary}</CardText></div>
                    {summary && <hr />}
                    <div>
                      <CardText>
                        <span className="field-header">Default Value:</span> {defaultValue ? defaultValue : ''}
                      </CardText>
                    </div>
                  </div>)
              }
              {allowNull
                ? <Alert color="success" className="text-center">Nulls Allowed</Alert>
                : <Alert color="danger"  className="text-center">No Null Values</Alert>
              }
              <span className="key-indicator">
                {key ? <FontAwesomeIcon icon="key" className={`${key}`} title={`${key} key`} /> : ''}
              </span>
              <span className="dateAdded">
                Added: {moment(dateAdded).format('MMMM DD YYYY')}
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
