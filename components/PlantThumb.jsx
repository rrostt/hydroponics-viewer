import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

import dayjs from 'dayjs'

const latestUrl = process.env.NEXT_PUBLIC_API_LATEST

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

  export default PlantThumb
