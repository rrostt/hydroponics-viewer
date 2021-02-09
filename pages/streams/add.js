import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import AuthContext from '../../contexts/auth'

import styles from '../../styles/AddStream.module.css'

import { registerStream } from '../../services/api'

const AddStream = () => {
  const router = useRouter()
  const { token } = useContext(AuthContext)

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const submit = async () => {
    await registerStream({ token, title, description: desc })
    router.back()
  }

  return <div className={styles.addStream}>
    <input placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
    <input placeholder='Description' value={desc} onChange={e => setDesc(e.target.value)} />
    <button onClick={submit}>Save</button>
  </div>
}

export default AddStream
