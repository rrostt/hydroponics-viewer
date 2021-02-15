import { useState, useCallback, useEffect, } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import useAuthToken from '../hooks/useAuthToken'
import { fetchStreamInfo, updateStream } from '../services/api'

import { FaChevronLeft } from 'react-icons/fa'
import styles from '../styles/EditStream.module.css'

const useStreamInfo = ({ streamId }) => {
  const token = useAuthToken()
  const [info, setInfo] = useState(null)
  useEffect(() => {
    fetchStreamInfo({ token, streamId })
      .then(info => setInfo(info))
  }, [streamId])
  return info
}

const Form = ({ title, description, onSave, saving }) => {
  const [titleValue, setTitle] = useState(title)
  const [descValue, setDesc] = useState(description)

  const submit = useCallback(() => {
    onSave({ title: titleValue, description: descValue })
  }, [titleValue, descValue])

  return <form onSubmit={e => e.preventDefault()}>
    <input value={titleValue} onChange={e => setTitle(e.target.value)} />
    <textarea value={descValue} onChange={e => setDesc(e.target.value)} />

    <button onClick={submit} disabled={saving}>Save</button>{ saving && '...'}
  </form>
}

const EditStream = ({ streamId }) => {
  const router = useRouter()
  const token = useAuthToken()
  const info = useStreamInfo({ streamId })
  const [saving, setSaving] = useState(false)

  const save = async ({ title, description }) => {
    setSaving(true)
    try {
      await updateStream({ token, streamId, title, description })
      router.back()
    } catch (e) { //
      console.log(e)
    }
    setSaving(false)
  }

  return <div className={styles.editStream}>
    <Link href={`/stream?id=${streamId}`}><div style={{ marginTop: 30 }}><FaChevronLeft />Back to stream</div></Link>
    <h1>Edit stream</h1>
    {info && <Form {...info} onSave={save} saving={saving} />}
    <div className={styles.bottom}>
      <img src='/undraw_Reviewed_docs.svg' />
    </div>
  </div>
}

export default EditStream
