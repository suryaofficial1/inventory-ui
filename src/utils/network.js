import axios from 'axios';
import moment from 'moment';

function resolveAxios(method) {
  switch (method) {
    case 'POST': return axios.post
    case 'PUT': return axios.put
    case 'DELETE': return (url, data, config) => axios.delete(url, config);
    case 'GET':
    default: return (url, data, config) => axios.get(url, config);
  }
}
export const HEADER_ORIGIN_TS = 'Origin-ts'
export const getOriginTsValue = () => moment().local(true);

function execute(method, url, data, token, validCode = 200, contentType = 'application/json') {
  const isFormData = data instanceof FormData;
  let config = {
    timeout: 30000,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': contentType }), // Let axios set Content-Type for FormData
      [HEADER_ORIGIN_TS]: getOriginTsValue(),
    },
    validateStatus: function (status) {
      return status < 500; // Resolve only if the status code is less than 500
    }
  };
  if (token != '' && token != undefined) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return new Promise((resolve, reject) => {
    resolveAxios(method)(url, data, config)
      .then(function (response) {
        if (response.status === validCode)
          resolve(response.data);
        else if (response.status === 403) {
          resolve(response.data);
        } else {
          reject(response.data)
        }
      })
      .catch(function (error) {
        reject(error);
        console.log(error);
      });
  });
}

export const sendPostRequest = (url, data, isForImageUpload = false, token = '') => {
  return execute("POST", url, data, token)
}

export const sendPostRequestWithImage = (url, data, isForImageUpload = false, token = '') => {
  const contentType = isForImageUpload ? undefined : 'application/json'; // Content-Type undefined for FormData
  return execute("POST", url, data, token, 200, contentType);
}

export const sendPostRequestWithAuth = (url, data, token) => {
  return execute("POST", url, data, token)
}


export const sendGetRequest = (url, token = '') => {
  return execute("GET", url, null, token)
}

export const sendDeleteRequest = (url, token = '') => {
  return execute("DELETE", url, null, token)
}


export const sendPutRequest = (url, data, token = '', contentType) => {
  return execute("PUT", url, data, token, 200, contentType)
}