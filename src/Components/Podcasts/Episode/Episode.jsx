
import React from 'react';
import Button from '../../Common/Button/Button';
import "./style.css";
import CustomizedMenus from '../../MuiComponents/StyledMenu';
import { auth } from '../../../firebase';
import { useParams } from 'react-router-dom';

const Episode = ({index,episode,onClick})=> {

  const user  = auth.currentUser;

  return (
    <div className='episode'>
      <p style={{color:"white",fontSize:"1.3rem"}}>{index}. {episode.title}</p>
      <div className='episode-desc'>
        <div>
          <p>{episode.desc}</p>
          <Button text="play" onClick={()=>{onClick(episode.audioFile)}} style={{width:"60px",height:"20px"}} />
        </div>
       {episode.createdBy===user.uid && <CustomizedMenus episode={episode} />} 
      </div>
    </div>
  )
}

export default Episode