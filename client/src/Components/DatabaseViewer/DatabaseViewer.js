import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from 'reactstrap';
import DatabaseList from '../../Components/DatabaseList';
import stateKeys from '../../utils/stateKeys';
import actions from '../../utils/actions';

const mapStateToDBViewerProps = (state) => stateKeys(state);
const mapDispatchToHomeProps = (dispatch) => actions(dispatch);

class DatabasePageDisplay extends React.Component {
	render(){
		const { databases, query, selectedDB } = this.props;
    
    // Filter the list of databases
    let dbList;
    if(databases && query){
      dbList = databases.filter(d => d.title.toLowerCase().includes(query.toLowerCase()));
    }
		dbList = dbList || databases;
		
		return (
			<div className="container my-4">
				<div className="row">
					<div className="col-4">
						<Input type="text" className="search" placeholder="Search..."
							onChange={(e) => this.props.searchFor(e.target.value)}
						/>
					</div>
				</div>
				<div className="row column-headers">
					<div className="col-4">
						<h4>
							<span className="mr-2">Databases</span>
							<FontAwesomeIcon className="btn-add text-success"
								icon="plus-circle" onClick={() => this.props.toggleModal('showDBModal')} />
						</h4>
					</div>
					<div className="col-4">
						{selectedDB
							? (selectedDB.type === 'MongoDB') ? <h4>Collections</h4> : <h4>Tables</h4>
							: <h4>Tables</h4>
						}
					</div>
					<div className="col-4">
						<h4>Field Details</h4>
					</div>
				</div>
				<div className="row">
					<DatabaseList listOfDBs={dbList} />
				</div>
			</div>
		)
	}
}

const DatabaseViewer = connect(
	mapStateToDBViewerProps,
	mapDispatchToHomeProps
)(DatabasePageDisplay);

export default DatabaseViewer;