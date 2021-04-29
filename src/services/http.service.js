import Axios from 'axios';
const { REACT_APP_SERVER_URL = 'http://localhost:3030/' } = process.env;

var axios = Axios.create({
    withCredentials: true,
});

export default {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data);
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data);
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data);
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data);
    },
};

async function ajax(endpoint, method = 'get', data = null) {
    try {
        const res = await axios({
            url: `${REACT_APP_SERVER_URL}${endpoint}`,
            method,
            data,
        });
        return res.data;
    } catch (err) {
        throw err;
    }
}
