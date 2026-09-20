import React, { Fragment, useEffect, useState } from 'react'
import style from './AdminCustomers.module.css'
import { FiDownload, FiEdit, FiLogOut } from 'react-icons/fi';
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegTrashAlt, FaSearch } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { supabase } from '../../../../utils/supabase';
import { useNavigate } from 'react-router-dom';

import * as XLSX from 'xlsx';


function AdminCustomers() {

  const navigate = useNavigate()


  const [refresh,setRefresh]=useState(false)
  const [searchInput,setSearchInput]=useState('')
  const [getCustomersFromSupabase,setGetCustomersFromSupabase]=useState([])
  const [menu,setMenu] =useState(null)
  const [addCustomerPopup,setAddCustomerPopup]=useState(false)
  const [addCustomerForm,setAddCustomerForm]=useState({name:'',phonenumber:'',comment:"",shoppingdate:''})
  const [editCustomerData, setEditCustomerData] = useState({  name: "", phonenumber:'',comment:'',shoppingdate:'' });
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

    const handleExportProducts = () => {
      const customersToExport = getCustomersFromSupabase.map((item) => ({
        "Name": item.name,
        "Shopping Date":item.shoppingdate,
        "Phone number": item.phonenumber,
        "Comment":item.comment,
      }));
    
      if (customersToExport.length === 0) {
        alert("No Customers found");
        return;
      }
    
      const worksheet = XLSX.utils.json_to_sheet(customersToExport);
    
      const workbook = XLSX.utils.book_new();
    
      XLSX.utils.book_append_sheet(workbook, worksheet, "customers");
    
      XLSX.writeFile(workbook, `Customers.xlsx`);
    };

    const handleAddCustomerDone=async(e)=>{
        e.preventDefault()
        if(getCustomersFromSupabase.some(item => item.phonenumber == addCustomerForm.phonenumber)){
          alert('Customer already Exist')
          return;
        }
        const {data,error}=await supabase.from('customers').insert({name:addCustomerForm.name,phonenumber:addCustomerForm.phonenumber,comment:addCustomerForm.comment , shoppingdate:addCustomerForm.shoppingdate})
        if(!error){       
          setAddCustomerPopup(false)
          setAddCustomerForm({name:'',phonenumber:'',comment:'',shoppingdate:''})
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

       
          const { data, error } = await supabase .from("customers") .update({name: editCustomerData.name,shoppingdate:editCustomerData.shoppingdate,comment:editCustomerData.comment,phonenumber:editCustomerData.phonenumber }).eq("id", editCustomerData.id).select().single();
          if (error) {
            console.log(error);
            return;
          }
      
          setUpdateCustomerPopup(false);
          setMenu(null)
          setEditCustomerData({
            name: "",
            phonenumber: "",
            comment:'',
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
      const searchResult = getCustomersFromSupabase.filter((item)=>item.phonenumber.toLowerCase().includes(search.toLowerCase()))
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
                <button onClick={handleExportProducts}> <FiDownload/> <p>Export</p></button>
               </div>
               
               <div className={style.maincontentwrappermid}>
                
                 <p>NAME</p>
                 <p>PHONE</p>
                 <p>SHOPPING DATE</p>
                 <p>COMMENT</p>
                 <p>ACTIONS</p>
               </div>
             </div>
               
             <div className={style.maincontentwrapperbottom}>
   
               {searchInput == ''?(
                   getCustomersFromSupabase.map((item)=>(   
                    <Fragment key={item.id} >
                      <div  className={style.customercontainer}>
                       <div className={style.customername}> {item.name?item.name:(<span>No Name</span>)}  </div>
                       <div className={style.customerphonenumber}> {item.phonenumber?item.phonenumber:(<span>No Phone number</span>)} </div>
                       <div className={style.customershoppingdate}> {item.shoppingdate?new Date(item.shoppingdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"}):(<span>No Date</span>)} </div>
                       <div className={style.customercomment}> {item.comment?item.comment:(<span>No Comment</span>)}  </div>
                       <div className={style.customermenubuttoncontent}>
                         <button onClick={() => { setEditCustomerData(item); setUpdateCustomerPopup(true);}} ><CiEdit color='black' size={25}/></button>
                         <button onClick={() => { setEditCustomerData(item); setDeleteCustomerPopup(true);}}><FaRegTrashAlt color='red' size={23}/></button>
                       </div>
                      </div>

                      <div  className={style.customercontainermobile}>
                        <div className={style.mid}>
                          <div>
                            <div className={style.customername}><b>Name : </b> &nbsp; {item.name?item.name:( <span> No Name</span>)} </div>
                            <div className={style.customermobileshoppingdate}>  <b>Ph. no. : </b> &nbsp; {item.phonenumber?item.phonenumber:(<span>No Phone number</span>)} </div>                       
                          </div>
                          <div>
                          <div className={style.customermobileshoppingdate}> <p><b>Shopped at :</b> {item.shoppingdate?new Date(item.shoppingdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"}):(<span>No Date</span>)}</p> </div>
                          <div className={style.customercomment}> <b>Comment :  </b> &nbsp; {item.comment?item.comment: (<span>No Comment</span>)}  </div>
                          </div>
                        </div> 
                        <div className={style.customermenubuttoncontent}>
                          <button onClick={() => { setEditCustomerData(item); setUpdateCustomerPopup(true);}} ><CiEdit color='black' size={25}/></button>
                          <button onClick={() => { setEditCustomerData(item); setDeleteCustomerPopup(true);}}><FaRegTrashAlt color='red' size={23}/></button>
                        </div>        
                      </div>                   
                    </Fragment>

                   ))):filteredResult.length>0?(
                     filteredResult.map(item=>
                      <Fragment key={item.id} >
                        <div className={style.customercontainer}>
                          <div className={style.customername}> {item.name?item.name:(<span>No Name</span>)}  </div>
                          <div className={style.customerphonenumber}> {item.phonenumber?item.phonenumber:(<span>No Phone number</span>)} </div>
                          <div className={style.customermobileshoppingdate}> {item.shoppingdate?new Date(item.shoppingdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"}):(<span>No Date</span>)} </div>
                          <div className={style.customercomment}> {item.comment?item.comment:(<span>No Comment</span>)}  </div>
                          <div className={style.customermenubuttoncontent}>
                            <button onClick={() => { setEditCustomerData(item); setUpdateCustomerPopup(true);}} ><CiEdit color='black' size={25}/></button>
                            <button onClick={() => { setEditCustomerData(item); setDeleteCustomerPopup(true);}}><FaRegTrashAlt color='red' size={23}/></button>
                          </div>                   
                        </div>

                        <div  className={style.customercontainermobile}>
                          <div className={style.mid}>
                            <div>
                              <div className={style.customername}><b>Name : </b> &nbsp; {item.name?item.name:( <span> No Name</span>)} </div>
                              <div className={style.customermobileshoppingdate}>  <b>Ph. no. : </b> &nbsp; {item.phonenumber?item.phonenumber:(<span>No Phone number</span>)} </div> 
                            </div>
                            <div>
                              <div className={style.customermobileshoppingdate}> <b>Shopped at :</b> {item.shoppingdate?new Date(item.shoppingdate).toLocaleDateString("en-US",{timeZone:"Asia/Karachi",month:"short", day:"2-digit",year:"numeric"}):(<span>No Date</span>)}</div>
                              <div className={style.customercomment}> <b>Comment :  </b> &nbsp; {item.comment?item.comment: (<span>No Comment</span>)}  </div>
                            </div>
                          </div> 
                          <div className={style.customermenubuttoncontent}>
                            <button onClick={() => { setEditCustomerData(item); setUpdateCustomerPopup(true);}} ><CiEdit color='black' size={25}/></button>
                            <button onClick={() => { setEditCustomerData(item); setDeleteCustomerPopup(true);}}><FaRegTrashAlt color='red' size={23}/></button>
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
                     <button type="button" onClick={() =>{ setAddCustomerPopup(false), setAddCustomerForm({name:'',phonenumber:'',comment:"",shoppingdate:''})}} className={style.closeBtn} > <IoClose size={30} /> </button> 
                   </div> 
       
                   <label className={style.label}>Name</label> 
                   <input type="text" onChange={handleChange} value={addCustomerForm.name} placeholder="Enter Customer's Name" name="name" className={style.input}  /> 
                   
                   <label className={style.label}>Phone Number</label> 
                   <input type="number" onChange={handleChange} value={addCustomerForm.phonenumber} placeholder="Enter Customer's Phone number" name="phonenumber" className={style.input}  /> 
       
                   <label className={style.label}>Shopping Date</label> 
                   <input type="date" onChange={handleChange} value={addCustomerForm.shoppingdate} name="shoppingdate" className={style.input}  /> 
                   
                   <label className={style.label}>Comment</label> 
                   <input type="text" onChange={handleChange} value={addCustomerForm.comment} placeholder="Type comment ..." name="comment" className={style.input}  /> 
       
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
                   <input type="text" className={style.updatecustomerInput} value={editCustomerData.name} onChange={(e) => setEditCustomerData({ ...editCustomerData, name: e.target.value, }) } placeholder="Edit Customer's Name"/>
                 </div>
             
                 <div className={style.updatecustomerField}>
                   <label className={style.updatecustomerLabel}> Phone Number </label>
                   <input type="text" className={style.updatecustomerInput} value={editCustomerData.phonenumber} onChange={(e) => setEditCustomerData({ ...editCustomerData, phonenumber: e.target.value.replace(/\D/g,'') }) } placeholder="Edit Customer's Phone number"/>
                 </div>
             
                 <div className={style.updatecustomerField}>
                   <label className={style.updatecustomerLabel}>Comment</label>
                   <input type="text" className={style.updatecustomerInput} value={editCustomerData.comment} onChange={(e) => setEditCustomerData({ ...editCustomerData, comment: e.target.value, }) } placeholder='Edit Comment ...'/>
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