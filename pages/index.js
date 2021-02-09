import { useContext, useState, } from 'react'

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
dayjs.extend(isBetween)
dayjs.extend(utc)

import { GoogleLogin, useGoogleLogout } from 'react-google-login'

import Dashboard from '../views/Dashboard'

import { fetchToken } from '../services/api'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

import AuthContext from '../contexts/auth'

const Home = () => {
  const { token, setToken } = useContext(AuthContext)
  const [ error, setError ] = useState(null)
  const { signOut } = useGoogleLogout({
    clientId: GOOGLE_CLIENT_ID,
    onLogoutSuccess: () => {
      setToken(null)
    },
  })
  const onSuccess = res => {
    console.log('logged in', res)
    fetchToken(res.tokenId)
      .then(token => {
        if (token.token) {
          console.log('got token', token.token)
          setToken(token.token)
        }
      })
  }

  const onFailure = res => {
    console.log('loggin failed', res)
    setError(res)
  }

  if (token) {
    return <>
      <Dashboard />
      <div onClick={signOut}>Logout</div>
    </>
  }

  if (error) {
    return <>Error {error}</>
  }

  return <GoogleLogin
    clientId={GOOGLE_CLIENT_ID}
    onSuccess={onSuccess}
    onFailed={onFailure}
    isSignedIn={true} />
}

export default Home
