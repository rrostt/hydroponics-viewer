import { useState, useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import styles from '../styles/Home.module.css'

const Anim = ({ images }) => {
  const [frame, setFrame] = useState(images.length - 1)
  const [playing, setPlaying] = useState(true)

  const nextFrame = useCallback(() => {
    if (images.length > 0) {
      setFrame(frame => {
        const newFrame = (frame + 1)
        if (newFrame >= images.length) {
          setPlaying(false)
          return frame
        }
        return newFrame
      })
    }
  }, [images, setFrame, playing])

  const onChange = useCallback(e => {
    setPlaying(false)
    setFrame(+e.target.value)
  }, [setPlaying, setFrame])

  const onClick = useCallback(() => {
    if (playing == false && frame == images.length - 1) {
      setFrame(0)
    }
    setPlaying(playing => !playing)
  }, [playing, setPlaying, frame, images])

  useEffect(() => {
    if (playing) {
      const interval = setInterval(nextFrame, 50)
      return () => clearInterval(interval)
    }
  }, [playing, nextFrame])

  // always show last frame as new images appear
  useEffect(() => {
    if (!playing && frame == images.length - 2) {
      setFrame(images.length - 1)
    }
  }, [playing, frame, images])

  if (images.length == 0) {
    return <div>Loading...</div>
  }

  return <div>
    <div onClick={onClick} style={{ position: 'relative' }}>
      <img className={styles.frameImage} src={images[frame % images.length].url} />
      <div className={styles.datestamp}><div className={styles.datestampContent}>{dayjs(images[frame % images.length].time).format('YYYY-MM-DD HH:mm')}</div></div>
      <div className={styles.controlbar}>
        <div className={styles.sliderContainer}>
          <div className={styles.sliderContainerInner}>
            {images.filter((_, i) => i % 3 === 0).map(({ url }) => <img key={`sliderimg-${url}`} className={styles.sliderThumbnail} style={{ width: `${100 / Math.ceil(images.length / 3)}%` }} src={url} />)}
            <input className={styles.slider} type='range' min={0} max={images.length - 1} value={frame} onChange={onChange} /><br />
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default Anim
