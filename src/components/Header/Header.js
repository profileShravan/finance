import React, { useEffect } from 'react'
import "./styles.css"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { FiUser } from "react-icons/fi";

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(()=>{
    if(user){
      navigate("/dashboard");
    }
  }, [user, loading])

  function logoutFunc(){
    try {
      signOut(auth)
        .then(()=>{
          toast.success("Logged Out Successfully!")
          navigate("/")
        })
        .catch((e)=>{
          toast.error(e.message)
        })
        
      
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div className='Header'>
      <p className='logo'>Financly</p>
      {
        user && (
        <div className='user-icon'>  
          {
            user.photoURL ? <img src={user.photoURL} />:<FiUser/>
          }
          <p className='logo link' onClick={logoutFunc} >Logout</p>
        </div>  
        )
      }
    </div>
  )
}

export default Header
