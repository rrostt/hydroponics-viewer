const API_BASE = process.env.NEXT_PUBLIC_API
const STREAMS_URL = `${API_BASE}/streams`
const FEATURED_URL = `${API_BASE}/featured`
const REGISTER_STREAM_URL = `${API_BASE}/streams`
const GET_TOKEN = `${API_BASE}/token`
const GET_IMAGES = (streamId, from, to) => `${API_BASE}/streams/${streamId}/images?from=${from}&to=${to}`
const STREAM_INFO_URL = streamId => `${API_BASE}/streams/${streamId}`

export const fetchStreams = ({ token }) =>
  fetch(
    STREAMS_URL,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
    .then(response => response.json())

export const fetchStreamInfo = ({ token, streamId }) =>
  fetch(
    STREAM_INFO_URL(streamId),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => response.json())

export const fetchFeatured = ({ token }) =>
  fetch(
    FEATURED_URL,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
    .then(response => response.json())

export const registerStream = ({ token, title, description }) =>
  fetch(
    REGISTER_STREAM_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description
      })
    })

export const fetchToken = tokenId =>
  fetch(
    GET_TOKEN,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tokenId })
    }
  )
  .then(response => response.json())

export const fetchImages = ({ token, streamId, from, to }) =>
  console.log('fetch', GET_IMAGES(streamId)) || fetch(
    GET_IMAGES(streamId, from, to),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  )
  .then(response => response.json())
