import React from 'react';
import { connect } from 'react-redux';

import DatabaseRecord from '../DatabaseRecord';
import TableCol from '../TableCol';
import FieldCol from '../FieldCol';
import stateKeys from '../../utils/stateKeys';
import './DatabaseList.css';

const mapStateToDBListProps = (state) => stateKeys(state);

const DatabaseListDisplay = ({ listOfDBs, selectedField }) => (
	<div className="col">
    {listOfDBs && listOfDBs.map(db => (
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
);

const DatabaseList = connect(mapStateToDBListProps)(DatabaseListDisplay);

export default DatabaseList;