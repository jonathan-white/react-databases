import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
// import expect from 'expect';
// import deepFreeze from 'deep-freeze';

// Reducer
const dbManager = (
  state = {
    databases: null,
    tables: null,
    selectedDB: null,
    selectedTable: null,
    selectedField: null,

    editor: {
      // Database Editor
      database: {
        dbEditMode: false,
        dbEditTitle: false,
        dbTitle: null,
        dbSummary: null,
        dbType: null,
        dbTitleChanged: false,
        dbSummaryChanged: false,
        dbTypeChanged: false,
      },

      // Table Editor
      table: {
        tbEditMode: false,
        tbEditTitle: false,
        tbTitle: null,
        tbSummary: null,
        tbRecordCount: null,
        tbTitleChanged: false,
        tbSummaryChanged: false,
        tbRecordCountChanged: false,
      },

      // Field Editor
      field: {
        fdEditMode: false,
        fdEditTitle: false,
        fdTitle: null,
        fdSummary: null,
        fdDataType: 'varchar',
        fdDataLength: null,
        fdNulls: false,
        fdKey: null,
        fdDefaultValue: null,
        fdTitleChanged: false,
        fdSummaryChanged: false,
        fdDataTypeChanged: false,
        fdDataLengthChanged: false,
        fdNullsChanged: false,
        fdKeyChanged: false,
        fdDefaultValueChanged: false,
      }
    }
  }, action
) => {
  switch(action.type) {
    case 'REFRESH_DB_LIST':
      return {
        ...state,
        databases: action.databases.map(d => ({...d, isExpanded: false})),
        tables: null,
        selectedDB: null,
        selectedTable: null,
        selectedField: null
      }
    case 'REFRESH_DB':
      return {
        ...state,
        databases: state.databases.map(d => {
          if(d._id === action.database._id){
            return {...action.database, isExpanded: false}
          } else {
            return {...d, isExpanded: false}
          }
        })
      }
    case 'UPDATE_SELECTED_DB':
      return {
        ...state,
        selectedDB: action.database,
        tables: action.database.tables
      }
    case 'SELECT_FIELD':
      return {
        ...state,
        selectedField: action.field,
        editor: {
          ...state.editor,
          field: {
            fdEditMode: false,
            fdEditTitle: false,
            fdTitle: action.field.title,
            fdSummary: action.field.summary,
            fdDataType: action.field.dataType,
            fdDataLength: action.field.dataLength,
            fdAllowNull: action.field.allowNull,
            fdKey: action.field.key,
            fdDefaultValue: action.field.defaultValue,
            fdTitleChanged: false,
            fdSummaryChanged: false,
            fdDataTypeChanged: false,
            fdDataLengthChanged: false,
            fdNullsChanged: false,
            fdKeyChanged: false,
            fdDefaultValueChanged: false,
          }
        }
      }
    case 'TOGGLE_DB_SELECTION':
      if(state.selectedDB) {
        if(state.selectedDB._id === action.database._id) {
          return {
            ...state,
            databases: state.databases.map(d => ({...d, isExpanded: false})),
            selectedDB: null,
            selectedTable: null,
            selectedField: null,
            tables: null,
            editor: {
              ...state.editor,
              database: {
                dbEditMode: false,
                dbEditTitle: false,
                dbTitle: null,
                dbSummary: null,
                dbType: null,
                dbTitleChanged: false,
                dbSummaryChanged: false,
                dbTypeChanged: false,
              }
            }
          }
        } else {
          return {
            ...state,
            databases: state.databases.map(d => {
              if(d._id === action.database._id) {
                return {...d, isExpanded: true};
              } else {
                return {...d, isExpanded: false};
              }
            }),
            selectedDB: {...action.database, isExpanded: true},
            selectedTable: null,
            selectedField: null,
            tables: action.database.tables.map(t => ({...t, isExpanded: false})),
            editor: {
              ...state.editor,
              database: {
                dbEditMode: false,
                dbEditTitle: false,
                dbTitle: action.database.title,
                dbSummary: action.database.summary,
                dbType: action.database.type,
                dbTitleChanged: false,
                dbSummaryChanged: false,
                dbTypeChanged: false,
              }
            }
          }
        }

      } else {
        return {
          ...state,
          databases: state.databases.map(d => {
            if(d._id === action.database._id) {
              return {...d, isExpanded: true};
            } else {
              return {...d, isExpanded: false};
            }
          }),
          selectedDB: {...action.database, isExpanded: true},
          selectedTable: null,
          selectedField: null,
          tables: action.database.tables,
          editor: {
            ...state.editor,
            database: {
              dbEditMode: false,
              dbEditTitle: false,
              dbTitle: action.database.title,
              dbSummary: action.database.summary,
              dbType: action.database.type,
              dbTitleChanged: false,
              dbSummaryChanged: false,
              dbTypeChanged: false,
            }
          }
        }
      }
    case 'TOGGLE_TBL_SELECTION':
      if(state.selectedTable) {
        if(state.selectedTable._id === action.table._id) {
          return {
            ...state,
            databases: state.databases.map(d => ({
              ...d,
              tables: d.tables.map(t => ({...t, isExpanded: false}))
            })),
            selectedTable: null,
            selectedField: null,
            tables: state.tables.map(t => ({...t, isExpanded: false})),
            editor: {
              ...state.editor,
              table: {
                tbEditMode: false,
                tbEditTitle: false,
                tbTitle: null,
                tbSummary: null,
                tbRecordCount: null,
                tbTitleChanged: false,
                tbSummaryChanged: false,
                tbRecordCountChanged: false,
              }
            }
          }
        } else {
          return {
            ...state,
            databases: state.databases.map(d => ({
              ...d,
              tables: d.tables.map(t => {
                if(t._id === action.table._id){
                  return {...t, isExpanded: true}
                } else {
                  return {...t, isExpanded: false}
                }
              })
            })),
            selectedTable: {...action.table, isExpanded: true},
            selectedField: null,
            tables: state.tables.map(t => {
              if(t._id === action.table._id) {
                return {...t, isExpanded: true};
              } else {
                return {...t, isExpanded: false};
              }
            }),
            editor: {
              ...state.editor,
              table:{
                tbEditMode: false,
                tbEditTitle: false,
                tbTitle: action.table.title,
                tbSummary: action.table.summary,
                tbRecordCount: action.table.recordCount,
                tbTitleChanged: false,
                tbSummaryChanged: false,
                tbRecordCountChanged: false,
              }
            }
          }
        }
      } else {
        return {
          ...state,
          databases: state.databases.map(d => ({
            ...d,
            tables: d.tables.map(t => {
              if(t._id === action.table._id){
                return {...t, isExpanded: true}
              } else {
                return {...t, isExpanded: false}
              }
            })
          })),
          selectedTable: {...action.table, isExpanded: true},
          selectedField: null,
          tables: state.tables.map(t => {
            if(t._id === action.table._id) {
              return {...t, isExpanded: true};
            } else {
              return {...t, isExpanded: false};
            }
          }),
          editor: {
            ...state.editor,
            table:{
              tbEditMode: false,
              tbEditTitle: false,
              tbTitle: action.table.title,
              tbSummary: action.table.summary,
              tbRecordCount: action.table.recordCount,
              tbTitleChanged: false,
              tbSummaryChanged: false,
              tbRecordCountChanged: false,
            }
          }
        }
      }
    case 'HAS_LIST':
      return {
        ...state,
        hasList: true
      }
    case 'RECORD_ERROR':
      return {
        ...state,
        error: action.error
      }
    case 'EDIT_INPUT_CHANGE':
      return {
        ...state,
        editor: {
          ...state.editor,
          [action.tier]: {
            ...state.editor[action.tier],
            [action.name]: action.value
          }
        }
      }
    case 'TOGGLE_EDIT_STATE':
      return {
        ...state,
        editor: {
          ...state.editor,
          [action.tier]: {
            ...state.editor[action.tier],
            [action.name]: !state.editor[action.tier][action.name]
          }
        }
      }
    case 'SET_EDIT_STATE':
      return {
        ...state,
        editor: {
          ...state.editor,
          [action.tier]: {
            ...state.editor[action.tier],
            [action.name]: action.value
          }
        }
      }
    default:
      return state;
  }
};

const formManager = (state = {}, action) => {
  switch(action.type){
    case 'ADD_INPUT_CHANGE':
      return {
        ...state,
        [action.name]: action.value
      }
    case 'SEARCH_QUERY':
      return {
        ...state,
        query: action.query
      }
    case 'FORM_ERROR':
      return {
        ...state,
        error: action.error
      }
    case 'AUTHENTICATED_USER':
      return {
        ...state,
        authUser: action.user,
        userId: action.user.uid,
        username: null,
        password: null
      }
    default:
      return state;
  }
};

const modalManager = (state = {
  showDBModal: false,
  showTableModal: false,
  showFieldModal: false,
  showProjectModal: false
}, action) => {
  switch(action.type){
    case 'TOGGLE_MODAL':
      return {
        ...state,
        [action.name]: !state[action.name]
      }
    default:
      return state;
  }
};

// Reducer composition
const databaseApp = combineReducers({
  dbManager,
  formManager,
  modalManager
});

ReactDOM.render(
  <Provider store={createStore(databaseApp)}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
