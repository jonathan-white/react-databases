import axios from 'axios';

export default {
  // Database API
  // ================================
  getDatabases: (userId) => {
    return axios.post('/api/databases', { userId });
  },
  getDatabase: (userId, id) => {
    return axios.post(`/api/databases/${id}`, { userId });
  },
  addDatabase: (dbData) => {
    return axios.post('/api/databases/add-database', dbData);
  },
  removeDB: (userId, dbId) => {
    return axios.delete(`/api/databases/${dbId}`, { data: { userId } });
  },
  updateDB: (dbId, updatedData) => {
    return axios.put(`/api/databases/${dbId}`, updatedData);
  },
  addDBProject: (dbId, projData) => {
    return axios.post(`/api/databases/${dbId}/add-project`, projData);
  },
  removeDBProject: (dbId, projData) => {
    return axios.delete(`/api/databases/${dbId}/remove-project`, { data: projData })
  },

  // Table API
  // ================================
  addTable: (tableData) => {
    return axios.post('/api/tables/add-table', tableData);
  },
  getTable: (userId, id) => {
    return axios.post(`/api/tables/${id}`, { userId });
  },
  removeTable: (userId, tableId) => {
    return axios.delete(`/api/tables/${tableId}`, { data: { userId } });
  },
  updateTable: (tableId, updatedData) => {
    return axios.put(`/api/tables/${tableId}`, updatedData);
  },

  // Field API
  // ================================
  addField: (fieldData) => {
    return axios.post('/api/fields/add-field', fieldData);
  },
  removeField: (userId, fieldId) => {
    return axios.delete(`/api/fields/${fieldId}`, { data: { userId } });
  },
  updateField: (fieldId, updatedData) => {
    return axios.put(`/api/fields/${fieldId}`, updatedData);
  },

  // Project API
  // ================================
  getProjects: (userId) => {
    return axios.post('/api/projects', { userId });
  },
  addProject: (projData) => {
    return axios.post('/api/projects/add-project', projData);
  }
};
