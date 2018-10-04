import React from 'react';
import { connect } from 'react-redux';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter,
	Form, FormGroup, Label, Input, FormText } from 'reactstrap';
	
import { default as stateKeys } from '../../utils/stateKeys';
import { default as actions } from '../../utils/actions';
import './ModalForms.css';
	
const mapStateToModalFormProps = (state) => {
	return stateKeys(state);
};

const mapDispatchToModalFormProps = (dispatch) => {
	return actions(dispatch);
};

class ModalForms extends React.Component {

	render(){
		const { userId, selectedDB, selectedTable, 
			showDBModal, showTableModal, showFieldModal, showProjectModal, dbTitle, 
			dbSummary, dbType, tbTitle, tbSummary, tbRecordCount, fdTitle, fdSummary, 
			fdDataType, fdDataLength, fdAllowNull, fdKey, fdDefaultValue, prjTitle, 
			prjSummary, prjWebsite } = this.props;
		
		// Database Form Data
		const dbData = {
			userId: userId,
			title: dbTitle,
			summary: dbSummary,
			type: dbType || 'MySQL'
		};
		const isValidDB = dbTitle !== null && dbTitle !== '' &&
			dbSummary !== null && dbSummary !== '' &&
			dbType !== null && dbType !== '';
		
		// Table Form Data
		const tableData = {
			userId: userId,
			databaseId: (selectedDB) ? selectedDB._id : '',
			title: tbTitle,
			summary: tbSummary,
			recordCount: tbRecordCount || 0
		};
		const isValidTable = tbTitle !== null && tbTitle !== '';
		
		// Field Form Data
		const fieldData = {
			userId: userId,
			tableId: (selectedTable) ? selectedTable._id : null,
			title: fdTitle,
			summary: fdSummary,
			dataType: fdDataType || 'varchar',
			dataLength: fdDataLength,
			allowNull: fdAllowNull || false,
			key: fdKey,
			defaultValue: fdDefaultValue
		};
		const isValidField = fdTitle !== null && fdTitle !== '';
		
		// Project Form Data
		const projectData = {
			userId: userId,
			title: prjTitle,
			summary: prjSummary,
			website: prjWebsite
		};
		const isValidProject = prjTitle !== null && prjTitle !== '' && 
			prjSummary !== null && prjSummary !== '';

		return(
			<div>
				{/* New Database Modal Form */}
				<Modal isOpen={showDBModal} toggle={() => actions.toggleModal('showDBModal')}>
					<Form>
						<ModalHeader toggle={() => this.props.toggleModal('showDBModal')}>
							Add Database
						</ModalHeader>
						<ModalBody>
							<FormGroup>
								<Label for="dbTitle">
									Database Name <span className="required">*</span>
								</Label>
								<Input type="text" name="dbTitle" id="dbTitle" autoFocus
									onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
							</FormGroup>
							<FormGroup>
								<Label for="dbSummary">
									Description <span className="required">*</span>
								</Label>
								<Input type="textarea" name="dbSummary" id="dbSummary"
									onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}/>
							</FormGroup>
							<FormGroup>
								<Label for="dbType">
									Type <span className="required">*</span>
								</Label>
								<Input type="select" name="dbType" id="dbType"
									onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}>
									<option>MySQL</option>
									<option>MongoDB</option>
								</Input>
							</FormGroup>
						</ModalBody>
						<ModalFooter>
							<FormText color="muted">
								<span className="required">*</span> = Required Field
							</FormText>
							<Button color={`${isValidDB ? 'primary' : 'secondary'}`}
								disabled={!isValidDB} onClick={(e) => {
									this.props.toggleModal('showDBModal');
									this.props.addDatabase(e, dbData);
								}}>Save</Button>{' '}
							<Button color="danger" onClick={() => this.props.toggleModal('showDBModal')}>
								Cancel
							</Button>
						</ModalFooter>
					</Form>
				</Modal>

