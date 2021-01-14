import { useEffect, useState, useCallback } from 'react'

import styles from '../styles/Home.module.css'

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
dayjs.extend(isBetween)
dayjs.extend(utc)

import Anim from '../components/Anim'
import useHash from '../hooks/useHash'

// eslint-disable-next-line no-undef
const imagesUrl = process.env.NEXT_PUBLIC_API_IMAGES
// eslint-disable-next-line no-undef
const latestUrl = process.env.NEXT_PUBLIC_API_LATEST

const useImages = ({ from, to, plantId }) => {
  const [images, setImages] = useState([])

  const fetchImages = useCallback(() =>
    fetch(`${imagesUrl}?from=${from}&to=${to}&plantId=${plantId || ''}`)
      .then(response => response.json())
      .then(images => setImages(images))
    , [from, to])

  useEffect(() => {
    fetchImages()
  }, [])

  useEffect(() => {
    const interval = setInterval(fetchImages, 1000 * 60 * 1) // every minute
    return () => clearInterval(interval)
  }, [fetchImages])

  return images
}


const Plant = ({ plantId }) => {
  const from = '2020-12-24' // dayjs.utc().startOf('day').subtract(2, 'day').format() // '2020-12-23'
  const to = dayjs.utc().endOf('day').format() // '2020-12-24'

  const [days, setDays] = useState(5)

  const images = useImages({ from, to, plantId: +plantId || '' })

  const showFrom = dayjs(to).subtract(days, 'day')
  const showTo = to
  const showImages = images.filter(({ time }) => dayjs(time).isBetween(showFrom, showTo))

  return (
    <div className={styles.container}>
      { showImages.length > 0 ? <Anim images={showImages} /> : null}
      <br />
      <br />
      <br />
      Show days {days}
      <input type="range" min="1" max="30" value={days} onChange={(e) => setDays(+e.target.value)} />
    </div>
  )
}

const PlantThumb = ({ plantId }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`${latestUrl}?plantId=${+plantId || ''}`)
      .then(response => response.json())
      .then(data => setData(data))
  }, [plantId])

  if (data === null) {
    return <div className={styles.plantThumb}>Loading</div>
  }

  const date = dayjs(data.time).format("YYYY-MM-DD")
  const time = dayjs(data.time).format("HH:mm")

  return <a href={`#${plantId}`}>
    <div className={styles.plantThumb} style={{ backgroundImage: `url(${data.url})` }}>
      {date}<br />{time}
    </div>
  </a>
}

const Home = () => {
  let plantId

  const hash = useHash()
  if (hash != '') plantId = hash
  console.log({ hash })

  if (plantId) {
    return <Plant plantId={plantId} />
  }

  console.log('listing plants')

  const plantIds = ['0', '4', '2']

  return <div className={styles.container}>
    {plantIds.map(plantId =>
      <PlantThumb key={`thumb_${plantId}`} plantId={plantId} />
    )}
  </div>
}

export default Home
