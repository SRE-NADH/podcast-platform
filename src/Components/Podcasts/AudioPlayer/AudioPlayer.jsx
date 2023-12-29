import React, { useEffect, useRef, useState } from 'react';
import "./style.css";
import {FaPlay,FaPause,FaVolumeUp,FaVolumeMute} from "react-icons/fa";

const AudioPlayer = ({file,image}) => {

     const [duration,setDuration] = useState(0);
     const [currentTime,setCurrentTime] = useState(0);
     const [volume,setVolume] = useState(0.5);
     
     const [isPlaying,setIsPlaying] = useState(true);
     const [isMute,setIsMute] = useState(false);
     const audioRef = useRef();

     useEffect(()=>{

          if(!audioRef.current) return;
          
          audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
          audioRef.current.addEventListener('timeupdate', updateTime )
          audioRef.current.addEventListener('ended', handleEnded);
         
        

        return ()=>{
          if(!audioRef.current) return;
          audioRef.current.removeEventListener("timeUpdate",updateTime);
          audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        }
     },[])

function updateTime(e){
   if(!audioRef.current) return;
     setCurrentTime(audioRef.current.currentTime);
}
function handleLoadedMetadata(){
  setDuration(audioRef.current.duration);
}
function handleEnded(){
     setIsPlaying(false);
     setCurrentTime(0); 
}

 useEffect(()=>{
   setIsMute(false);
   setIsPlaying(true);
   audioRef.current.play();
 },[file]);

  useEffect(()=>{
     if(isPlaying){
          audioRef.current.play();
     }
     else{
          audioRef.current.pause()
     }

  },[isPlaying]);

  useEffect(()=>{
     if(isMute){
          audioRef.current.volume = 0;
     }
     else{
          audioRef.current.volume = volume;
     }

  },[isMute]);

  function handleVolume(e){
     setVolume(e.target.value);
     audioRef.current.volume = e.target.value;
  }
  function handleDuration(e){
     setCurrentTime(e.target.value);
     audioRef.current.currentTime =e.target.value;
  }

function formatTime(time){
const min = Math.floor(time/60);
const sec= Math.floor(time%60);
return `${min}:${sec< 10 ?"0":""}${sec}`
}




  return (
    <div className='custom-audio-player'>
     
      <div className='duaration-container' >
      <img src={image} alt="img" />
      <audio ref={audioRef} src={file} />
          <p onClick={()=>setIsPlaying(!isPlaying)}>{isPlaying?<FaPause/>:<FaPlay/>}</p>
          <p>{formatTime(currentTime)}</p>
          <input value={currentTime} step={0.01} min={0} max={duration} className='duration-range' type='range' onChange={handleDuration} />
          <p>{formatTime(duration)}</p>
      </div>
      <div className='volume-container'>
        <p onClick={(e)=>setIsMute(!isMute)} >{isMute?<FaVolumeMute/>:<FaVolumeUp/>}</p>
        <input value={volume} max={1} min={0} step={0.01} type='range' className='volume-range' onChange={handleVolume}/>
      </div>
      
    </div>
  )
}

export default AudioPlayer