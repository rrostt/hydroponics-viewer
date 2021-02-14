import { useState, useEffect, useCallback, } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'

import Anim from './Anim'

import useAuthToken from '../hooks/useAuthToken'
import useStreamInfo from '../hooks/api/useStreamInfo'
import { fetchImages, } from '../services/api'

import {
  FaEdit,
  FaCloudUploadAlt,
} from 'react-icons/fa'
import NoImagesYet from './NoImagesYet'

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

  const days = 7

  const info = useStreamInfo({ streamId })
  const images = useImages({ from, to, streamId: streamId || '' })

  const showTo = dayjs(info?.latest?.time)
  const showFrom = dayjs(showTo).subtract(days, 'day')
  const showImages = images.filter(({ time }) => dayjs(time).isBetween(showFrom, showTo, null, '[]'))

  return <div className={styles.container}>
      <h1>
        { info?.title }
        <Link href={`/streams/edit?id=${streamId}`}><span className={styles.actionIcon}><FaEdit /></span></Link>
        <Link href={`/streams/upload?id=${streamId}`}><span className={styles.actionIcon}><FaCloudUploadAlt /></span></Link>
        
      </h1>      
      { showImages.length > 0 ? <Anim images={showImages} /> : null}
      { showImages.length == 0 && info?.owner && <NoImagesYet streamId={ streamId } />}
      <p>{ info && info.description }</p>
    </div>
}

export default Stream
