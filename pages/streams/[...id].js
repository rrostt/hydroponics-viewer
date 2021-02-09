import { useRouter } from 'next/router'

import Stream from '../../components/Stream'

const StreamPage = () => {
  const router = useRouter()
  const { id } = router.query

  console.log({id })

  return <Stream streamId={id && id[0]} />
}

export default StreamPage
