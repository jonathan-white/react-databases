import React from 'react';
import { connect } from 'react-redux';

import DatabaseRecord from '../DatabaseRecord';
import TableCol from '../TableCol';
import FieldCol from '../FieldCol';
import './DatabaseList.css';

const mapStateToDBListProps = (state) => {
  return {
    selectedField: state.dbManager.selectedField
  }
};

const DatabaseList = connect(
  mapStateToDBListProps
)(({ databases, selectedField }) => (
  <div className="col">
    {databases && databases.map(db => (
      <div key={db._id} className={`row ${db.isExpanded ? 'selected' : ''}`}>
        {/* Database Column */}
        <div className="col-4 db-col">
          <DatabaseRecord db={db} />
        </div>
        {/* Table Column */}
        {db.isExpanded && <TableCol tables={db.tables} />}
        {/* Field Column */}
        {(db.isExpanded && selectedField) && <FieldCol field={selectedField} />}
      </div>
    ))}
  </div>
));

export default DatabaseList;
