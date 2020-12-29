import { useEffect, useState, useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'

import styles from '../styles/Home.module.css'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
dayjs.extend(isBetween)
dayjs.extend(utc)

const imagesUrl = process.env.NEXT_PUBLIC_API_IMAGES

const useImages = ({ from, to }) => {
  const [images, setImages] = useState([])

  useEffect(() => {
    fetch(`${imagesUrl}?from=${from}&to=${to}`)
      .then(response => response.json())
      .then(images => setImages(images))
  }, [])

  return images
}

const Anim = ({ images }) => {
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(true)

  const nextFrame = useCallback(() => {
    if (images.length > 0) {
      setFrame(frame => (frame + 1) % images.length)
    }
  }, [images, setFrame, playing])

  const onChange = useCallback(e => {
    setPlaying(false)
    setFrame(+e.target.value)
  }, [setPlaying, setFrame])

  const onClick = useCallback(e => {
    setPlaying(playing => !playing)
  }, [setPlaying])

  useEffect(() => {
    if (playing) {
      const interval = setInterval(nextFrame, 50)
      return () => clearInterval(interval)
    }
  }, [playing, nextFrame])

  if (images.length == 0) {
    return <div>Loading...</div>
  }

  return <div>
    <div onClick={onClick} style={{ position: 'relative' }}>
      <img className={styles.frameImage} src={images[frame % images.length].url} />
      <div className={styles.datestamp}><div className={styles.datestampContent}>{dayjs(images[frame % images.length].time).format('YYYY-MM-DD HH:mm')}</div></div>
      <div className={styles.playbutton} style={{
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'stretch'
      }}>
        <div className={styles.sliderContainer}>
          <div className={styles.sliderContainerInner}>
            {images.filter((_, i) => i % 3 === 0).map(({ url }) => <img className={styles.sliderThumbnail} style={{ width: `${100 / Math.ceil(images.length / 3)}%` }} src={url} />)}
            <input className={styles.slider} type='range' min={0} max={images.length - 1} value={frame} onChange={onChange} /><br />
          </div>
        </div>

      </div>
    </div>
  </div>
}

export default function Home() {
  const from = '2020-12-24' // dayjs.utc().startOf('day').subtract(2, 'day').format() // '2020-12-23'
  const to = dayjs.utc().endOf('day').format() // '2020-12-24'

  const [days, setDays] = useState(5)

  const images = useImages({ from, to })
  const showImages = images.filter(({ time }) => dayjs(time).isBetween(dayjs(to).subtract(days, 'day'), to))

  return (
    <div className={styles.container}>
      <Anim images={showImages} />
      <br />
      <br />
      <br />
      Show days {days}
      <input type="range" min="1" max="10" value={days} onChange={(e) => setDays(+e.target.value)} />
    </div>
  )
}
