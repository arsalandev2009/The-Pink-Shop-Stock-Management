import React, { useEffect, useState } from 'react'
import style from './LandingPage.module.css'
import { FiLogOut, FiShoppingBag } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../../../asset/logo.png'
import { supabase } from '../../../../utils/supabase'
import { FaCartPlus } from 'react-icons/fa'

function LandingPage() {

  const [products , setProducts] =useState([])

  const navigate = useNavigate()


    useEffect(()=>{
      async function getProducts(){
        const {data,error} = await supabase.from('productCosmetics').select('*')
        if(!error){
          setProducts(data)
          return
        }
        console.log('server Error' + error)
      }
      getProducts()
    },[])
    console.log(products)
    
    const handleLogout =async()=>{
      const {data,error}=await supabase.auth.signOut()
      if(error){
        alert(error.message)
      return
      }else{
      navigate('/')
      }
    }
  return (
    <>
      <div className={style.header}>
        <p> <img src={Logo} alt="The Pink Shop" width={60} /></p>
        <div className={style.headermid}>
          <Link to={'/userallproducts'}>All Products</Link>
          <a href='#contactus'>Contact Us</a>
        </div>
        <button onClick={handleLogout} type='button'><FiLogOut/> Logout</button>
      </div>
      <div className={style.container}>
        <h2>Featured Products</h2>
        <div className={style.productcontainer}>
          {products.map((item,index)=>(
            [22,112,15,32].includes(Number(item.productcode)) &&(
              <div className={style.products}  key={index}>

                <img className={style.image} src={item.image} alt={item.name} width={50}/>
                <p className={style.name}>{item?.name}</p>
                <p className={style.description}>{item?.description}</p>
                <p className={style.price}>{item?.price}</p>
                <p className={style.originalprice}>{item?.originalprice}</p>
                <p className={style.discountprice}><del>{item?.discount == 0 ? '':item?.discountprice}</del></p>
                <p className={style.discount}>{item?.discount == 0 ? '':item?.discount}%Off</p>
                <button className={style.addtocart} type='button'><FaCartPlus/></button>
                <div className={style.buynow}><button type='button'> <FiShoppingBag/> Buy Now</button></div>
              </div>
            )
          ))}
        </div>
      </div>
      <section className={style.footer} id='contactus'>
        footer
      </section>
    </>
  )
}

export default LandingPage