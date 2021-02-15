import Link from 'next/link'

import styles from '../styles/Header.module.css'

const Header = () => {
  return <div className={styles.header}>
    <div className={styles.headerContent}>
      <Link href="/">SlowTok</Link>
    </div>
  </div>
}

export default Header
