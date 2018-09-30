import React from 'react';
import { connect } from 'react-redux';

import DatabaseRecord from '../DatabaseRecord';
import TableCol from '../TableCol';
import FieldCol from '../FieldCol';
import './DatabaseList.css';

const DatabaseList = connect()(({ databases, addTable,
  addField, removeDB, removeTable, removeField }) => (
  <div className="col">
    {databases && databases.map(db => (
      <div key={db._id} className={`row ${db.isExpanded ? 'selected' : ''}`}>
        <div className="col-4 db-col">
          <DatabaseRecord db={db} />
        </div>
        <TableCol tables={db.tables}
          dbIsExpanded={db.isExpanded}
          addTable={addTable} addField={addField}
          removeTable={removeTable} removeField={removeField} />
        <FieldCol dbIsExpanded={db.isExpanded} />
      </div>
    ))}
  </div>
));

export default DatabaseList;
