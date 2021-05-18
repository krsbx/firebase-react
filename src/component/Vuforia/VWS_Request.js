import { URL, Header } from './VWSHandler';
import axios from 'axios';

export async function VWS_Request(method, body, content_type, targetID=null){
  const path = !targetID ? '/targets' : '/targets/'+targetID;
  const URI = URL+path;
  let result = {};

  const axiosInstance = axios.create({
    baseURL: URL,
    header: Header(method, body, content_type, path)
  });

  //VWS Request
  if(method === 'POST'){
    axiosInstance.post(URI, body).then(res => {
      console.log(res);
      result = res;
    }).catch(res => {
      console.log(res);
      result = res;
    });
  }else if(method === 'PUT'){
    axiosInstance.put(URI, body).then(res => {
      console.log(res);
      result = res;
    }).catch(res => {
      console.log(res);
      result = res;
    });
  }else if(method === 'DELETE'){
    axiosInstance.delete(URI).then(res => {
      console.log(res);
      result = res;
    }).catch(res => {
      console.log(res);
      result = res;
    })
  }

  return result;
}