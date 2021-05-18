import crypto from 'crypto';

export const URL = 'https://vws.vuforia.com';

const hashMD5 = (body) => {
  const md5Hex = crypto.createHash('md5').update(body).digest('hex');

  return md5Hex;
}

const hashHMAC = (secret_key, sign) => {
  const HmacSHA1 = crypto.createHmac('sha1', secret_key).update(sign).digest('base64');

  return HmacSHA1;
}

const createToSign = (request) => {
  const sign = request.method + '\n' +
    hashMD5(JSON.stringify(request.body)) + '\n' +
    request.content_type + '\n' +
    request.date + '\n' +
    request.path;

  return sign;
}

const createSignature = (request) => {
  const stringToSign = createToSign(request);
  const signature = hashHMAC(process.env.REACT_APP_SECRET_KEY, stringToSign);

  return signature;
}

//MarkerName = BookName<bookPlat>Author<bookPlat>MarkerName
//Metadata = { JSON }
//MarkerImage = Image Locations
export const target = async (MarkerName, metadata, MarkerImage) => {
  const body = {
    name: MarkerName,
    width: 50,
    image: await getMarker64(MarkerImage),
    active_flag: true,
    application_metadata: getMeta64(metadata),
  }

  return JSON.stringify(body);
}

export const Header = (method, body, content_type, path) => {
  const date = new Date().toUTCString();
  const request = {
    method: method,
    body: body,
    content_type: content_type,
    date: date,
    path: path,
  }

  return {
    'Host': URL,
    'Date': date,
    'Authorization': 'VWS '+process.env.REACT_APP_ACCESS_KEY+':'+createSignature(request),
    'Content-Type': content_type,
  }
}

const getMarker64 = async (MarkerImage) => {
  let reader = new FileReader();
  reader.readAsDataURL(MarkerImage);
  reader.onload = () => {
    return reader.result;
  };
}

const getMeta64 = (metadata) => {
  const buffer = new Buffer(JSON.stringify(metadata));

  return buffer.toString('base64');
}