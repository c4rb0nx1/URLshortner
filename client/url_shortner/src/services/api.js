import axios from 'axios';
import {jwtDecode} from 'jwt-decode'

const API_URL = 'http://localhost:9999/shortner';

// Create an Axios instance with the correct configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const register = async (name, email, password) => {
  try {
    const response = await axiosInstance.post('/newuser', { name, email, password });
    if (response.data.statusCode === 400) {
      throw new Error(response.data.name);
    }
    return response.data;
  } catch (err) {
    throw new Error('Failed to validate, check input constraints');
  }
};

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth', { email, password });
    console.log(response.data)
    if (response.data) {
      localStorage.setItem('isLoggedIn', 'true');
      return true; // Indicate successful login
    } else {
      throw new Error('Login failed');
    }
  } catch (err) {
    console.error('Login error:', err);
    throw new Error('Failed to login, check credentials');
  }
}

export const shortenUrl = async (userID, parentUrl, customAlias) => {
  try {
    const response = await axiosInstance.post('/shorten', { userID, parentUrl, customAlias });
    console.log(response.data);
    return response.data;
  } catch (err) {
    throw new Error('Failed to shorten URL');
  }
};

export const getUserUrls = async (userID) => {
  try {
    const response = await axiosInstance.get(`/urls?id=${userID}`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch URLs');
  }
};