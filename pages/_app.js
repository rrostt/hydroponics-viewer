import AuthContext from '../contexts/auth'
import useLocalStorage from '../hooks/useLocalStorage'

// setup dayjs
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
dayjs.extend(isBetween)
dayjs.extend(utc)

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [token, setToken] = useLocalStorage('token', null)

  const auth = {
    token,
    setToken,
  }

  return <AuthContext.Provider value={auth}>
    <Component {...pageProps} />
  </AuthContext.Provider>
}

export default MyApp
