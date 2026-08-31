import React from 'react'
import { FaSearch } from 'react-icons/fa'
import style from './SearchBar.module.css'

function SearchBar({SearchValue,SearchOnChange}) {
  return (
    <div className={style.container}>
         <FaSearch color='pink' size={20}/> 
         <input className={style.input} type="text" name='search' value={SearchValue} onChange={SearchOnChange} placeholder="Search Your Product..." /> 
    </div>
  )
}

export default SearchBar