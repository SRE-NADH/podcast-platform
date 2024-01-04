import React, { useState } from 'react'
import Input from '../Components/Common/Input/Input';
import FileInput from '../Components/Common/Input/FileInput';
import Button from '../Components/Common/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { setEditObj } from '../slices/editSlice';

function CreateEpisode() {
 const dispatch = useDispatch();
  const editObj = useSelector((state)=>state.edit.editObj);
  console.log(editObj);

  const navigate = useNavigate();
  const {id} = useParams();
  const [title,setTitle] = useState("");
  const [desc,setDesc] = useState("");
  const [loading,setLoading] = useState(false);
  const [audioFile,setAudioFile] = useState(null);

  function handleAudioFile(file){
    setAudioFile(file);
  }

  async function createEpisode(){
    setLoading(true);
    // when it is updating
    if(editObj!==null){
      try{
        let audioUrl;
      if(audioFile){  
      const audioRef = ref(storage, `podcast-episode/${auth.currentUser.uid}/${Date.now()}`);
      await uploadBytes(audioRef,audioFile);
       audioUrl = await getDownloadURL(audioRef);
      }
      //download image url
      const episode={
        title: title?title:editObj.title,
        desc: desc?desc:editObj.desc,
        audioFile: audioFile?audioUrl:editObj.audioFile,
        createdBy:auth.currentUser.uid
      }
      await updateDoc(doc(db,"podcasts",id,"episodes",editObj.id),episode);
      setDesc("");
      setTitle("");
      setAudioFile(null)
      setLoading(false);
      navigate(`/podcast/${id}`);

      // set editobj back to null
      dispatch(setEditObj(null));
      
      toast.success("episode updated");
      
   }
   catch(e){
    toast.error(e.message);
    setLoading(false);
   }
   return;
  }
 
 // create new episode
  if(title && desc && audioFile && id){
    try{
      const audioRef = ref(storage, `podcast-episode/${auth.currentUser.uid}/${Date.now()}`);

      await uploadBytes(audioRef,audioFile);

      //download image url
      const audioUrl = await getDownloadURL(audioRef);
   
 
      
      const episode = {
       title,
       desc,
       audioFile:audioUrl,
       createdBy:auth.currentUser.uid
      };
      // add doc in to fire cloud
        const docRef = await addDoc(collection(db,'podcasts',id,"episodes"),episode);
      setDesc("");
      setTitle("");
      setAudioFile(null)
      setLoading(false);
      navigate(`/podcast/${id}`);
      toast.success("episode created");
    }
    catch(error){
      toast.error(error.message);
      setLoading(false);
    }
  }
  else{
    toast.error("fill all the fields")
    setLoading(false)
  }

  }

  return (
    <div className='input-wrapper'>
      <h1>{editObj===null?"Create Episode":"Edit Episode"}</h1>
      <Input type="text" state={title} setState={setTitle} placeholder="Enter Title" required={true} />
      <Input type="text" state={desc} setState={setDesc} placeholder="Description" required={true} />
      <FileInput text="Audio file" accept="audio/*" id="audio-file-input" fileHandlerFun={handleAudioFile} />
      <Button text={loading? "loading....":editObj?"Edit Now":"Create Now"} onClick={createEpisode} />
    </div>
  )
}

export default CreateEpisode