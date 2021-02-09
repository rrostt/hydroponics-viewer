import { useEffect, useState, useContext } from "react"
import Link from 'next/link'

import { fetchStreams } from '../services/api'

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

const Dashboard = () => {
  const streams = useStreams()

  return <div>
      <h1>Hello</h1>
      <h2>Your streams</h2>
      { streams && streams.map(stream => <StreamThumb key={stream.id} stream={stream} />)}
      <Link href='/streams/add'>Add stream</Link>
  </div>
}

export default Dashboard
