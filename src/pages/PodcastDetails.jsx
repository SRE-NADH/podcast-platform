import React, { useEffect, useState } from 'react'
import Button from '../Components/Common/Button/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { auth, db } from '../firebase';
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import Episode from '../Components/Podcasts/Episode/Episode';
import AudioPlayer from '../Components/Podcasts/AudioPlayer/AudioPlayer';


function PodcastDetails() {
const {id} = useParams();
const [podcast,setPodcast] = useState({});
const navigate = useNavigate();
const [episodes,setEpisodes] = useState([]);
const [playingFile,setPlayingFile] = useState(null);

useEffect(()=>{
  // real time listner to changes in fitre store
  const unsub = onSnapshot(
    query(collection(db,"podcasts",id,"episodes")),
    (QuerySnapshot)=>{
      const data = [];
      QuerySnapshot.forEach((doc)=>{
        data.push({id:doc.id,...doc.data()})
      });
     setEpisodes(data);
    },
    (error) =>{
      console.error(error.message);
    }
  )
   return ()=>{
    unsub();
   }
  },[id]);


useEffect(()=>{
       getPodcastData();
    },[id]);

async function getPodcastData(){
     let podcastDoc = await getDoc(doc(db,"podcasts",id));
     let data = podcastDoc.data();
     setPodcast(data);
}

function createEpisode(){
  navigate(`/podcast/${id}/episode`);
}

  return (
    <div className='podcast-details'>
     <div className='podcast-details-header'>
      <p style={{color:"white",fontSize:"1.5rem"}} >{podcast.title}</p>
      {podcast.createdBy===auth.currentUser.uid &&  <Button text="create episode" onClick={createEpisode} style={{width:"160px"}} />}
     </div>
     <div className='podcast-details-img'><img src={podcast.bannerImage} alt="img." /></div>
     <p className='desc' >{podcast.desc}</p>
     <h1 style={{color:"white",margin:"20px"}}>Episodes</h1>
     <div className='episodes'>
     {episodes.length>0 && episodes.map((item,index)=>(
        <Episode key={index} title={item.title} audioFile={item.audioFile} index={index+1} desc={item.desc} onClick={(file)=>(setPlayingFile(file))}  />
     ))}
     </div>
     {playingFile &&<AudioPlayer file={playingFile} image={podcast.displayImage} />}
    </div>
  )
}

export default PodcastDetails