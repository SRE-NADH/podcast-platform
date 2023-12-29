import React, { useState } from 'react'
import Input from '../Common/Input/Input';
import Button from '../Common/Button/Button';
import FileInput from '../Common/Input/FileInput';
import { auth, db, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CreatePodcastForm = () => {

  const navigate = useNavigate();

  const [title,setTitle] = useState("");
  const [desc,setDesc] = useState("");
  const [bannerImage,setBannerImage] = useState(null);
  const [displayImage,setDisplayImage] = useState(null);
  const [loading,setLoading] = useState(false);

   
async function createPodcast(){
  setLoading(true);
  if(title && bannerImage && displayImage && desc){
    try{
      const bannerImagesRef = ref(storage, `podcasts/${auth.currentUser.uid}/${Date.now()}`);
      const  displayImagesRef = ref(storage, `podcasts/${auth.currentUser.uid}/${Date.now()}`);

     //upload image 
     await uploadBytes(bannerImagesRef,bannerImage);
     await uploadBytes(displayImagesRef,displayImage);
     //download image url
     const bannerImageUrl = await getDownloadURL(bannerImagesRef);
     const displayImageUrl = await getDownloadURL(displayImagesRef);

     // add doc in to fire cloud
     const podcastData = {
      title,
      desc,
      bannerImage:bannerImageUrl,
      displayImage:displayImageUrl,
      createdBy:auth.currentUser.uid
     };
     const docRef = await addDoc(collection(db,'podcasts'),podcastData);

     navigate(`/podcast/${docRef.id}`);
     setTitle("");
     setDesc("");
     setBannerImage(null);
     setDisplayImage(null);
     toast.success("file uploaded");
     setLoading(false);
    }
    catch(error){
        toast.error(error.message);
        console.log(error.message);
        setLoading(false);
    }
  }
  else{
    toast.error("fill all the required fields");
    setLoading(false);
  }
}

function handleBannerFile(file){
  setBannerImage(file);
}
function handleDisplayImage(file){
     setDisplayImage(file);
   }

  return (
  <>
       <Input type="text" state={title} setState={setTitle} placeholder="Podcast Title" required={true} />
       <Input type="text" state={desc} setState={setDesc} placeholder="Podcast Description" required={true} />
       <FileInput text="Banner Image" accept="image/*" id="banner-image-input" fileHandlerFun={handleBannerFile} />
       <FileInput text="Display Image" accept="image/*" id="display-image-input" fileHandlerFun={handleDisplayImage} />
       <Button text={loading? "loading....": "Create Now"  } onClick={createPodcast} />
  </>
  )
}

export default CreatePodcastForm