import { UrlCodec } from '@angular/common/upgrade';
import axios from 'axios';

const host = window.location.hostname;
console.log(`Host detectado no http.ts: ${host}`);
let url = '';
if (host.includes('thermic.ddns.net')) {
  url = 'http://thermic.ddns.net:9995/'
} else {
  url = 'http://192.168.0.11:9995/';
}


let headers = {
  'Content-Type': 'application/json',
  Authorization: 'Basic ' + btoa('Admin:teste@123'),
  Accept: '*/*',
};

let api = axios.create({
  baseURL: url,
  headers: headers,
});

export default api;
