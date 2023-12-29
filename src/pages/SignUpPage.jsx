import { useState } from "react";
import SignUpForm  from "../Components/SignUpComponents/SignUpForm/SignUpForm";
import LoginForm from "../Components/SignUpComponents/LoginForm/LoginForm";


const SignUp = ()=>{
 const [flag,setFlag] = useState(false);

    return(
        <div>
           <div className="input-wrapper">
             {!flag?<h1>SignUp</h1>:<h1>Login</h1>}
             {!flag?<SignUpForm/>:<LoginForm/>}
             {!flag?<p onClick={()=>{setFlag(!flag)}}>Already Have An Account? Login</p>:<p onClick={()=>{setFlag(!flag)}} > Don't Have An Account? create</p>}
           </div>
           
        </div>
    )
}

export default SignUp;