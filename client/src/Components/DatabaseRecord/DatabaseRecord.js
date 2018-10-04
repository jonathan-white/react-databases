import React from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardImg, CardText, CardBody, CardFooter,
  CardTitle, Collapse, Input, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

import { default as stateKeys } from '../../utils/stateKeys';
import { default as actions } from '../../utils/actions';
import API from '../../utils/API';
import './DatabaseRecord.css';

const mapStateToDBProps = (state) => {
  return stateKeys(state);
};

const mapDispatchToDBProps = (dispatch) => {
	return actions(dispatch);
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
    this.removeDB = this.removeDB.bind(this);
    this.removeProjectFromDB = this.removeProjectFromDB.bind(this);
    this.submitChanges = this.submitChanges.bind(this);
  };
  
  updateState(name, value){
    this.setState({ [name]: value });
  };

  toggleState(name){
    this.setState((prevState) => ({ [name]: !prevState[name] }));
  };

  removeDB(id){
    API.removeDB(this.props.userId, id)
      .then(() => this.props.dbAction(this.props.userId, 'UPDATE_DATABASES'))
      .catch(err => this.props.updateError(err));
  };

  removeProjectFromDB(prjId){
    API.removeDBProject(this.props.db._id, {userId: this.props.userId, projectId: prjId})
      .then(() => this.props.dbAction(this.props.userId, 'UPDATE_DATABASES'))
      .catch(err => this.props.updateError(err));
  };

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
          .then(resp => this.props.dbAction(this.props.userId, 'UPDATE_DATABASES'))
          .catch(err => this.props.updateError(err));
      }
    }
  };

  render() {
    const { db } = this.props;

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
                      className="input-title" onChange={(e) => {
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
            onClick={() => this.props.toggleDbSelection(db)}></div>
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
                          <a className="" href={project.website} target="_blank" 
                            rel="noopener noreferrer">View Site</a>
                        }
                      </CardFooter>
                    </CardBody>
                    <span onClick={() => this.removeProjectFromDB(project._id)}>
                      <FontAwesomeIcon className="remove-project"
                      icon="window-close"/>
                    </span>
                  </Card>
                ))}
                <Button color="primary" className="w-100" onClick={() => this.props.toggleModal('showProjectModal')}>
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
                      onClick={() => this.props.toggleModal('showProjectModal')}
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
                <Button color="danger" onClick={() => this.removeDB(db._id)}>
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

const DatabaseRecord = connect(
  mapStateToDBProps, 
  mapDispatchToDBProps
)(DatabaseEntry);

export default DatabaseRecord;
