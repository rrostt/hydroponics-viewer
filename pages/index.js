import { useEffect, useState, useCallback } from 'react'
import styles from '../styles/Home.module.css'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
dayjs.extend(isBetween)
dayjs.extend(utc)

const imagesUrl = 'https://l05c34qtnh.execute-api.eu-north-1.amazonaws.com/dev/images'

const useImages = ({ from, to }) => {
  const [images, setImages] = useState([])

  useEffect(() => {
    fetch(`${imagesUrl}?from=${from}&to=${to}`)
      .then(response => response.json())
      .then(images => setImages(images))
  }, [])

  return images
}

const getHours = ({ from, to }) => {
  let start = dayjs(from).startOf('hour')
  const hours = []
  do {
    hours.push({ start, end: start.endOf('hour') })
    start = start.add(1, 'hour')
  } while (start.isBefore(dayjs(to)))
  return hours
}

const ImageRow = ({ start, end, images }) =>
  <div>
    {dayjs(start).format('HH')}
    {images.map(({ url }) => <img style={{ width: 120 }} src={url} />)}
  </div>

const Anim = ({ images }) => {
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(true)

  const nextFrame = useCallback(() => {
    if (images.length > 0) {
      setFrame(frame => (frame + 1) % images.length)
    }
  }, [images])

  const onChange = useCallback(e => {
    setPlaying(false)
    setFrame(e.target.value)
  }, [])

  const onClick = useCallback(e => {
    setPlaying(playing => !playing)
  })

  useEffect(() => {
    if (playing) {
      const interval = setInterval(nextFrame, 200)
      return () => clearInterval(interval)
    }
  }, [playing, images, nextFrame])

  return images.length > 0 && <div style={{ maxWidth: 800, width: '100%' }}>
    <div onClick={onClick}>
      <img style={{ maxHeight: 800, display: 'block', margin: '0 auto' }} src={images[frame % images.length].url} />
    </div>
    <div>{images[frame % images.length].time}</div>
    <input style={{ width: '100%' }} type='range' min={0} max={images.length - 1} value={frame} onChange={onChange} /><br />
    <div>
      {images.map(({ url }) => <img style={{ display: 'inline-block', width: `${100 / images.length}%`, height: 40 }} src={url} />)}
    </div>
  </div>
}

export default function Home() {
  const from = '2020-12-24' // dayjs.utc().startOf('day').subtract(2, 'day').format() // '2020-12-23'
  const to = dayjs.utc().endOf('day').format() // '2020-12-24'

  const images = useImages({ from, to })
  const hours = getHours({ from, to })
    .map(({ start, end }) => ({
      start,
      end,
      images: images.filter(({ time }) => dayjs(time).isBetween(start, end))
    }))

  return (
    <div className={styles.container}>
      <Anim images={images} />
      {/* { hours.map(({ start, images }) => <ImageRow start={start} images={images} />)} */}
    </div>
  )
}
