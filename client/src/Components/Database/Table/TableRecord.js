import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Badge, Card, CardHeader, CardBody, CardFooter,
  Collapse, ListGroup, ListGroupItem, Button } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

class TableRecord extends Component {
  constructor(props){
    super(props);
    this.state = {
      editMode: false,

      // Table state
      tableTitle: null,
      tableSummary: null,
      tableRecordsCount: null,
    };

    this.toggleExpand = this.toggleExpand.bind(this);
  };

  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  toggleExpand() {
    this.setState((prevState) => ({ isExpanded: !prevState.isExpanded}));
  };

  render(){
    const { store } = this.context;
    // const state = store.getState();

    const { table, toggleModal, removeTable, removeField } = this.props;

    return(
      <Card className={`mb-2 table-item ${table.isExpanded ? 'expanded': ''}`}
        id={table._id}>
        <CardHeader className="d-flex justify-content-between" onClick={() => {
          // this.toggleExpand();
          store.dispatch({
            type: 'TOGGLE_TBL_SELECTION',
            table: table
          });
        }}>
          <span className="record-title">{table.title}</span>
          <span>
            <span className="btn-edit mr-3">Edit</span>
            <Badge color="info">Records: {table.recordCount}</Badge>
          </span>
        </CardHeader>
        <Collapse isOpen={table.isExpanded}>
          <CardBody>
            {table.summary}
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
                    icon={faWindowClose} size="2x" onClick={() =>
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
