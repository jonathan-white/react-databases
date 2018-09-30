import React from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardImg, CardText, CardBody, CardFooter,
  CardTitle, Collapse, Input, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

import './DatabaseRecord.css';
import API from '../../utils/API';

const mapStateToDBColumnProps = (state) => {
  return {
    editMode: state.dbManager.editor.database.dbEditMode,
    editTitle: state.dbManager.editor.database.dbEditTitle,
    dbTitle: state.dbManager.editor.database.dbTitle,
    dbSummary: state.dbManager.editor.database.dbSummary,
    dbType: state.dbManager.editor.database.dbType,
    hasChangedTitle: state.dbManager.editor.database.dbTitleChanged,
    hasChangedSummary: state.dbManager.editor.database.dbSummaryChanged,
    hasChangedType: state.dbManager.editor.database.dbTypeChanged,
    projectModal: state.modalManager.showProjectModal,
    prjTitle: state.formManager.prjTitle,
    prjSummary: state.formManager.prjSummary,
    prjWebsite: state.formManager.prjWebsite,
    userId: state.formManager.userId,
  }
};

const mapDispatchToDBColumnProps = (dispatch) => {
  return {
    editDatabase: (name, value) => {
      dispatch({
        type: 'EDIT_INPUT_CHANGE',
        tier: 'database',
        name: name,
        value: value
      })
    },
    toggleDbEditState: (name) => {
      dispatch({
        type: 'TOGGLE_EDIT_STATE',
        tier: 'database',
        name: name
      })
    },
    setDbEditState: (name, value) => {
      dispatch({
        type: 'SET_EDIT_STATE',
        tier: 'database',
        name: name,
        value: value
      })
    },
    toggleDbSelection: (database) => {
      dispatch({
        type: 'TOGGLE_DB_SELECTION',
        database: database
      })
    },
    submitDbChanges: (dbChanges) => {
      if(dbChanges.editMode){

        let dbData = {};
        // Check if a field has changed
        if(dbChanges.hasChangedTitle){
          dbData = {...dbData, title: dbChanges.dbTitle};
          dispatch({
            type: 'SET_EDIT_STATE',
            tier: 'database',
            name: 'dbTitleChanged',
            value: false
          });
        }
        if(dbChanges.hasChangedSummary){
          dbData = {...dbData, summary: dbChanges.dbSummary};
          dispatch({
            type: 'SET_EDIT_STATE',
            tier: 'database',
            name: 'dbSummaryChanged',
            value: false
          });
        }
        if(dbChanges.hasChangedType){
          dbData = {...dbData, type: dbChanges.dbType};
          dispatch({
            type: 'SET_EDIT_STATE',
            tier: 'database',
            name: 'dbTypeChanged',
            value: false
          });
        }

        // If something has changed, send updated key value pairs to server
        if(Object.keys(dbData).length !== 0 && dbData.constructor === Object){
          API.updateDB(dbChanges.db._id, dbData)
            .then(resp => console.log('Response:',resp.data))
            .catch(err => dispatch({
              type: 'RECORD_ERROR',
              error: err
            }));
        }
      }
    },
    refreshDBList: () => {
      API.getDatabases()
        .then(resp => dispatch({
          type: 'REFRESH_DB_LIST',
          databases: resp.data
        }))
        .catch(err => dispatch({
          type: 'RECORD_ERROR',
          error: err
        }));
    },
    removeDB: (userId, id) => {
      API.removeDB(userId, id)
        .then(() => {
          this.refreshDBList();
        })
        .catch(err => dispatch({
          type: 'RECORD_ERROR',
          error: err
        }));
    },
    removeProjectFromDB: (dbId, prjId) => {
      API.removeDBProject(dbId, {projectId: prjId})
        .then(resp => {
          console.log('Project removed');

          // this.setState({ db: resp.data });
          dispatch({
            type: 'REFRESH_DB',
            database: resp.data
          })
        })
        .catch(err => dispatch({
          type: 'RECORD_ERROR',
          error: err
        }));
    },
    toggleModal: (modalName) => {
      dispatch({
        type: 'TOGGLE_MODAL',
        name: modalName
      })
    }
  }
};

