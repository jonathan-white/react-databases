import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardText, CardBody, Badge, Alert } from 'reactstrap';
import moment from 'moment';

import './FieldCol.css';

class FieldCol extends Component {
  constructor(props){
    super(props);
    this.state = {
      editMode: false,
      
      fieldTitle: null,
      fieldSummary: null,
      fieldDataType: 'varchar',
      fieldDataLength: null,
      fieldNulls: false,
      fieldKey: null,
      fieldDefault: null,
    }
  }

  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { store } = this.context;

    // const field = state.dbManager.selectedField;
    const field = this.props.field;

    return(
      <div className={`col-4 field-col`}>
        {field && (
          <Card className="mb-2 field-entry" id={field._id}>
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
FieldCol.contextTypes = {
  store: PropTypes.object
};

export default FieldCol;
