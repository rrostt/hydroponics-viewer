import { useContext, useEffect, useState, useCallback } from 'react'

import styles from '../styles/Home.module.css'

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
dayjs.extend(isBetween)
dayjs.extend(utc)

import { GoogleLogin, GoogleLogout } from 'react-google-login'

import Dashboard from '../views/Dashboard'

// import Plant from '../components/Stream'
// import PlantThumb from '../components/PlantThumb'
// import useHash from '../hooks/useHash'

import { fetchToken } from '../services/api'

const GOOGLE_CLIENT_ID = `804478743579-a5999sgljs52e98i57p1i7u2v889nt8b.apps.googleusercontent.com`

// eslint-disable-next-line no-undef

// const PlantList = () => {
//   let plantId

//   const hash = useHash()
//   if (hash != '') plantId = hash
//   console.log({ hash })

//   if (plantId) {
//     return <Plant plantId={plantId} />
//   }

//   console.log('listing plants')

//   const plantIds = ['0', '4', '2']

//   return <div className={styles.container}>
//     {plantIds.map(plantId =>
//       <PlantThumb key={`thumb_${plantId}`} plantId={plantId} />
//     )}
//   </div>
// }

import AuthContext from '../contexts/auth'

const Home = () => {
  const { token, setToken } = useContext(AuthContext)

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
  }

  // const onLogout = () => {
  //   setToken(null)
  // }

  if (token) {
    return <Dashboard />
  }

  return <GoogleLogin
    clientId={GOOGLE_CLIENT_ID}
    buttonText="Login"
    onSuccess={onSuccess}
    onFailed={onFailure}
    isSignedIn={true} />
}

export default Home
