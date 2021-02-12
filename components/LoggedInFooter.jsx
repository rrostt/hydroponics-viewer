import { useContext, } from 'react'
import { useGoogleLogout, } from 'react-google-login'

import AuthContext from '../contexts/auth'

import styles from '../styles/footer.module.css'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID


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
  return  <div className={styles.logoutButton} onClick={signOut}>Logout</div>
}


const LoggedInFooter = () => {
  return <div className={styles.loggedInFooter}><SignOut /></div>
}

export default LoggedInFooter
