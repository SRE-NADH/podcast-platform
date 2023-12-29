import React, { useState } from 'react'
import Input from '../Components/Common/Input/Input';
import FileInput from '../Components/Common/Input/FileInput';
import Button from '../Components/Common/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

function CreateEpisode() {
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
  if(title && desc && audioFile && id){
    try{
      const audioRef = ref(storage, `podcast-episode/${auth.currentUser.uid}/${Date.now()}`);

      await uploadBytes(audioRef,audioFile);

      //download image url
      const audioUrl = await getDownloadURL(audioRef);
   
 
      // add doc in to fire cloud
      const episode = {
       title,
       desc,
       audioFile:audioUrl,
       createdBy:auth.currentUser.uid
      };
      const docRef = await addDoc(collection(db,'podcasts',id,"episodes"),episode);
      console.log(docRef);
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
      <h1>Create Episode</h1>
      <Input type="text" state={title} setState={setTitle} placeholder="Enter Title" required={true} />
      <Input type="text" state={desc} setState={setDesc} placeholder="Description" required={true} />
      <FileInput text="Audio file" accept="audio/*" id="audio-file-input" fileHandlerFun={handleAudioFile} />
      <Button text={loading? "loading....": "Create Now"  } onClick={createEpisode} />
    </div>
  )
}

export default CreateEpisode