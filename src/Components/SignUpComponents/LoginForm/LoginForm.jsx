import React from 'react'
import { useState } from 'react';
import Input from '../../Common/Input/Input';
import Button from '../../Common/Button/Button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginForm = () => {
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const  [email,setEmail] = useState("");
     const  [password,setPassword] = useState("");
      const [loading,setLoading] = useState(false);

     async function handleLogin(){
      setLoading(true);
      if(!password || !email ){
        toast.error("please fill all the required fields");
        setLoading(false);
        return;
      }
      try{
        let userCredential  = await signInWithEmailAndPassword(auth,email,password);
        let user  = userCredential.user;
       
        // save user details to firestore
        let userdoc = await getDoc(doc(db,"users",user.uid));
        let userData = userdoc.data();
        //call redux action
        dispatch(setUser({
          name:userData.name,
          email:userData.email,
          uid:userData.uid,
          profileImage:userData.profileImage
        }));
        toast.success("You are successfully logged in")
        setLoading(false);
        navigate("/profile");
      }
      catch(error){
        setLoading(false);
        toast.error("check your password or email");
      }
     }

  return (
    <>
       <Input type="text" state={email} setState={setEmail} placeholder="Enter email" required={true} />
       <Input type="password" state={password} setState={setPassword} placeholder="Enter password" required={true} />
       <Button text={loading?"loading....":"Login"} onClick={handleLogin}/>
    </>
  )
}

export default LoginForm