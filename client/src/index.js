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
    selectedField: null
  }, action
) => {
  switch(action.type) {
    case 'LOAD_DB_LIST':
      return {
        ...state,
        databases: action.databases.map(d => ({...d, isExpanded: false})),
        tables: null,
        selectedDB: null,
        selectedTable: null,
        selectedField: null,
        error: null
      }
    case 'UPDATE_DATABASES':
      return {
        ...state,
        databases: action.databases.map(d => {
          if(state.selectedDB){
            if(state.selectedDB._id === d._id){
              return {...d, isExpanded: true };
            } else {
              return {...d, isExpanded: false };
            }
          } else {
            return {...d, isExpanded: false };
          }
        }),
        error: null
      }
    case 'UPDATE_TABLES':
      return {
        ...state,
        databases: action.databases.map(d => {
          if(d._id === state.selectedDB._id){
            if(state.selectedTable){
              return {
                ...d,
                tables: d.tables.map(t => {
                  if(t._id === state.selectedTable._id){
                    return {...t, isExpanded: true};
                  } else {
                    return {...t, isExpanded: false};
                  }
                }),
                isExpanded: true,
              }
            } else {
              return { ...d, isExpanded: true };
            }
          } else {
            return { ...d, isExpanded: false };
          }
        }),
        error: null
      }
    case 'UPDATE_FIELDS':
      return {
        ...state,
        databases: action.databases.map(d => {
          if(d._id === state.selectedDB._id){
            return {
              ...d,
              tables: d.tables.map(t => {
                if(t._id === state.selectedTable._id){
                  return {...t, isExpanded: true};
                } else {
                  return {...t, isExpanded: false};
                }
              }),
              isExpanded: true
            }
          } else {
            return {
              ...d, 
              isExpanded: false
            }
          }
        }),
        error: null
      }
    case 'UPDATE_SINGLE_FIELD':
      return {
        ...state,
        databases: action.databases.map(d => {
          if(d._id === state.selectedDB._id){
            return {
              ...d,
              tables: d.tables.map(t => {
                if(t._id === state.selectedTable._id){
                  return {...t, isExpanded: true};
                } else {
                  return {...t, isExpanded: false};
                }
              }),
              isExpanded: true
            }
          } else {
            return { ...d, isExpanded: false }
          }
        }),
        selectedField: action.delta,
        error: null
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
            error: null
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
            error: null        
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
          error: null
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
            error: null
          }
        } else {
          return {
            ...state,
            databases: state.databases.map(d => ({
              ...d,
              tables: d.tables.map(t => {
                if(t._id === action.table._id){
                  return {...t, isExpanded: true};
                } else {
                  return {...t, isExpanded: false};
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
            error: null
          }
        }
      } else {
        return {
          ...state,
          databases: state.databases.map(d => ({
            ...d,
            tables: d.tables.map(t => {
              if(t._id === action.table._id){
                return {...t, isExpanded: true};
              } else {
                return {...t, isExpanded: false};
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
          error: null
        }
      }
    case 'SELECT_FIELD':
      return {
        ...state,
        selectedField: action.field,
        error: null
      }
    case 'RECORD_ERROR':
      return {
        ...state,
        error: action.error
      }
    default:
      return state;
  }
};

const userManager = (state = {
	showSignUpForm: false
}, action) => {
  switch(action.type){
    case 'AUTHENTICATED_USER':
      return {
        ...state,
        authUser: action.user,
        userId: action.user.uid,
        username: '',
        password: ''
      }
    case 'LOGOUT_USER':
      return {
        ...state,
        authUser: null,
        userId: null
			}
		case 'TOGGLE_SIGNUP_FORM':
			return {
				...state,
				showSignUpForm: !state.showSignUpForm
			}
		case 'LOGIN_ERROR':
			return {
				...state,
				loginError: action.error
			}
		case 'LOGOUT_ERROR':
			return {
				...state,
				logoutError: action.error
			}
		case 'SIGNUP_ERROR':
			return {
				...state,
				signUpError: action.error
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
    case 'CLEAR_FORM_MANAGER':
      return {}
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
  modalManager,
  userManager
});

ReactDOM.render(
  <Provider store={createStore(
    databaseApp,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
