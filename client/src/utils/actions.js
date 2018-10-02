import { auth } from '../firebase';
import API from './API';

const actions = (dispatch) => {
	return {
		// ======================
		// Home
		// ======================
		updateError: (error) => {
			dispatch({
				type: 'RECORD_ERROR',
				error: error
			})
		},
		loadUserData: (user) => {
			dispatch({
				type: 'AUTHENTICATED_USER',
				user: user
			});
			// Fetch user's databases
			API.getDatabases(user.uid)
				.then(resp => dispatch({
					type: 'LOAD_DB_LIST',
					databases: resp.data
				}))
				.catch(err => dispatch({
					type: 'RECORD_ERROR',
					error: err
				}));
		},
		addDatabase: (event, newDB) => {
			event.preventDefault();
	
			API.addDatabase(newDB)
				.then(() => 
					API.getDatabases(newDB.userId)
						.then(resp => dispatch({
							type: 'UPDATE_DATABASES',
							databases: resp.data
						}))
						.catch(err => dispatch({
							type: 'RECORD_ERROR',
							error: err
						}))
				)
				.catch(err => dispatch({
					type: 'RECORD_ERROR',
					error: err
				}));
		},
		addTable: (event, newTable) => {
			event.preventDefault();
	
			API.addTable(newTable)
				.then(() =>
					API.getDatabases(newTable.userId)
					.then(resp => dispatch({
						type: 'UPDATE_TABLES',
						databases: resp.data
					}))
					.catch(err => dispatch({
						type: 'RECORD_ERROR',
						error: err
					}))
				)
				.catch(err => dispatch({
					type: 'RECORD_ERROR',
					error: err
				}));
		},
		addField: (event, newField) => {
			event.preventDefault();
	
			API.addField(newField)
				.then(() => 
					API.getDatabases(newField.userId)
						.then(resp => dispatch({
							type: 'UPDATE_FIELDS',
							databases: resp.data
						}))
						.catch(err => dispatch({
							type: 'RECORD_ERROR',
							error: err
						}))
				)
				.catch(err => dispatch({
					type: 'RECORD_ERROR',
					error: err
				}))
		},
		handleInputChange: (name, value) => { 
			dispatch({
				type: 'ADD_INPUT_CHANGE',
				name: name,
				value: value
			})
		},
		toggleModal: (modalName) => {
			dispatch({
				type: 'CLEAR_FORM_MANAGER'
			});
			dispatch({
				type: 'TOGGLE_MODAL',
				name: modalName
			});
		},
		addProjectToDB(event, dbId, projData){
			event.preventDefault();
	
			API.addProject(projData)
				.then(resp => 
					// Link new project to the database
					API.addDBProject(dbId, { userId: projData.userId, projectId: resp.data._id })
						.then(() => 
							API.getDatabases(projData.userId)
								.then(dbs => dispatch({
										type: 'UPDATE_DATABASES',
										databases: dbs.data
									})
								)
								.catch(err => dispatch({
									type: 'RECORD_ERROR',
									error: err
								}))
						)
						.catch(err => dispatch({
							type: 'RECORD_ERROR',
							error: err
						}))
				)
				.catch(err => dispatch({
					type: 'RECORD_ERROR',
					error: err
				}));
		},
		searchFor: (query) => {
			dispatch({
				type: 'SEARCH_QUERY',
				query: query
			})
		},
	
		// ======================
		// DatabaseRecord
		// ======================
		
		toggleDbSelection: (database) => {
			dispatch({
				type: 'TOGGLE_DB_SELECTION',
				database: database
			})
		},
		
		// ======================
		// FieldCol
		// ======================
	
		dbAction: (userId, actionType, field) => {
			API.getDatabases(userId)
				.then(resp => dispatch({
					type: actionType,
					databases: resp.data,
					delta: field
				}))
				.catch(err => dispatch({
					type: 'RECORD_ERROR',
					error: err
				}))
		},
		
		// ======================
		// Login
		// ======================

		submitCredentials: (event, username, password) => {
			event.preventDefault();
			// Use Firebase to check auth status
			auth.doSignInWithEmailAndPassword(username, password)
				.then((resp) => {
					// Once authenticated...
					dispatch({
						type: 'AUTHENTICATED_USER',
						user: resp.user
					});
	
					localStorage.setItem('uid',resp.user.uid);
	
					// Fetch user's databases
					API.getDatabases(resp.user.uid)
						.then(resp => dispatch({
							type: 'REFRESH_DB_LIST',
							databases: resp.data
						}))
						.catch(err => dispatch({
							type: 'RECORD_ERROR',
							error: err
						}));
				})
				.catch(err => dispatch({
					type: 'FORM_ERROR',
					error: err
				}));
		},
	
		// ======================
		// Logout
		// ======================
		
		logout: (event) => {
			event.preventDefault();
			// Use Firebase to check auth status
			auth.doSignOut();
			dispatch({
				type: 'LOGOUT_USER'
			});
			document.querySelector('#username').value = '';
			document.querySelector('#password').value = '';
			localStorage.removeItem('uid');
		},
		
		// ======================
		// TableRecord
		// ======================
	
		toggleTbSelection: (table) => {
			dispatch({
				type: 'TOGGLE_TBL_SELECTION',
				table: table
			})
		},
		selectField: (field) => {
			dispatch({
				type: 'SELECT_FIELD',
				field: field
			});
		}
	}
}

export default actions;