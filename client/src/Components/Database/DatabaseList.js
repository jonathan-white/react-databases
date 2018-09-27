import React from 'react';
import { connect } from 'react-redux';

import DatabaseCol from './DatabaseCol';
import TableCol from './Table';
import FieldCol from './Field';
import './Database.css';

const DatabaseList = connect()(({ databases, addTable,
  addField, removeDB, removeTable, removeField }) => (
  <div className="col">
    {databases && databases.map(db => (
      <div key={db._id} className={`row ${db.isExpanded ? 'selected' : ''}`}>
        <DatabaseCol db={db} />
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
