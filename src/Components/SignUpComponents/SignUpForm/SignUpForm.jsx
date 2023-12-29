
import React, { useState } from 'react';
import Input from '../../Common/Input/Input';
import Button  from '../../Common/Button/Button';
import { auth, db, storage } from '../../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FileInput from '../../Common/Input/FileInput';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

 const SignUpForm = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
     const [name,setName] = useState("");
     const [email,setEmail] = useState("");
     const [password,setPassword] = useState("");
     const [confirmPassword,setConfirmPassword] = useState("");
     const [loading,setLoading] = useState(false);
     const [profileImage,setProfileImage] = useState(null);
   
     

     async function handleSignup(){
      setLoading(true);
      if(!password || !email || !name || !confirmPassword || !profileImage){
         toast.error("fill all the required fields");
         setLoading(false);
         return;
      }
      if(password!==confirmPassword){
        toast.error("paswords should be same");
        setLoading(false);
        return;
      } 
      try{
        // sign up
        let userCredential  = await createUserWithEmailAndPassword(auth,email,password);
        let user  = userCredential.user;
         
        //add profile image to database
        const profileImageRef = ref(storage, `profile/${user.uid}/${Date.now()}`);
        await uploadBytes(profileImageRef,profileImage);
        const profileImageUrl = await getDownloadURL(profileImageRef);



       
        // save user details to firestore
        await setDoc(doc(db,"users",user.uid),{
          name:name,
          email:email,
          uid:user.uid,
          profileImage: profileImageUrl
        });
        //call redux action
        dispatch(setUser({
          name:name,
          email:email,
          uid:user.uid,
          profileImage:profileImageUrl
        }));
        toast.success('account created successfully');
        setLoading(false);
        navigate("/profile");

        setConfirmPassword("");
        setEmail("");
        setName("");
        setPassword("");
        setProfileImage(null);
      }
      catch(error){
        console.log(error.message);
        setLoading(false);
        toast.error(error.message);
       
      }
     }

     function handleProfileImage(file){
       setProfileImage(file);
     }

  return (
    <>
       <Input type="text" state={name} setState={setName} placeholder="Enter name" required={true} />
       <Input type="text" state={email} setState={setEmail} placeholder="Enter email" required={true} />
       <Input type="password" state={password} setState={setPassword} placeholder="Enter password" required={true} />
       <Input type="password" state={confirmPassword} setState={setConfirmPassword} placeholder="Confirm password" required={true} />
       <FileInput text="add profile image" accept="image/*" id="profile-image-input" fileHandlerFun={handleProfileImage} />
       <Button text={loading?"loading....":"SignUp"} onClick={handleSignup}/>
    </>
  )
}

export default SignUpForm;
