import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TableModal from './TableModal';

const mapStateToTBModalProps = (state) => {
  return {
    showTableModal: state.modalManager.showTableModal
  }
};

const mapDispatchToTBModalProps = (dispatch) => {
  return {
    toggleModal: (name) => {
      dispatch({
        type: 'TOGGLE_MODAL',
        name: name
      })
    }
  }
};

const TableModalDisplay = connect(
  mapStateToTBModalProps,
  mapDispatchToTBModalProps
)(TableModal);

export default TableModalDisplay;
