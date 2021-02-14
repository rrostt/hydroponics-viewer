import { useState } from 'react'

import useAuthToken from '../../hooks/useAuthToken'

import { fetchUploadUrl } from '../../services/api'

const getSearchParam = name => {
  if (typeof window === 'undefined') {
    return null
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name)
}

const UploadPage = () => {
  const token = useAuthToken()
  const streamId = getSearchParam('id')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  const onFilePicked = async e => {
    const file = e.target.files[0]

    console.log(file)

    setLoading(true)

    const uploadUrl = await fetchUploadUrl({ token, streamId, fileType: `.${file.type.split('/').slice(-1)}` })

    const uploadBuffer = (buffer) => {
      fetch(uploadUrl.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: buffer
      }).then(response => {
        console.log(response)
        setImageUrl(uploadUrl.downloadUrl)
      }).catch(e => {
        console.log(e)
      }).finally(() => setLoading(false))
    }

    const reader = new FileReader()
    reader.onload = () => {
      console.log(reader.result)
      uploadBuffer(reader.result)
    }
    reader.readAsArrayBuffer(file)
  }

  return <div>
    Pick file.
    <input type="file" accept="image/*" capture="camera" onChange={onFilePicked} />
    {loading && 'Loading...'}
    {imageUrl && <img src={imageUrl} />}
  </div>
}

export default UploadPage
