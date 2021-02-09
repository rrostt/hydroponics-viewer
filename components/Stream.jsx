import { useState, useEffect, useCallback, } from 'react'
import dayjs from 'dayjs'

import Anim from './Anim'

import useAuthToken from '../hooks/useAuthToken'
import { fetchImages } from '../services/api'

import styles from '../styles/Home.module.css'

// eslint-disable-next-line no-undef

const useImages = ({ from, to, streamId }) => {
  const token = useAuthToken()
  const [images, setImages] = useState([])

  console.log('useimages', streamId)

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

  const images = useImages({ from, to, streamId: streamId || '' })

  const showFrom = dayjs(to).subtract(days, 'day')
  const showTo = to
  const showImages = images.filter(({ time }) => dayjs(time).isBetween(showFrom, showTo))

  return <div className={styles.container}>
      { showImages.length > 0 ? <Anim images={showImages} /> : null}
      <br />
      <br />
      <br />
      Show days {days}
      <input type="range" min="1" max="30" value={days} onChange={(e) => setDays(+e.target.value)} />
    </div>
}

export default Stream
