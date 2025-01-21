import axios from 'axios'

const baseURL = 'http://localhost:3000/api'

export const getMessages = (query) => {
  console.log('query', query)
  return axios.get(`${baseURL}/messages`, { params: query })
}
