import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../../utils/supabase'
import { Header, SearchBar } from '../../../../components/component'
import style from './Extra.module.css'

function Extra() {

  
  const navigate=useNavigate()

  const [getProducts,setGetProducts]=useState([])

  useEffect(()=>{
    const fetchProducts=async()=>{
      const {data,error}=await supabase.from('productCosmetics').select().order("productcode", { ascending: true })
      if(error){
        alert('Error Plz Contact The Developer')
        return
      }
      setGetProducts(data)
    }
    fetchProducts()

  },[])



  const [searchInput,setSearchInput]=useState('')
  const [filtered,setFiltered]=useState([])

  const handleSearch=(e)=>{
    const search = e.target.value
    setSearchInput(search)
    const result = getProducts.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) ||String(item.productcode).toLowerCase().includes(search.toLowerCase()));
    setFiltered(result)
  }

  return (
    <div className={style.container}>
      <div className={style.header}><Header HeaderButtonText='Login' HeaderButtonOnClick={()=>{navigate('/login')}} /></div>
      <div className={style.searchbar}><SearchBar SearchValue={searchInput} SearchOnChange={handleSearch}/></div>
      
      <div className={style.maincontent}>
        {searchInput == ''?(
            getProducts.map((item)=>(
              <div key={item.id} className={style.productcontainer}>
               <div className={style.productupper}>
                <img src={item.image} alt={item.name} className={style.image}/>
                <p> {item.discount != 0 ? <p className={style.productstock} style={{backgroundColor:item.stockquantity>0?'#ff1493':'#9f1239'}}>{item.discount}% Off</p> : '' } </p>
               </div>
               <div className={style.productlower}>
                 <p className={style.productname}> {item.name} </p>
                 <p className={style.productprice}><span>Rs:<b> {item.discountprice}</b></span> <del>Rs: {item.originalprice}</del></p>
               </div>
             </div>
            ))):filtered.length>0?(
              filtered.map(item=>
               <div key={item.id} className={style.productcontainer}>
                 <div className={style.productupper}>
                    <img src={item.image} alt={item.name} className={style.image}/>
                    <p> {item.discount != 0 ? <p className={style.productstock} style={{backgroundColor:item.stockquantity>0?'#ff1493':'#9f1239'}}>{item.discount}% Off</p> : '' } </p>
                 </div>
                 <div className={style.productlower}>
                   <p className={style.productname}> {item.name} </p>
                   <p className={style.productprice}>Rs: <b>{item.discountprice}</b> </p>
                 </div>
                </div>
              )):(
              <h5>No Products Found</h5>
              )}

        
      </div>
    </div>
    
  )
}

export default Extra
