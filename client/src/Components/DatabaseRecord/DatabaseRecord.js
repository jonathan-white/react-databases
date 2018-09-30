import React from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardImg, CardText, CardBody, CardFooter,
  CardTitle, Collapse, Input, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

import './DatabaseRecord.css';
import API from '../../utils/API';

const mapStateToDBProps = (state) => {
  return {
    userId: state.userManager.userId,
  }
};

class DatabaseEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editMode: false,
      editTitle: false,
      dbTitle: this.props.db.title,
      dbSummary: this.props.db.summary,
      dbType: this.props.db.type,
      hasChangedTitle: false,
      hasChangedSummary: false,
      hasChangedType: false,
    }

    this.updateState = this.updateState.bind(this);
    this.toggleState = this.toggleState.bind(this);
    this.toggleDbSelection = this.toggleDbSelection.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.removeProjectFromDB = this.removeProjectFromDB.bind(this);
    this.removeDB = this.removeDB.bind(this);
    this.submitChanges = this.submitChanges.bind(this);
  };
  
  updateState(name, value){
    this.setState({ [name]: value });
  };

  toggleState(name){
    this.setState((prevState) => ({ [name]: !prevState[name] }));
  }

  toggleDbSelection(database){
    this.props.dispatch({
      type: 'TOGGLE_DB_SELECTION',
      database: database
    })
  };

  toggleModal(modalName){
    this.props.dispatch({
      type: 'TOGGLE_MODAL',
      name: modalName
    })
  };

  removeProjectFromDB(dbId, prjId){
    API.removeDBProject(dbId, {projectId: prjId})
        .then(resp => {
          console.log('Project removed');

          // this.setState({ db: resp.data });
          this.props.dispatch({
            type: 'UPDATE_DATABASES',
            database: resp.data
          })
        })
        .catch(err => this.props.dispatch({
          type: 'RECORD_ERROR',
          error: err
        }));
  };

  removeDB(userId, id){
    API.this.removeDB(userId, id)
        .then(() => {
          console.log(`Database ${id} removed`);
          // dispatch({
          //   type: 'REMOVE_DB_FROM_LIST',
          //   databaseId: id
          // });
          // API.getDatabases(userId)
          //   .then(resp => dispatch({
          //     type: 'REFRESH_DB_LIST',
          //     databases: resp.data
          //   }))
          //   .catch(err => dispatch({
          //     type: 'RECORD_ERROR',
          //     error: err
          //   }));
        })
        .catch(err => this.props.dispatch({
          type: 'RECORD_ERROR',
          error: err
        }));
  }

  submitChanges(){
    if(this.state.editMode){
      this.updateState('editTitle', false);

      let dbData = {};
      // Check if a field has changed
      if(this.state.hasChangedTitle){
        dbData = {...dbData, title: this.state.dbTitle};
      }
      if(this.state.hasChangedSummary){
        dbData = {...dbData, summary: this.state.dbSummary};
      }
      if(this.state.hasChangedType){
        dbData = {...dbData, type: this.state.dbType};
      }

      // If something has changed, send updated key value pairs to server
      if(Object.keys(dbData).length !== 0 && dbData.constructor === Object){
        API.updateDB(this.props.db._id, {...dbData, userId: this.props.userId})
          .then(resp => console.log('Response:',resp.data))
          .catch(err => this.props.dispatch({
            type: 'RECORD_ERROR',
            error: err
          }));
      }
    }
  }

  render() {
    const { db, userId } = this.props;

    const { editMode, editTitle, dbTitle, dbSummary, dbType } = this.state;

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
                      autoComplete="off" onBlur={() => this.toggleState('editTitle')}
                      onChange={(e) => {
                        this.updateState(e.target.name, e.target.value);
                        this.updateState('hasChangedTitle', true);
                      }} />)
                    : (<div onClick={() => this.toggleState('editTitle')}>
                      {dbTitle}
                    </div>)
                  }
                </div>)
                : (dbTitle)
              }
            </span>
            {db.isExpanded
              ? <FontAwesomeIcon className="up-arrow" icon="angle-up" />
              : <FontAwesomeIcon icon="angle-down" />
            }
          </div>
          <div className={`${!editMode ? 'clickable-overlay' : ''}`}
            onClick={() => this.toggleDbSelection(db)}></div>
          {editMode
            ? (<span className="btn-edit mr-3 btn-success" onClick={() => {
              this.submitChanges();
              this.toggleState('editMode');
            }}>Save</span>)
            : (<span className="btn-edit mr-3" onClick={() =>
              this.toggleState('editMode')}>Edit</span>)
          }
        </CardHeader>
        <Collapse isOpen={db.isExpanded}>
          <CardBody>
            <CardText>
              {editMode
                ? (<textarea className="summary" rows="3" name="dbSummary"
                  value={dbSummary} placeholder="Summary..." onChange={(e) => {
                    this.updateState(e.target.name, e.target.value);
                    this.updateState('hasChangedSummary', true);
                  }} />)
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
                    <span onClick={() => this.removeProjectFromDB(db._id, project._id)}>
                      <FontAwesomeIcon className="remove-project"
                      icon="window-close"/>
                    </span>
                  </Card>
                ))}
                <Button color="primary" className="w-100" onClick={() => this.toggleModal('showProjectModal')}>
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
                      onClick={() => this.toggleModal('showProjectModal')}
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
                    this.updateState(e.target.name, e.target.value);
                    this.updateState('hasChangedType', true);
                  }}>
                  <option>MySQL</option>
                  <option>MongoDB</option>
                </Input>)
                : (<span className="item-type">{dbType}</span>)
              }
              {editMode &&
                <Button color="danger" onClick={() => this.removeDB(userId, db._id)}>
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
  }
};

const DatabaseRecord = connect(mapStateToDBProps)(DatabaseEntry);

export default DatabaseRecord;
