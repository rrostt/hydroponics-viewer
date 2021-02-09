import { useState, useEffect, useCallback, } from 'react'
import dayjs from 'dayjs'

import Anim from './Anim'

import useAuthToken from '../hooks/useAuthToken'
import useStreamInfo from '../hooks/api/useStreamInfo'
import { fetchImages, } from '../services/api'

import styles from '../styles/Home.module.css'

const useImages = ({ from, to, streamId }) => {
  const token = useAuthToken()
  const [images, setImages] = useState([])

  const doFetchImages = useCallback(() =>
    fetchImages({ token, streamId, from, to })
      .then(images => setImages(images))
    , [from, to, streamId])

  useEffect(() => {
    doFetchImages()
  }, [streamId])

  useEffect(() => {
    const interval = setInterval(doFetchImages, 1000 * 60 * 1) // every minute
    return () => clearInterval(interval)
  }, [streamId, doFetchImages])

  return images
}

const Stream = ({ streamId }) => {
  const from = '2020-12-24' // dayjs.utc().startOf('day').subtract(2, 'day').format() // '2020-12-23'
  const to = dayjs.utc().endOf('day').format() // '2020-12-24'

  const [days, setDays] = useState(5)

  const info = useStreamInfo({ streamId })
  const images = useImages({ from, to, streamId: streamId || '' })

  const showFrom = dayjs(to).subtract(days, 'day')
  const showTo = to
  const showImages = images.filter(({ time }) => dayjs(time).isBetween(showFrom, showTo))

  return <div className={styles.container}>
      <h1>{ info && info.title }</h1>
      { info && info.owner && <div style={{ paddingBottom: 20 }}><a href={`/stream/edit?id=${streamId}`}>edit</a></div>}
      { showImages.length > 0 ? <Anim images={showImages} /> : null}
      <p>{ info && info.description }</p>
      <br />
      <br />
      <br />
      Show days {days}
      <input type="range" min="1" max="30" value={days} onChange={(e) => setDays(+e.target.value)} />
    </div>
}

export default Stream
