import React, { useContext } from 'react'
import Button from '@mui/material/Button';
import styles from './Header.module.css';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  
  const {logout} = useContext(AuthContext);

  const handleLogoutClick = () => {
    logout();
  }
  return (
    <div className={styles.header}>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDD8bpeqn9YzqaEQFJrOBYq6qYIRF7ELjeKN4QXZn1lw&s" alt="" />
        <Button variant="text" onClick={handleLogoutClick}>Log Out</Button>
    </div>
  )
}

export default Header