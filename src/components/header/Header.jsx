import React from 'react'
import Logo from '../../assets/logo.png'
import styles from './Header.module.css'

function Header({HeaderButtonOnClick,HeaderButtonText}){
    return(
    <div className={styles.container}>
        
          <img className={styles.image} src={Logo} alt=""/>
           <button onClick={HeaderButtonOnClick} className={styles.button}>{HeaderButtonText}</button>
        
    </div>
    )
}
export default Header