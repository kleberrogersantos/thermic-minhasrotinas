import axios from 'axios';
const url = 'http://192.168.0.11:9995/';

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
