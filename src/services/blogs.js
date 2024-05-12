import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'


const config = () => {
  return {
    headers: {
      Authorization: localStorage.getItem('loggedBlogappUser')
        ? `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
        : null
    }
  }
}

export const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

export const create = async (newObject) => {
  const request = await axios.post(baseUrl, newObject, config())
  return request.data
}

export const update = async (newObject) => {
  const request = await axios.put(`${baseUrl}/${newObject.id}`, newObject, config())
  return request.data
}

export const remove = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, config())
}

export default { getAll, create, update, remove }