				{/* Table Modal */}
				<Modal isOpen={showTableModal} toggle={() => this.props.toggleModal('showTableModal')}>
					<Form>
						<ModalHeader toggle={() => this.props.toggleModal('showTableModal')}>
							Add New Table
						</ModalHeader>
						<ModalBody>
							<FormGroup>
								<Label for="tbTitle">
									Table Name <span className="required">*</span>
								</Label>
								<Input type="text" name="tbTitle" id="tbTitle" autoFocus
									onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
							</FormGroup>
							<FormGroup>
								<Label for="tbSummary">Description</Label>
								<Input type="textarea" name="tbSummary" id="tbSummary"
									onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}/>
							</FormGroup>
							<FormGroup>
								<Label for="tbRecordsCount">Number of Records</Label>
								<Input type="number" name="tbRecordCount" id="tbRecordCount"
									onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
							</FormGroup>
						</ModalBody>
						<ModalFooter>
							<FormText color="muted">
								<span className="required">*</span> = Required Field
							</FormText>
							<Button color={`${isValidTable ? 'primary' : 'secondary'}`}
								disabled={!isValidTable} onClick={(e) => {
									this.props.toggleModal('showTableModal');
									this.props.addTable(e, tableData);
								}}>Save</Button>{' '}
							<Button color="danger" onClick={() => this.props.toggleModal('showTableModal')}>
								Cancel
							</Button>
						</ModalFooter>
					</Form>
				</Modal>

				{/* Field Modal */}
				<Modal isOpen={showFieldModal} toggle={() => this.props.toggleModal('showFieldModal')}>
					<Form>
						<ModalHeader toggle={() => this.props.toggleModal('showFieldModal')}>
							New Field Details
						</ModalHeader>
						<ModalBody>
							<FormGroup>
								<Label for="fdTitle">
									Field Name <span className="required">*</span>
								</Label>
								<Input type="text" name="fdTitle" id="fdTitle"
									onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}/>
							</FormGroup>
							<FormGroup>
								<Label for="fdSummary">Description</Label>
								<Input type="textarea" name="fdSummary" id="fdSummary"
									onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}/>
							</FormGroup>
							<div className="d-flex">
								<div className="mr-2">
									<FormGroup>
										<Label for="fdDataType">Data Type</Label>
										<Input type="select" name="fdDataType" id="fdDataType"
											defaultValue="varchar"
											onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}>
											<option>boolean</option>
											<option>datetime</option>
											<option>decimal</option>
											<option>double</option>
											<option>int</option>
											<option>text</option>
											<option>tinyint</option>
											<option>varchar</option>
										</Input>
									</FormGroup>
									<FormGroup>
										<Label for="fdDataLength">Length</Label>
										<Input type="number" name="fdDataLength" id="fdDataLength"
											onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
									</FormGroup>
								</div>
								<div className="ml-2">
									<FormGroup>
										<Label for="fdDefaultValue">Default Value</Label>
										<Input type="text" name="fdDefaultValue" id="fdDefaultValue"
											onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
									</FormGroup>
									<FormGroup>
										<Label for="fdKey">Key</Label>
										<Input type="text" name="fdKey" id="fdKey"
											onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
									</FormGroup>
									<FormGroup check>
										<Label check for="fdAllowNull">
											<Input type="checkbox" name="fdAllowNull" id="fdAllowNull"
												onChange={(e) => this.props.handleInputChange(e.target.name, e.target.checked)} />
											Allow Nulls
										</Label>
									</FormGroup>
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<FormText color="muted">
								<span className="required">*</span> = Required Field
							</FormText>
							<Button color={`${isValidField ? 'primary' : 'secondary'}`}
								disabled={!isValidField} onClick={(e) => {
									this.props.toggleModal('showFieldModal');
									this.props.addField(e, fieldData);
								}}>Save</Button>{' '}
							<Button color="danger" onClick={() => this.props.toggleModal('showFieldModal')}>
								Cancel
							</Button>
						</ModalFooter>
					</Form>
				</Modal>

				{/* Project Modal */}
				<Modal isOpen={showProjectModal} toggle={() => this.props.toggleModal('showProjectModal')}>
					<Form>
						<ModalHeader toggle={() => this.props.toggleModal('showProjectModal')}>
							Add Project
						</ModalHeader>
						<ModalBody>
							<FormGroup>
								<Label for="prjTitle">
									Project Name <span className="required">*</span>
								</Label>
								<Input type="text" name="prjTitle" id="prjTitle"
									onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
							</FormGroup>
							<FormGroup>
								<Label for="prjSummary">
									Description <span className="required">*</span>
								</Label>
								<Input type="textarea" name="prjSummary" id="prjSummary"
									onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)}/>
							</FormGroup>
							<FormGroup>
								<Label for="prjWebsite">
									Website
								</Label>
								<Input type="url" name="prjWebsite" id="prjWebsite"
									onChange={(e) => this.props.handleInputChange(e.target.name, e.target.value)} />
							</FormGroup>
						</ModalBody>
						<ModalFooter>
							<FormText color="muted">
								<span className="required">*</span> = Required Field
							</FormText>
							<Button color={`${isValidProject ? 'primary' : 'secondary'}`}
								disabled={!isValidProject}
								onClick={(e) => {
									this.props.addProjectToDB(e, selectedDB._id, projectData);
									this.props.toggleModal('showProjectModal');
								}}>Save</Button>{' '}
							<Button color="danger"
								onClick={() => this.props.toggleModal('showProjectModal')}>Cancel</Button>
						</ModalFooter>
					</Form>
				</Modal>
			</div>
		)
	}
};

const Modals = connect(
	mapStateToModalFormProps,
	mapDispatchToModalFormProps
)(ModalForms);

export default Modals;

