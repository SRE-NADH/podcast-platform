
import { Link, useLocation } from "react-router-dom";
import "./style.css";
import { auth } from "../../../firebase";
import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { FaDropbox } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Header = ()=>{
  const [isClick,setIsClick] = useState(false);
const location = useLocation();
const currpath = location.pathname;
const dropRef = useRef(null);

const user = auth.currentUser;
const userState = useSelector((state)=>state.user.user);
let logo = document.querySelector(".logo>img");

useEffect(() => {
  // Attach the event listener when the component mounts
  document.addEventListener('mousedown', handleOutsideClick);

  // Detach the event listener when the component unmounts
  return () => {
    document.removeEventListener('mousedown', handleOutsideClick);
  };
}, []);

const handleOutsideClick = (event) => {
  if (dropRef.current && !dropRef.current.contains(event.target) && event.target!==logo ) {
    // Clicked outside the modal, close it
    setIsClick(false);
  }
};

 
function handleLogout(){
  signOut(auth).then(() => { 
       // Sign-out successful.
       toast.success("user Logged out!")
       setIsClick(false);
     }).catch((error) => {
       // An error happened.
       toast.error(error.message);
     });
     
}



    return (
        <div className="navbar">
          <div className="gradient"></div>
          <div className="links">
            <Link to="/" className={currpath=='/'? "active":""} >Signup</Link>
            <Link to="/podcasts"  className={currpath=="/podcasts"?"active":""}>Podcasts</Link>
            <Link to="/start-podcast"  className={currpath==="/start-podcast"?"active":""} >Start a Podcast</Link>
            <Link to="/profile" className={currpath=="/profile"?"active":""} >Profile</Link>
          </div>
          <div onClick={()=>{setIsClick(!isClick)}} className="logo" ><img src={userState ? userState.profileImage:"https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?w=740&t=st=1703762229~exp=1703762829~hmac=73d5571272b4f165751eb67344b2d52d90f62f4dd435bc53f8718a4549565c81"} alt="" /></div>
          {
            isClick && user && ( <div ref={dropRef} className="drop-down">
            <li onClick={handleLogout} >Logout</li>
            {/* <li>Login</li> */}
          </div>
            )
          }
        </div>
    )
}

export default Header;