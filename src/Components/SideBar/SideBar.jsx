/* eslint-disable no-unused-vars */
import React from 'react'
import styles from './SideBar.module.css'
import Button from '@mui/material/Button';
import { Link } from '@mui/material';

const SideBar = () => {
  return (
    <div className={styles.sidebar}>
        <Button>Öğrenciler</Button>
        <Button>Gruplar</Button>
        <Button>Anketler</Button>
        <Link href="/survey-index"  underline="none" >Anket İşlemleri</Link>
        <Link href="/question-index"  underline="none" >Soru İşlemleri</Link>
    </div>
  )
}

export default SideBar;
