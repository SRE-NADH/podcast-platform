import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../Components/Common/Button/Button';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import PodcastCard from '../Components/Podcasts/PodcastCard/PodcastCard';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { setPodcasts } from '../slices/podcastsSlice';
import { Link } from 'react-router-dom';


const ProfilePage = () => {
// const user =  auth.currentUser;

const user = useSelector((state)=>state.user.user);
const podcasts = useSelector((state)=> state.podcasts.podcasts);
const dispatch = useDispatch();


useEffect(()=>{
  // real time listner to changes in fitre store
  const unsub = onSnapshot(
    query(collection(db,"podcasts")),
    (QuerySnapshot)=>{
      const podcasts = [];
      QuerySnapshot.forEach((doc)=>{
        podcasts.push({id:doc.id,...doc.data()})
      });
     dispatch(setPodcasts(podcasts));
    },
    (error) =>{
      console.error(error.message);
    }
  )
  
   return ()=>{
    unsub();
   }
  },[dispatch]);




  return (
   <div className='input-wrapper'>
    <h1>Profile</h1>
    <img style={{width:"200px",height:"150px",borderRadius:'1rem'}} src={user && user.profileImage} alt="" />
    <h1 style={{marginTop:"30px"}} >Your Podasts</h1>
    <div className='podcast-card-container'>
      { podcasts.map((item)=>(
         item.createdBy===user.uid && <PodcastCard key={item.id} id={item.id} title={item.title} displayImage={item.displayImage} />
        ))
        }
    </div>
    {podcasts.filter((item)=> item.createdBy===user.uid).length===0 && <Link style={{textDecoration:"none",color:"white"}} to={"/start-podcast"}>create your first podcast</Link>}
   </div>
  )
}

export default ProfilePage