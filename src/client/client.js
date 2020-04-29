import axios from 'axios';

const client = axios.create({
  baseURL: 'https://crest-server.herokuapp.com/',
  timeout: 15000,
  withCredentials: true,
});

export default client;
