import crypto from 'crypto';

export const URL = 'http://localhost:3001/api/';

export const timestamp = () => {
  const now = new Date();

  return now.toUTCString();
}

const hashMD5 = (body) => {
  const md5Hex = crypto.createHash('md5').update(body).digest('hex');

  return md5Hex;
}

const hashHMAC = (key, sign) => {
  const HmacSHA1 = crypto.createHmac('sha1', key).update(sign).digest('base64');

  return HmacSHA1;
}

const createToSign = (request) => {
  const sign = request.method + '\n' +
    hashMD5(request.body) + '\n' +
    request.type + '\n' +
    request.timestamp + '\n' +
    request.path;

  return sign;
}

const createSignature = (request) => {
  const stringToSign = createToSign(request);
  const signature = hashHMAC(request.secretKey, stringToSign);

  return signature;
}

//MarkerName = BookName<bookPlat>Author<bookPlat>MarkerName
//Metadata = { JSON }
//MarkerImage = Image Locations
export const target = (MarkerName, metadata, MarkerImage) => {
  const body = {
    'name': MarkerName,
    'width': 50,
    'image': MarkerImage,
    'active_flag': true,
    'application_metadata': getMeta64(metadata),
  }

  return JSON.stringify(body);
}

export const newTarget = (metadata, MarkerImage) => {
  const body = {
    'image': MarkerImage,
    'application_metadata': getMeta64(metadata),
  }

  return JSON.stringify(body);
}

export const createAuthorizations = (request) => {
  const signature = createSignature(request);
  
  const authorization = 'VWS ' + request.accessKey + ':' + signature;

  return authorization;
}

export const getMarker64 = (MarkerImage) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(MarkerImage);
    reader.onload = () => resolve(reader.result.split(',')[1]);

    reader.onerror = (error) => reject(error);
  });
}

export const getMeta64 = (metadata) => {
  const buffer = new Buffer.from(JSON.stringify(metadata));

  return buffer.toString('base64');
}