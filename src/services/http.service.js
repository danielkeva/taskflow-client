import Axios from 'axios'

var axios = Axios.create({
  withCredentials: true
})

export default {
  get(endpoint, data) {
    return ajax(endpoint, 'GET', data)
  },
  post(endpoint, data) {
    return ajax(endpoint, 'POST', data)
  },
  put(endpoint, data) {
    return ajax(endpoint, 'PUT', data)
  },
  delete(endpoint, data) {
    return ajax(endpoint, 'DELETE', data)
  }
}

async function ajax(endpoint, method = 'get', data = null) {
  try {
    const res = await axios({
      url: `${process.env.REACT_APP_SERVER_URL}${endpoint}`,
      method,
      data
    })
    return res.data
  } catch (err) {
    throw err
  }
}
