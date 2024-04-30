import React from 'react'
import Header from '../components/Header/Header';
import SignupSignIn from '../components/SignupSignin';
import "../App.css"

function Signup() {
  return (
    <>
      <Header/>
      <div className='wrapper'>
        <SignupSignIn/>

      </div>
    </>
  )
}

export default Signup;
