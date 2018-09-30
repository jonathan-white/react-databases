import React from 'react';
import { connect } from 'react-redux';

import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TableRecord from '../TableRecord';
import API from '../../utils/API';
import './TableCol.css';

const mapStateToTBColumnProps = (state) => {
  return {
    selectedDB: state.dbManager.selectedDB,
    userId: state.formManager.userId,
  }
};

const mapDispatchToTBColumnProps = (dispatch) => {
  return {
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
        .catch(err => dispatch({
          type: 'RECORD_ERROR',
          error: err
        }))
    }
  }
};

const TableList = ({ tables, userId, selectedDB, updateError, dbAction, toggleModal, dbIsExpanded }) => {

  const removeTable = (id) => {
    API.removeTable(userId,id)
      .then(() => dbAction(userId, 'UPDATE_TABLES'))
      .catch(err => updateError(err));
  }

  const removeField = (id) => {
    API.removeField(userId,id)
      .then(() => dbAction(userId, 'UPDATE_FIELDS'))
      .catch(err => updateError(err));
  };

  return (
    <div className={`col-4 table-col ${dbIsExpanded ? 'reveal-tables' : 'hide-tables'}`}>
      {(tables && dbIsExpanded) && tables.map(table => (
        <TableRecord table={table} key={`${selectedDB._id}-${table._id}`}
          toggleModal={toggleModal}
          removeTable={removeTable} removeField={removeField}/>
      ))
      }
      {dbIsExpanded &&
        <Button color="primary" className="w-100" onClick={() => toggleModal('showTableModal')}>
          <FontAwesomeIcon className="btn-add text-white" icon="plus-circle" size="2x" />
        </Button>
      }
    </div>
  )
}

const TableCol = connect(
  mapStateToTBColumnProps,
  mapDispatchToTBColumnProps
)(TableList)

export default TableCol;
