import axios from "axios";

const Api = axios.create({
    baseURL: 'http://localhost:8081/api',
    // timeout: 1000,
    // headers: { 'X-Custom-Header': 'foobar' }
    headers: {
        'Content-Type': 'application/json',
    },
});
Api.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
});
export default Api;