const DatabaseEntry = ({ db, editMode, editTitle, dbTitle, dbSummary, dbType, hasChangedTitle,
  hasChangedSummary, hasChangedType, editDatabase, toggleDbEditState, setDbEditState, removeDB,
  toggleDbSelection, submitDbChanges, removeProjectFromDB, toggleModal, userId }) => {

  return (
    <Card className={`mb-2 db-item ${db.isExpanded ? 'expanded': ''}`}
      id={db._id}>
      <CardHeader>
        <div className="header-content">
          <span className="record-title">
            {(editMode && db.isExpanded)
              ? (<div>
                {editTitle
                  ? (<input type="text" name="dbTitle" value={dbTitle}
                    autoComplete="off" onBlur={() => toggleDbEditState('dbEditTitle')}
                    onChange={(e) => {
                      editDatabase(e.target.name, e.target.value);
                      setDbEditState('dbTitleChanged', true);
                    }} />)
                  : (<div onClick={() => toggleDbEditState('dbEditTitle')}>
                    {dbTitle}
                  </div>)
                }
              </div>)
              : (db.title)
            }
          </span>
          {db.isExpanded
            ? <FontAwesomeIcon className="up-arrow" icon="angle-up" />
            : <FontAwesomeIcon icon="angle-down" />
          }
        </div>
        <div className={`${!editMode ? 'clickable-overlay' : ''}`}
          onClick={() => toggleDbSelection(db)}></div>
        {editMode
          ? (<span className="btn-edit mr-3 btn-success" onClick={() => {
            submitDbChanges({ db, editMode, dbTitle, dbSummary, dbType,
            hasChangedTitle, hasChangedSummary, hasChangedType });

            toggleDbEditState('dbEditMode');
          }}>Save</span>)
          : (<span className="btn-edit mr-3" onClick={() =>
            toggleDbEditState('dbEditMode')}>Edit</span>)
        }
      </CardHeader>
      <Collapse isOpen={db.isExpanded}>
        <CardBody>
          <CardText>
            {editMode
              ? (<textarea className="summary" rows="3" name="dbSummary"
                value={dbSummary} onChange={(e) => {
                  editDatabase(e.target.name, e.target.value);
                  setDbEditState('dbSummaryChanged', true);
                }} placeholder="Summary..." />)
              : (dbSummary)}
          </CardText>
          <hr />
          {db.projects.length
            ? (<div>
              {db.projects.map(project => (
                <Card className="project mb-3" key={project._id}>
                  {project.image &&
                    <CardImg top width="100%" src={project.image} alt={project.title}/>
                  }
                  <CardBody>
                    <CardTitle>{project.title}</CardTitle>
                    <CardText>{project.summary}</CardText>
                    <CardFooter>
                      {project.website &&
                        <a className="" href={project.website} target="_blank" rel="noopener noreferrer">View Site</a>
                      }
                    </CardFooter>
                  </CardBody>
                  <span onClick={() => removeProjectFromDB(db._id, project._id)}>
                    <FontAwesomeIcon className="remove-project"
                    icon="window-close"/>
                  </span>
                </Card>
              ))}
              <Button color="primary" className="w-100" onClick={() => toggleModal('showProjectModal')}>
                <FontAwesomeIcon className="btn-add text-white" size="2x"
                icon="plus-circle" />
              </Button>
            </div>)
            : (<Card className="placeholder-project">
              <CardBody>
                <CardTitle className="text-center">Add a Project</CardTitle>
                <CardText className="text-center">
                  <FontAwesomeIcon className="btn-add text-success"
                    icon="plus-circle" size="2x"
                    onClick={() => toggleModal('showProjectModal')}
                  />
                </CardText>
              </CardBody>
            </Card>)
          }
        </CardBody>
        <CardFooter>
          <div className="d-flex justify-content-between">
            {editMode
              ? (<Input disabled={!editMode} className="select-type" type="select" name="dbType" value={dbType}
                onChange={(e) => {
                  editDatabase(e.target.name, e.target.value);
                  setDbEditState('dbTypeChanged', true);
                }}>
                <option>MySQL</option>
                <option>MongoDB</option>
              </Input>)
              : (<span className="item-type">{dbType}</span>)
            }
            {editMode &&
              <Button color="danger" onClick={() => removeDB(userId, db._id)}>
                Delete
              </Button>
            }
          </div>
          {!editMode &&
            <span className="dateAdded">
              Added: {moment(db.dateAdded).format('MMMM DD YYYY')}
            </span>
          }
        </CardFooter>
      </Collapse>
    </Card>
  )
};

const DatabaseRecord = connect(
  mapStateToDBColumnProps,
  mapDispatchToDBColumnProps
)(DatabaseEntry);

export default DatabaseRecord;
