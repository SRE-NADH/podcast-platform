import { QuerySnapshot, collection, doc, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setPodcasts } from '../slices/podcastsSlice';
import PodcastCard from '../Components/Podcasts/PodcastCard/PodcastCard';
import Input from '../Components/Common/Input/Input';


const PodcastsPage = () => {
  const dispatch  = useDispatch();
  const [search,setSearch]  = useState("");
  const podcasts = useSelector((state)=>state.podcasts.podcasts);

  let filterPodcast = podcasts.filter((item)=>item.title.trim().toLowerCase().includes(search.trim().toLowerCase())) ;


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
      <h1>Discover Podcasts</h1>
      <Input type="search" state={search} setState={setSearch} required={false} placeholder="search by title" />
      <div className='podcast-card-container'>
        { filterPodcast.map((item)=>(
         <PodcastCard key={item.id} id={item.id} title={item.title} displayImage={item.displayImage} />
        ))
        }
      </div>
      <p>{podcasts.length==0 && filterPodcast.length===0? "no podcasts available":"podacast not found"}</p>
    </div>
  )
}
export default PodcastsPage