import URLSearchParams from '@ungap/url-search-params'
import axios from 'axios'

// 개발 서버 설정해놓고 커밋에 올리지 말라고 해놓음
import serverURL from '../constants/Server'

let axiosInstance = axios
applyInterceptors()

function errorResponseHandler(error) {
  // check for errorHandle config
  let additionalData = {}

  if (error.response) {
    const { data, status } = error.response
    additionalData = { data, status }
  }

  return { data: Object.assign({ error: true }, { message: additionalData }) }
}

function applyInterceptors() {
  // apply interceptor on response
  axiosInstance.interceptors.response.use(
    response => response,
    errorResponseHandler
  )
}

export function setAppToken(token) {
  axiosInstance = axios.create({
    headers: {
      Authorization: `JWT ${token}`,
    },
  })
  applyInterceptors()
}

export function requestAuthentication(ssoToken, pushToken) {
  return axios
    .post(
      `${serverURL}/authenticate`,
      {
        expotoken: pushToken,
      },
      { headers: { Authorization: `Bearer ${ssoToken}` } }
    )
    .then(response => {
      return response.data
    })
}

export function requestLogout() {
  return axiosInstance
    .post(`${serverURL}/logout`)
    .then(response => response.data)
}

export function updatePushToken(expotoken) {
  return axiosInstance
    .post(`${serverURL}/updatePushToken`, {
      expotoken,
    })
    .then(response => response.data)
}

export function changeMode(value) {
  return axiosInstance
    .post(`${serverURL}/modechange`, { isTraining: value })
    .then(response => response.data)
}

export function getProfile() {
  return axiosInstance.get(`${serverURL}/profile`).then(response => {
    const result = response.data

    if (result.error) {
      return result
    }
    if (!result.id) {
      return {
        error: true,
        message: result,
      }
    }

    return result
  })
}

function getQueryString(q) {
  return new URLSearchParams(q).toString()
}

export function listIncidents(query) {
  return axiosInstance
    .get(`${serverURL}/incidents?${getQueryString(query)}`)
    .then(response => response.data)
}

export function postIncident({ type, lat, lng, building, isTraining }) {
  return axiosInstance
    .post(`${serverURL}/incidents`, { type, lat, lng, building, isTraining })
    .then(response => response.data)
}

export function getIncidentComments(incidentId, query) {
  let queryString = ''

  if (query) {
    queryString = `&${getQueryString(query)}`
  }

  return axiosInstance.get(
    `${serverURL}/incidents/${incidentId}/comments${queryString}`
  )
}

export function postComment(incidentId, body) {
  return axiosInstance.post(
    `${serverURL}/incidents/${incidentId}/comments`,
    body
  )
}

export function postReply(commentId, body) {
  return axiosInstance.post(`${serverURL}/comments/${commentId}/reply`, body)
}

export function getRecentProgress(incidentId) {
  return axiosInstance.get(`${serverURL}/incidents/${incidentId}/progresses`)
}

export function getProgressList(incidentId) {
  return axiosInstance.get(`${serverURL}/incidents/${incidentId}/progresses`)
}

export function postProgress(incidentId, body) {
  return axiosInstance.post(
    `${serverURL}/incidents/${incidentId}/progresses`,
    body
  )
}

export function postLike(commentId) {
  return axiosInstance.post(`${serverURL}/comments/${commentId}/like`)
}

export function postUnlike(commentId) {
  return axiosInstance.post(`${serverURL}/comments/${commentId}/unlike`)
}

export function getIncidentState(incidentId) {
  return axiosInstance.get(`${serverURL}/incidents/${incidentId}`)
}

export function postIncidentState(incidentId, body) {
  return axiosInstance.post(`${serverURL}/incidents/${incidentId}`, body)
}

export function deleteIncident(incidentId) {
  return axiosInstance.post(`${serverURL}/incidents/${incidentId}/delete`)
}
