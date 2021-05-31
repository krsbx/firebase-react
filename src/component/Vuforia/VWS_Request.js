import { URL, getMeta64 } from './VWSHandler';
import firebase from '../Firebase/FirebaseSDK';
import axios from 'axios';

const remoteConfig = firebase.remoteConfig();

remoteConfig.defaultConfig = {
  'serverAccessKey': process.env.REACT_APP_ACCESS_KEY,
  'serverSecretKey': process.env.REACT_APP_SECRET_KEY,
}

let serverAccessKey = '';
let serverSecretKey = '';

const FetchActive = async () => {
  await remoteConfig.fetchAndActivate();

  serverAccessKey = remoteConfig.getString('AccessKey');
  serverSecretKey = remoteConfig.getString('SecretKey');

  return new Promise((resolve, reject) => {
    resolve({
      accessKey : serverAccessKey,
      secretKey : serverSecretKey,
    });
  })
}


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
  let body = {};

  
  if ( request.method !== 'delete' ) {
    body = JSON.parse(request.body);
  }
  
  if ( !serverAccessKey && !serverSecretKey ) {
    await FetchActive();
  }

  const BaseKey = {
    serverAccessKey : serverAccessKey,
    serverSecretKey : serverSecretKey,
  }

  const Key64 = getMeta64(BaseKey);

  body.VWSKey = Key64;

  var httpsOptions = {

    url: URL+request.path,
    method: request.method,
    headers: {
      'Content-Type': request.type,
    }
  };

  const result = await HttpRequest(httpsOptions, JSON.stringify(body));

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