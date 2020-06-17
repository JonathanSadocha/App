import axios from 'axios';
import { key } from './key';

const mapServer = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
});

mapServer.interceptors.request.use(
  async (config) => {
    // called when request is made.
    config.headers.Accept = 'application/json';
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (err) => {
    // called when error
    return Promise.reject(err);
  }
);

export const getLocation = async ( lat, lon, callback) => {
  const response = await mapServer.get(
    `?appid=${key}&lat=${lat}&lon=${lon}&units=imperial`
  )
  callback(response.data);
};

export default mapServer;