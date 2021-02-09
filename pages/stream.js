import Stream from '../components/Stream'

const StreamPage = ({ query }) => {
  const { id } = query

  console.log({id })

  return <Stream streamId={id} />
}

StreamPage.getInitialProps = ({query}) => ({ query })

export default StreamPage
