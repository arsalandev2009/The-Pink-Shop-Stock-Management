import React, { Fragment, useEffect, useState } from 'react'
import style from './AdminCustomers.module.css'
import { FiLogOut } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { supabase } from '../../../../utils/supabase';
import { useNavigate } from 'react-router-dom';

function AdminCustomers() {

  const navigate = useNavigate()


  const [refresh,setRefresh]=useState(false)
  const [searchInput,setSearchInput]=useState('')
  const [getCustomersFromSupabase,setGetCustomersFromSupabase]=useState([])
  const [menu,setMenu] =useState(null)
  const [addCustomerPopup,setAddCustomerPopup]=useState(false)
  const [addCustomerForm,setAddCustomerForm]=useState({name:'',email:'',phonenumber:'',address:"",shoppingdate:''})
  const [editCustomerData, setEditCustomerData] = useState({  name: "", email: "",phonenumber:'',address:'',shoppingdate:'' });
  const [updateCustomerPopup, setUpdateCustomerPopup] = useState(false);
  const [deleteCustomerPopup, setDeleteCustomerPopup] = useState(false);
  const [filteredResult,setFilteredResult]=useState([])

    useEffect(()=>{
      const getCustomers =async()=>{
        const {data,error}=await supabase.from('customers').select().order('name',{ascending:true});
        if(!error){
          setGetCustomersFromSupabase(data)
        }
      }
      getCustomers()
    },[refresh])

    const handleAddCustomerDone=async(e)=>{
        e.preventDefault()
        if(getCustomersFromSupabase.some(item => item.phonenumber == addCustomerForm.phonenumber)){
          alert('Customer already Exist')
          return;
        }
        const {data,error}=await supabase.from('customers').insert({name:addCustomerForm.name,phonenumber:addCustomerForm.phonenumber,email:addCustomerForm.email,address:addCustomerForm.address , shoppingdate:addCustomerForm.shoppingdate})
        if(!error){       
          setAddCustomerPopup(false)
          setAddCustomerForm({name:'',phonenumber:'',email:"",address:'',shoppingdate:''})
          setRefresh(prev => !prev);
          return;
        }
        alert('Error! Contact the developer')
        console.log(error)
       
    }

    const handleUpdateCustomerDone = async (e) => {
          e.preventDefault();
          if(getCustomersFromSupabase.some((item) => item.phonenumber == editCustomerData.phonenumber && item.id !=editCustomerData.id)){
            alert('Customer already Exist')
            return;
          }

       
          const { data, error } = await supabase .from("customers") .update({name: editCustomerData.name,email: editCustomerData.email,shoppingdate:editCustomerData.shoppingdate,address:editCustomerData.address,phonenumber:editCustomerData.phonenumber }).eq("id", editCustomerData.id).select().single();
          if (error) {
            console.log(error);
            return;
          }
      
          setUpdateCustomerPopup(false);
          setMenu(null)
          setEditCustomerData({
            name: "",
            phonenumber: "",
            email:'',
            address:'',
            shoppingdate:''
          });
      
          setRefresh((prev) => !prev);
    };

    const handleDeleteCustomerDone = async () => {   
        const { data, error } = await supabase .from("customers") .delete() .eq("id", editCustomerData.id);
        if (!error) {
           setDeleteCustomerPopup(false);
          setRefresh(prev => !prev);
          setMenu(null)
          return;
        }
        console.log(error);
    };

    const handleSearch=(e)=>{
      const search=e.target.value
      setSearchInput(search)
      const searchResult = getCustomersFromSupabase.filter((item)=>item.phonenumber.toLowerCase().includes(search.toLowerCase())||String(item.email).toLowerCase().startsWith(search.toLowerCase()))
      setFilteredResult(searchResult)
    }

    const handleLogout =async()=>{
      const {data,error}=await supabase.auth.signOut()
      if(error){
        alert(error.message)
      return
      }else{
      navigate('/')
      }
    }

    const handleChange = (e) => {
      setAddCustomerForm(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    };

  return (
    <div className={style.container}>
     <div className={style.header}>
       <p> <span style={{color:'#71717B'}}>Admin / </span>Customers</p>
       <button onClick={handleLogout} type='button'><FiLogOut/> Logout</button>
     </div>
   
       <div className={style.maincontent}>
   
         <div className={style.top}>
   
           <div className={style.toptop}>
             <div>
               <h2>Customers</h2>
               <p>Manage your community and customer relationships</p>
             </div>
             <button className={style.addcustomerbutton} onClick={()=>{setAddCustomerPopup(true)}}><span className={style.fullscreen}>+ Add Customer</span><span className={style.mobilescreen}>+ Add</span></button>
           </div>
   
           <div>
             <div className={style.searchbar}>
               <FaSearch color='#71717B' size={20}/> 
               <input className={style.searchinput} type="text" name='search' value={searchInput} onChange={handleSearch} placeholder="Search Customers..." /> 
             </div>
           </div>
         </div>
   
           <div className={style.maincontentwrapper}>
             <div className={style.maincontentwrapperupper}>
               <div className={style.maincontentwrappertop}>
                 <p>Total Customers {getCustomersFromSupabase.length} </p>
               </div>
               <div className={style.maincontentwrappermid}>
                
                 <p>NAME</p>
                 <p>PHONE</p>
                 <p>EMAIL</p>
                 <p>SHOPPING DATE</p>
                 <p>ADDRESS</p>
                 <p>ACTIONS</p>
               </div>
             </div>
               
             <div className={style.maincontentwrapperbottom}>
   
               {searchInput == ''?(
                   getCustomersFromSupabase.map((item)=>(   
                    <Fragment key={item.id} >
                      <div  className={style.customercontainer}>
                       <div className={style.customername}> {item.name}  </div>
                       <div className={style.customerphonenumber}> <span>{item.phonenumber} </span>  </div>
                       <div className={style.customeremail}> <span>{item.email} </span>  </div>
                       <div className={style.customershoppingdate}>  {new Date(item.shoppingdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"})} </div>
                       <div className={style.customeraddress}> <span>{item.address} </span>  </div>
                       <div className={style.customermenubutton}>
                         <BsThreeDotsVertical style={{cursor:'pointer'}} onClick={()=>{setMenu(menu === item.id?null : item.id)}}/>
                         {menu  === item.id && (
                           <div className={style.customermenubuttoncontent}>
                             <button style={{background:'green'}}  onClick={() => { setEditCustomerData(item); setUpdateCustomerPopup(true); setMenu(null) }} >Update</button>
                             <button style={{background:'red'}} onClick={() => { setEditCustomerData(item); setDeleteCustomerPopup(true); setMenu(null)}}>Delete</button>
                           </div>
                         )}
                       </div>                   
                      </div>

                      <div  className={style.customercontainermobile}>
            
                        <div className={style.mid}>
                          <div>
                            <div className={style.customername}><span><b>Name: </b>{item.name} </span></div>
                            <div className={style.customeremail}><span><b>Email: </b> {item.email}</span> </div>                          
                          </div>
                          <div>
                            <div className={style.customermobileshoppingdate}>  <p><b>Ph. no. : </b>{item.phonenumber} </p> </div>
                            <div className={style.customermobileshoppingdate}> <p><b>Shopped at :</b> {new Date(item.shoppingdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"})}</p> </div>
                            <div className={style.customeraddress}><span><b>Address :</b> {item.address}</span> </div>
                          </div>

                        </div> 
                        <div className={style.customermenubutton}>
                          <BsThreeDotsVertical style={{cursor:'pointer'}} onClick={()=>{setMenu(menu === item.id?null : item.id)}}/>
                          {menu  === item.id && (
                            <div className={style.customermenubuttoncontent}>
                              <button style={{background:'green'}}   onClick={() => { setEditCustomerData(item); setUpdateCustomerPopup(true); setMenu(null) }} >Edit</button>
                              <button style={{background:'red'}} onClick={() => { setEditCustomerData(item); setDeleteCustomerPopup(true); setMenu(null)}}>Delete</button>
                            </div>
                          )}
                        </div>                   
                      </div>                   
                    </Fragment>

                   ))):filteredResult.length>0?(
                     filteredResult.map(item=>
                      <Fragment key={item.id} >
                     <div className={style.customercontainer}>
                       <div className={style.customername}> {item.name}  </div>
                       <div className={style.customerphonenumber}> <span>{item.phonenumber} </span>  </div>
                       <div className={style.customeremail}> <span>{item.email} </span>  </div>
                       <div className={style.customershoppingdate}>  {new Date(item.shoppingdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"})} </div>
                       <div className={style.customeraddress}> <span>{item.address} </span>  </div>
                       <div className={style.customermenubutton}>
                         <BsThreeDotsVertical style={{cursor:'pointer'}} onClick={()=>{setMenu(menu === item.id?null : item.id)}}/>
                         {menu  === item.id && (
                           <div className={style.customermenubuttoncontent}>
                             <button style={{background:'green'}}  onClick={() => {setEditCustomerData(item); setUpdateCustomerPopup(true); setMenu(null) }} >Update</button>
                             <button style={{background:'red'}} onClick={() => { setEditCustomerData(item); setDeleteCustomerPopup(true); setMenu(null)}}>Delete</button>
                           </div>
                         )}
                       </div>                   
                     </div>

                     <div  className={style.customercontainermobile}>
            
                        <div className={style.mid}>
                          <div>
                            <div className={style.customername}><span><b>Name: </b>{item.name} </span></div>
                            <div className={style.customeremail}><span><b>Email: </b> {item.email}</span> </div>                          
                          </div>
                          <div>
                            <div className={style.customermobileshoppingdate}>  <p><b>Ph. no. : </b>{item.phonenumber} </p> </div>
                            <div className={style.customermobileshoppingdate}> <p><b>Shopped at :</b> {new Date(item.shoppingdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"})}</p> </div>
                            <div className={style.customeraddress}><span><b>Address :</b> {item.address}</span> </div>
                          </div>

                        </div> 

                        <div className={style.customermenubutton}>
                          <BsThreeDotsVertical style={{cursor:'pointer'}} onClick={()=>{setMenu(menu === item.id?null : item.id)}}/>
                          {menu  === item.id && (
                            <div className={style.customermenubuttoncontent}>
                              <button style={{background:'green'}}   onClick={() => { setEditCustomerData(item); setUpdateCustomerPopup(true); setMenu(null) }} >Edit</button>
                              <button style={{background:'red'}} onClick={() => { setEditCustomerData(item); setDeleteCustomerPopup(true); setMenu(null)}}>Delete</button>
                            </div>
                          )}
                        </div>                   
                      </div>   
                    </Fragment>
                   )):(
                  <h5 className={style.nocustomer}>No Customers Found</h5>
               )}            
             </div>   

           </div>
       </div>


             {addCustomerPopup &&(
           
               <div className={style.overlay}> 
                 <form onSubmit={handleAddCustomerDone} className={style.popup}> 
                   <div className={style.close}> 
                     <button type="button" onClick={() =>{ setAddCustomerPopup(false), setAddCustomerForm({name:'',phonenumber:'',email:'',address:"",shoppingdate:''})}} className={style.closeBtn} > <IoClose size={30} /> </button> 
                   </div> 
       
                   <label className={style.label}>Name</label> 
                   <input type="text" onChange={handleChange} value={addCustomerForm.name} placeholder="Enter Customer's Name" name="name" className={style.input}  /> 
                   
                   <label className={style.label}>Email</label> 
                   <input type="text" onChange={handleChange} value={addCustomerForm.email} placeholder="Enter Customer's email" name="email" className={style.input}  /> 
       
                   <label className={style.label}>Phone Number</label> 
                   <input type="number" onChange={handleChange} value={addCustomerForm.phonenumber} placeholder="Enter Customer's Phone number" name="phonenumber" className={style.input}  /> 
       
                   <label className={style.label}>Shopping Date</label> 
                   <input type="date" onChange={handleChange} value={addCustomerForm.shoppingdate} name="shoppingdate" className={style.input}  /> 
                   
                   <label className={style.label}>Address</label> 
                   <input type="text" onChange={handleChange} value={addCustomerForm.address} placeholder="Enter Your Stock Quantity" name="address" className={style.input}  /> 
       
                   <button type="submit" className={style.submitBtn}> Done </button> 
                 </form> 
               </div>
             )}
       
             {updateCustomerPopup && (
                <div className={style.updatecustomerOverlay}>
             
               <form onSubmit={handleUpdateCustomerDone} className={style.updatecustomerModal} >
             
                 <div className={style.updatecustomerHeader}>
                   <div className={style.updatecustomerTitleSection}>
                     <h4 className={style.updatecustomerTitle}> Edit Customer </h4>
                     <small className={style.updatecustomerSubtitle}> Edit customer information </small>
                   </div>
                   <button type="button" onClick={() => setUpdateCustomerPopup(false)} className={style.updatecustomerCloseButton} > × </button>
                 </div>
             
             
                 <div className={style.updatecustomerField}>
                   <label className={style.updatecustomerLabel}> Customer Name </label>
                   <input type="text" className={style.updatecustomerInput} value={editCustomerData.name} onChange={(e) => setEditCustomerData({ ...editCustomerData, name: e.target.value, }) } />
                 </div>
             
                 <div className={style.updatecustomerField}>
                   <label className={style.updatecustomerLabel}> Phone Number </label>
                   <input type="text" className={style.updatecustomerInput} value={editCustomerData.phonenumber} onChange={(e) => setEditCustomerData({ ...editCustomerData, phonenumber: e.target.value.replace(/\D/g,'') }) } />
                 </div>
             
                 <div className={style.updatecustomerField}>
                   <label className={style.updatecustomerLabel}> Email </label>
                   <input type="text" className={style.updatecustomerInput} value={editCustomerData.email} onChange={(e) => setEditCustomerData({ ...editCustomerData, email: e.target.value, }) } />
                 </div>
             
                 <div className={style.updatecustomerField}>
                   <label className={style.updatecustomerLabel}>Address</label>
                   <input type="text" className={style.updatecustomerInput} value={editCustomerData.address} onChange={(e) => setEditCustomerData({ ...editCustomerData, address: e.target.value, }) } />
                 </div>
             
                 <div className={style.updatecustomerField}>
                   <label className={style.updatecustomerLabel}> Shopping Date </label>
                   <input type="date" className={style.updatecustomerInput} value={editCustomerData.shoppingdate} onChange={(e) => setEditCustomerData({ ...editCustomerData, shoppingdate: e.target.value, }) } />
                 </div>
             
             
                 {/* Buttons */}
                 <div className={style.updatecustomerButtons}>             
                   <button type="button" onClick={() => setUpdateCustomerPopup(false)} className={style.updatecustomerCancelButton} > Cancel </button>
                   <button type="submit" className={style.updatecustomerSaveButton} > Save Changes </button>            
                 </div>
             
               </form>
             </div>
             )}
             
             {deleteCustomerPopup && (
                   <div className={style.overlay}>
                       <div className={style.deletePopup}>
                           <h3 className={style.h3}>Are you sure?</h3>
                           <p className={style.p}> Are you sure you want to delete this item? </p>
                           <div className={style.popupButtons}>
                               <button className={style.cancelBtn} onClick={() => setDeleteCustomerPopup(false)} > Cancel </button>
                               <button className={style.deleteBtn} onClick={handleDeleteCustomerDone} > Yes, Delete </button>
                           </div>
                       </div>
                   </div>
             )}

      </div>
  )
}

export default AdminCustomers