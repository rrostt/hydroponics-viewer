import { useEffect, useState, useContext } from "react"
import Link from 'next/link'

import { fetchStreams, fetchFeatured } from '../services/api'

import StreamThumb from '../components/StreamThumb'
import AuthContext from '../contexts/auth'

const useStreams = () => {
  const [streams, setStreams] = useState(null)
  const { token } = useContext(AuthContext)

  useEffect(() => {
    fetchStreams({ token })
      .then(streams => {
        if (streams.error) {
          //
        } else {
          setStreams(streams)
        }
      })
  }, [])

  return streams
}

const useFeatured = () => {
  const [streams, setStreams] = useState(null)
  const { token } = useContext(AuthContext)

  useEffect(() => {
    fetchFeatured({ token })
      .then(streams => {
        if (streams.error) {
          //
        } else {
          setStreams(streams)
        }
      })
  }, [])

  return streams
}

const Dashboard = () => {
  const streams = useStreams()
  const featured = useFeatured()

  return <div>
    <h1>Hello</h1>
    <h2>Your streams</h2>
    { streams && streams.map(stream => <StreamThumb key={stream.id} stream={stream} />)}
    <Link href='/streams/add'>Add stream</Link>
    <h2>Featured streams</h2>
    { featured && featured.map(stream => <StreamThumb key={stream.id} stream={stream} />)}
  </div>
}

export default Dashboard
