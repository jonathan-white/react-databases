import React from 'react';
import { connect } from 'react-redux';

import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TableRecord from './TableRecord';
// import TableModalDisplay from './TableModalDisplay';
import './Table.css';
import API from '../../../utils/API';

const mapStateToTBColumnProps = (state) => {
  return {
    tables: state.dbManager.tables,
    selectedDB: state.dbManager.selectedDB,
    selectedTable: state.dbManager.selectedTable,
    // Table Editor
    tbEditMode: state.dbManager.editor.table.tbEditMode,
    tbEditTitle: state.dbManager.editor.table.tbEditTitle,
    tbTitle: state.dbManager.editor.table.tbTitle,
    tbSummary: state.dbManager.editor.table.tbSummary,
    tbRecordCount: state.dbManager.editor.table.tbRecordCount,
    tbTitleChanged: state.dbManager.editor.table.tbTitleChanged,
    tbSummaryChanged: state.dbManager.editor.table.tbSummaryChanged,
    tbRecordCountChanged: state.dbManager.editor.table.tbRecordCountChanged,

    // Table Editor
    fdEditMode: state.dbManager.editor.field.fdEditMode,
    fdEditTitle: state.dbManager.editor.field.fdEditTitle,
    fdTitle: state.dbManager.editor.field.fdTitle,
    fdSummary: state.dbManager.editor.field.fdSummary,
    fdDataType: state.dbManager.editor.field.fdDataType,
    fdDataLength: state.dbManager.editor.field.fdDataLength,
    fdAllowNull: state.dbManager.editor.field.fdAllowNull,
    fdKey: state.dbManager.editor.field.fdKey,
    fdDefaultValue: state.dbManager.editor.field.fdDefaultValue,

    fdTitleChanged: state.dbManager.editor.field.fdTitleChanged,
    fdSummaryChanged: state.dbManager.editor.field.fdSummaryChanged,
    fdDataTypeChanged: state.dbManager.editor.field.fdDataTypeChanged,
    fdDataLengthChanged: state.dbManager.editor.field.fdDataLengthChanged,
    fdAllowNullChanged: state.dbManager.editor.field.fdAllowNullChanged,
    fdKeyChanged: state.dbManager.editor.field.fdKeyChanged,
    fdDefaultValueChanged: state.dbManager.editor.field.fdDefaultValueChanged,

    // Modals
    showTableModal: state.modalManager.showTableModal,
    showFieldModal: state.modalManager.showFieldModal,
  }
};

const mapDispatchToTBColumnProps = (dispatch) => {
  return {
    handleInputChange: (name, value) => {
      dispatch({
        type: 'ADD_INPUT_CHANGE',
        name: name,
        value: value
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
    updateSelectedDB: (db) => {
      dispatch({
        type: 'UPDATE_SELECTED_DB',
        database: db
      })
    }
  }
};

const TableCol = connect(
  mapStateToTBColumnProps,
  mapDispatchToTBColumnProps
)(({ tables, selectedDB, selectedTable, tbEditMode, tbEditTitle, tbTitle,
  tbSummary, tbRecordCount, hasChangedTitle, hasChangedSummary,
  hasChangedRecordCount, fdEditMode, fdEditTitle, fdTitle, fdSummary,
  fdDataType, fdDataLength, fdAllowNull, fdKey, fdDefaultValue, fdTitleChanged,
  fdSummaryChanged, fdDataTypeChanged, fdDataLengthChanged, fdAllowNullChanged,
  fdKeyChanged, fdDefaultValueChanged, showTableModal, showFieldModal,
  handleInputChange, toggleModal, updateError, updateSelectedDB, dbSelected }) => {

    const refreshSelectedDB = () => {
      if(selectedDB) {
        API.getDatabase(selectedDB._id)
          .then(resp => {
            updateSelectedDB(resp.data[0]);
          })
          .catch(err => this.setState({ error: err }));
      }
    };

  const removeTable = (id) => {
    API.removeTable(id)
      .then(() => refreshSelectedDB())
      .catch(err => updateError());
  }
  const removeField = (id) => {
    API.removeField(id)
      .then(() => {
        refreshSelectedDB();
      })
      .catch(err => updateError());
  };

  return (
    <div className="col-4 table-col">
      {(tables && dbSelected) && tables.map(tbl => (
        <TableRecord table={tbl} key={`${selectedDB._id}-${tbl._id}`}
          toggleModal={toggleModal}
          removeTable={removeTable} removeField={removeField}/>
      ))
      }
      {dbSelected &&
        <Button color="primary" className="w-100" onClick={() =>
          toggleModal('showTableModal')
        }>
          <FontAwesomeIcon className="btn-add text-white"
          icon="plus-circle" size="2x" />
        </Button>
      }
    </div>
  )
})

export default TableCol;
