import axios from 'axios';

export default {
  // Database API
  // ================================
  getDatabases: () => {
    return axios.get('/api/databases');
  },
  getDatabase: (id) => {
    return axios.get(`/api/databases/${id}`);
  },
  addDatabase: (dbData) => {
    return axios.post('/api/databases', dbData);
  },
  removeDB: (dbId) => {
    return axios.delete(`/api/databases/${dbId}`);
  },
  updateDB: (dbId, updatedData) => {
    return axios.put(`/api/databases/${dbId}`, updatedData);
  },
  addDBProject: (dbId, projId) => {
    return axios.post(`/api/databases/${dbId}/add-project`,projId);
  },
  removeDBProject: (dbId, projId) => {
    return axios.delete(`/api/databases/${dbId}/remove-project`,projId)
  },

  // Table API
  // ================================
  addTable: (tableData) => {
    return axios.post('/api/tables', tableData);
  },
  getTable: (id) => {
    return axios.get(`/api/tables/${id}`);
  },
  removeTable: (tableId) => {
    return axios.delete(`/api/tables/${tableId}`);
  },

  // Field API
  // ================================
  addField: (fieldData) => {
    return axios.post('/api/fields', fieldData);
  },
  removeField: (fieldId) => {
    return axios.delete(`/api/fields/${fieldId}`);
  },

  // Project API
  // ================================
  getProjects: () => {
    return axios.get('/api/projects');
  },
  addProject: (projData) => {
    return axios.post('/api/projects', projData);
  }
};
