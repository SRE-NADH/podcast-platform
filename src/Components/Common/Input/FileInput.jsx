import React, { useState } from 'react'

const FileInput = ({text,accept,id,fileHandlerFun}) => {
const [fileName,setFileName] = useState("");

function handleFile(e){
setFileName(e.target.files[0].name);
fileHandlerFun(e.target.files[0]);
}


  return (
  <>  
   <label style={{borderStyle:"dotted"}} className={`custom-input ${!fileName ? "label-input":"active"}`} htmlFor={id} >{fileName?`${fileName}`:`${text}`}</label>  
   <input  type='file' accept={accept} id={id} style={{display:"none"}} onChange={handleFile}  />
  </> 
  )
}

export default FileInput