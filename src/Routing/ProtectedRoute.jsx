import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}) {

    const Session = sessionStorage.getItem('loggedin')

    if(Session){
        return children;
    }else{
        return <Navigate to='/login' replace/>
    }

  return (
    <div>ProtectedRoute</div>
  )
}

export default ProtectedRoute