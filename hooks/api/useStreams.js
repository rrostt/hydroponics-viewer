import { useState, useEffect, } from 'react'
import useAuthToken from '../useAuthToken'

import { fetchStreams } from '../../services/api'

const useStreams = () => {
  const [streams, setStreams] = useState(null)
  const token = useAuthToken()

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

export default useStreams
