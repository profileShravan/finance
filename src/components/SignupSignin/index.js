import React, { useState } from 'react'
import "./styles.css"
import Input from '../Input/Input'
import Button from '../Button/Button';
import {auth, db, doc, provider, setDoc} from '../../firebase'
import { toast } from 'react-toastify';
import {GoogleAuthProvider, createUserWithEmailAndPassword , signInWithEmailAndPassword,  signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getDoc } from 'firebase/firestore';


function SignupSignIn() {

    const [name, setName] = useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("")
    const [loading , setLoading] = useState(false)
    const [toggleLogin, setToggleLogin] = useState(false);
    const navigate = useNavigate();

    function signupUsingEmail (){
      setLoading(true)
      console.log("name", name)
     if(name !=="" && email!=="" && password!=="" && confirmPass !==""){
      if(password == confirmPass){
        createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log("user", user)
        toast.success("User Created!")
        setLoading(false)
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPass("")
        createDoc(user);
        navigate("/dashboard")
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage) 
        setLoading(false)
        // ..
      });
      
      }
      else{
        toast.error("Password Should be Same!")
        setLoading(false)
      }
     }
     else{
      toast.error("All field are required!")
      setLoading(false)
     }
    }

    function loginUsingEmail(){
      setLoading(true)
      if(password!=="" && email!==""){
        // const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          toast.success("User Logged In!")
          navigate("/dashboard")
          setLoading(false)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage)
          setLoading(false)
        });
      }
      else{
          toast.error("All fields are mandatory!")
          setLoading(false)
      }

    }

   async function createDoc(user){
    setLoading(true)
    if(!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if(!userData.exists()){
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email : user.email,
          photoURL : user.photoURL ? user.photoURL : "",
          createdAt : new Date(),
        });
        toast.success("Doc Created")
        setLoading(false)
        
      } catch (error) {
        toast.error(error.message)
        setLoading(false)
      }
    }
    else{
      // toast.error("Doc already exists")
      setLoading(false)
    }}

    function googleauth(){
      setLoading(true)

      try {
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            createDoc(user)
            navigate("/dashboard")
            toast.success("User authenticated!")
            setLoading(false)
            // IdP data available using getAdditionalUserInfo(result)
            // ...
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            setLoading(false)
            // The email of the user's account used.
            toast.error(errorMessage)
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
      } catch (error) {
        setLoading(false)
        toast.error(error.message)
        
      }
    }

  return (
    <>
    {toggleLogin ? (<div className='signup-wrapper'>
      <h2 className='title'>Login on <span>Financly.</span></h2>
      <form>
        <Input 
            type="email"
            label={"Email"}
            inputvalue={email}
            setInputValue={setEmail}
            placeholder={"Enter Your Email"}
            
        />
        <Input 
            type="password" 
            label={"Password"}
            inputvalue={password}
            setInputValue={setPassword}
            placeholder={"Enter Password"}
            
        />
        <Button  text={loading ? "Loading..." : "Login Using Email and Password"} onClick={loginUsingEmail} disable={loading} />
        <p className='p-login'>or</p>
        <Button text={loading ? "Loading..." : "Login Using Google"} blue={true} onClick={googleauth}/>
        <p className='p-login' onClick={()=>setToggleLogin(!toggleLogin)}>Already have a account? <span>Click Here</span></p>

      </form>
    </div>)
    :
    (<div className='signup-wrapper'>
      <h2 className='title'>Sign Up on <span >Financly.</span></h2>
      <form>
        <Input 
            label={"Full Name"}
            inputvalue={name}
            setInputValue={setName}
            placeholder={"Enter Your Name"}
            
        />
        <Input 
            type="email"
            label={"Email"}
            inputvalue={email}
            setInputValue={setEmail}
            placeholder={"Enter Your Email"}
            
        />
        <Input 
            type="password" 
            label={"Password"}
            inputvalue={password}
            setInputValue={setPassword}
            placeholder={"Enter Password"}
            
        />
        <Input
            type="password" 
            label={"Confirm Password"}
            inputvalue={confirmPass}
            setInputValue={setConfirmPass}
            placeholder={"Enter Confirm Password"}
            
        />
        <Button  text={loading ? "Loading..." : "Signup Using Email and Password"} onClick={signupUsingEmail} disable={loading} />
        <p className='p-login'>or</p>
        <Button text={loading ? "Loading..." : "Signup Using Google"} blue={true} onClick={googleauth}/>
        <p className='p-login' onClick={()=>setToggleLogin(!toggleLogin)}>Or Have An Account Already ? <span>Click Here</span></p>

      </form>
    </div>)}
    </>
  )
}

export default SignupSignIn
