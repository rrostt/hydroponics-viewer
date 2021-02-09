import Stream from '../components/Stream'

const getSearchParam = name => {
  if (typeof window === 'undefined') {
    return null
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name)
}

const StreamPage = ({ query }) => {
  // const { id } = query
  const id = getSearchParam('id') || query.id

  console.log({id })

  return <Stream streamId={id} />
}

StreamPage.getInitialProps = ({query}) => ({ query })

export default StreamPage
