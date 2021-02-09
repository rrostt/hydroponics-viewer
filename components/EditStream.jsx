import { useState, useCallback, useEffect, } from 'react'
import useAuthToken from '../hooks/useAuthToken'
import { fetchStreamInfo, updateStream } from '../services/api'

const useStreamInfo = ({ streamId }) => {
  const token = useAuthToken()
  const [info, setInfo] = useState(null)
  useEffect(() => {
    fetchStreamInfo({ token, streamId })
      .then(info => setInfo(info))
  }, [streamId])
  return info
}

const Form = ({ title, description, onSave }) => {
  const [titleValue, setTitle] = useState(title)
  const [descValue, setDesc] = useState(description)

  const submit = useCallback(() => {
    console.log('submit')
    onSave({ title: titleValue, description: descValue })
  }, [titleValue, descValue])

  return <form onSubmit={e => e.preventDefault()}>
    Title <input value={titleValue} onChange={e => setTitle(e.target.value)} />
    Description <input value={descValue} onChange={e => setDesc(e.target.value)} />

    <button onClick={submit}>Save</button>
  </form>
}

const EditStream = ({ streamId }) => {
  const token = useAuthToken()
  const info = useStreamInfo({ streamId })
  const [saving, setSaving] = useState(false)

  const save = async ({ title, description }) => {
    setSaving(true)
    try {
      await updateStream({ token, streamId, title, description })
      window.history.back()
    } catch (e) { //
      console.log(e)
    }
    setSaving(false)
  }

  return <>
    {info && <Form {...info} onSave={save} />}
    {saving ? 'Saving...' : null}
  </>
}

export default EditStream
