import React from 'react'
import "./style.css"

 const Button = ({text,onClick,style}) => {
  return (
    <div className='custom-button' onClick={onClick} style={style} >
       {text}
    </div>
  )
}

export default Button;
