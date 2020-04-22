import axios from 'axios';

const client = axios.create({
  baseURL: 'http://192.168.0.19:3333/',
  timeout: 15000,
  withCredentials: true,
});

export default client;
