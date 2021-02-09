import { useState } from 'react'
import { useRouter } from 'next/router'
import useAuthToken from '../../hooks/useAuthToken'

import styles from '../../styles/AddStream.module.css'

import { registerStream } from '../../services/api'

const AddStreamPage = () => {
  const router = useRouter()
  const token = useAuthToken()

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const submit = async () => {
    await registerStream({ token, title, description: desc })
    router.back()
  }

  return <div className={styles.addStream}>
    <h1>Add stream</h1>
    <p>Excellent, you are about to start streaming something slowly.</p>
    <p>
      A stream is a series of images, typically spaced out over a significant period of time.
    </p>
    <input placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
    <textarea placeholder='Description' value={desc} onChange={e => setDesc(e.target.value)} />
    <button onClick={submit}>Save</button>
    <div className={styles.bottom}><img src='/undraw_videographer.svg' /></div>
  </div>
}

export default AddStreamPage
