import React from 'react';
import { connect } from 'react-redux';

import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TableRecord from '../TableRecord';
import './TableCol.css';

const mapDispatchToTBColumnProps = (dispatch) => {
  return {
    toggleModal: (modalName) => {
      dispatch({
        type: 'CLEAR_ALL_FORMS'
      });
      dispatch({
        type: 'TOGGLE_MODAL',
        name: modalName
      });
    }
  }
};

const TableList = ({ tables, toggleModal }) => {
  return (
    <div className={`col-4 table-col`}>
      {tables && tables.map(table => <TableRecord table={table} key={table._id} />)}
      <Button color="primary" className="w-100" onClick={() => toggleModal('showTableModal')}>
        <FontAwesomeIcon className="btn-add text-white" icon="plus-circle" size="2x" />
      </Button>
    </div>
  )
};

const TableCol = connect(null, mapDispatchToTBColumnProps)(TableList);

export default TableCol;
