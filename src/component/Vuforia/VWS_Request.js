import { URL, createAuthorizations, timestamp } from './VWSHandler';
import axios from 'axios';

const HttpRequest = async (httpsOptions, body) => {
  const instance = axios.create({
    baseURL: httpsOptions.url,
    headers: httpsOptions.headers,
    responseType: 'json',
  });
  
  const request = await instance({
    method: httpsOptions.method,
    data: body,
  }).catch(error => {
    console.log(error);
  });

  return new Promise((resolve, reject) => {
    resolve(request);
  });
}

const VWSRequest = async (request) => {
  request.accessKey = process.env.REACT_APP_ACCESS_KEY;
  request.secretKey = process.env.REACT_APP_SECRET_KEY;
  request.timestamp = timestamp();

  var httpsOptions = {

    url: URL+request.path,
    method: request.method,
    headers: {
        'Content-Type': request.type,
        'Authorization': createAuthorizations(request),
    }
  };

  const result = await HttpRequest(httpsOptions, request.body);

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

export const addTarget = async (target) => {
  const request = {
    'path': '',
    'method': 'post',
    'type': 'application/json',
    'body': target
  }

  const result = await VWSRequest(request);

  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

export const updateTarget = async (targetId, target) => {
  const request = {
    'path': targetId,
    'method': 'put',
    'type': 'application/json',
    'body': target
  };

  const result = await VWSRequest(request);
  
  return new Promise((resolve, reject) => {
    resolve(result);
  });
}

export const deleteTarget = async (targetId) => {
  const request = {

      'path': targetId,
      'method': 'delete',
      'type': 'application/json',
      'body': ''
  };

  const result = await VWSRequest(request);
  
  return new Promise((resolve, reject) => {
    resolve(result);
  });
};