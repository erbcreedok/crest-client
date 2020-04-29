import axios from 'axios';
import getServerUri from '../scripts/getServerUri';

const client = axios.create({
  baseURL: getServerUri(),
  timeout: 15000,
  withCredentials: true,
});

export default client;
