const stateKeys = (state) => {
	return {
		showSignUpForm: state.userManager.showSignUpForm,
		dbError: state.dbManager.error,
		
		// User Info
		authUser: state.userManager.authUser,
		userId: state.userManager.userId,
		username: state.formManager.username,
    password: state.formManager.password,
		signUpError: state.userManager.signUpError,
		loginError: state.userManager.loginError,
		logoutError: state.formManager.logoutError,
		
		// Database Info
    selectedDB: state.dbManager.selectedDB,
    selectedTable: state.dbManager.selectedTable,
		selectedField: state.dbManager.selectedField,

    // Modals
    showDBModal: state.modalManager.showDBModal,
    showTableModal: state.modalManager.showTableModal, 
    showFieldModal: state.modalManager.showFieldModal, 
    showProjectModal: state.modalManager.showProjectModal, 

    // Database Modal
    dbTitle: state.formManager.dbTitle,
    dbSummary: state.formManager.dbSummary,
    dbType: state.formManager.dbType,

    // Table Modal
    tbTitle: state.formManager.tbTitle,
    tbSummary: state.formManager.tbSummary,
    tbRecordCount: state.formManager.tbRecordCount,

    // Field Modal
    fdTitle: state.formManager.fdTitle,
    fdSummary: state.formManager.fdSummary,
    fdDataType: state.formManager.fdDataType,
    fdDataLength: state.formManager.fdDataLength,
    fdAllowNull: state.formManager.fdAllowNull,
    fdKey: state.formManager.fdKey,
    fdDefaultValue: state.formManager.fdDefaultValue,

    // Project Modal
    prjTitle: state.formManager.prjTitle,
    prjSummary: state.formManager.prjSummary,
		prjWebsite: state.formManager.prjWebsite,
		
		databases: state.dbManager.databases,
		query: state.formManager.query,
	}
};

export default stateKeys;