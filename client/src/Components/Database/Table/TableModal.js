import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TableModal = ({ showTableModal, toggleModal, handleInputChange,
  tbTitle, tbSummary, tbRecordCount, addTable }) => {
  const isValidTable = tbTitle !== null && tbTitle !== '';

  return(
    <Modal isOpen={showTableModal} toggle={() => toggleModal(showTableModal)}>
      <Form>
        <ModalHeader toggle={() => toggleModal(showTableModal)}>
          Add New Table
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="tbTitle">
              Table Name <span className="required">*</span>
            </Label>
            <Input type="text" name="tbTitle" id="tbTitle"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label for="tbSummary">Description</Label>
            <Input type="textarea" name="tbSummary" id="tbSummary"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label for="tbRecordsCount">Number of Records</Label>
            <Input type="number" name="tbRecordsCount" id="tbRecordsCount"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color={`${isValidTable ? 'primary' : 'secondary'}`}
            disabled={!isValidTable} onClick={(e) => {
              toggleModal('showTableModal');
              addTable(e, {
                title: tbTitle,
                summary: tbSummary,
                recordCount: tbRecordCount
              });
            }}>
            Save
          </Button>{' '}
          <Button color="danger" onClick={() => toggleModal('showTableModal')}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default TableModal;
