
import React from 'react';
import Button from '../../Common/Button/Button';
import "./style.css";

const Episode = ({index,title,desc,audioFile,onClick})=> {



  return (
    <div className='episode'>
      <p style={{color:"white",fontSize:"1.3rem"}}>{index}. {title}</p>
      <div className='episode-desc'>
        <p>{desc}</p>
        <Button text="play" onClick={()=>{onClick(audioFile)}} style={{width:"60px",height:"20px"}} />
      </div>
    </div>
  )
}

export default Episode