import React from 'react';
import "./style.css";
import { Link } from 'react-router-dom';

function PodcastCard({id,title,displayImage}) {



  return (
    <Link to={`/podcast/${id}`}>
    <div className='podcast-card'>
        <img className='img' src={displayImage} />
        <p className='title'>{title}</p>
     </div>
     </Link> 
  )
}

export default PodcastCard