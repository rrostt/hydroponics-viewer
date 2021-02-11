import { useContext, useState, } from 'react'

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
dayjs.extend(isBetween)
dayjs.extend(utc)

import styles from '../styles/Home.module.css'

import { useGoogleLogout, useGoogleLogin } from 'react-google-login'

import Dashboard from '../views/Dashboard'

import { fetchToken } from '../services/api'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

import AuthContext from '../contexts/auth'

const SignIn = () => {
  const { setToken } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [ error, setError ] = useState(null)
  const onSuccess = res => {
    setLoading(true)
    res.disconnect()
    fetchToken(res.tokenId)
      .then(token => {
        if (token.token) {
          setToken(token.token)
        }
      })
      .catch(() => {})
      .then(() => setLoading(false))
  }

  const onFailure = res => {
    console.log('loggin failed', res)
    setError(res)
  }

  const { signIn } = useGoogleLogin({
    clientId: GOOGLE_CLIENT_ID,
    onSuccess,
    onFailure,
  })

  if (error) {
    return <>Error {error}</>
  }

  return <div className={styles.loginPage}>
    <button onClick={signIn} disabled={loading}>Sign in with Google</button>
  </div>
}

const SignOut = () => {
  const { setToken } = useContext(AuthContext)
  const { signOut } = useGoogleLogout({
    clientId: GOOGLE_CLIENT_ID,
    onLogoutSuccess: (x) => {
      console.log(x)
      setToken(null)
    },
    onFailure: (e) => console.log('failure', e),
  })
  return  <div onClick={signOut}>Logout</div>
}

const LoggedIn = () => {
  return <div className={styles.homeIndex}>
    <Dashboard />
    <SignOut />
  </div>
}

const LoggedOut = () => {
  return <div className={styles.homeIndex}><SignIn /></div>
}

const Home = () => {
  const { token } = useContext(AuthContext)

  if (token) {
    return <LoggedIn />
  } else {
    return <LoggedOut />
  }
}

export default Home
