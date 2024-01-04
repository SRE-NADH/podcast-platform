import {  useEffect, useState } from 'react'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUpPage';
import Header from './Components/Common/Header/Header';
import ProfilePage from './pages/ProfilePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from './slices/userSlice';
import PrivateRoute from './Components/Common/PrivateRoute';
import CreatePodcastPage from './pages/CreatePodcastPage';
import PodcastsPage from './pages/PodcastsPage';
import PodcastDetails from './pages/PodcastDetails';
import CreateEpisode from './pages/CreateEpisode';


function App() {
  const dispatch = useDispatch();
 useEffect(()=>{ 
  const unsubscibeAuth = onAuthStateChanged(auth,(user)=>{
    if(user){
      const unsubscribedSnapshot = onSnapshot(
        doc(db,"users",user.uid),(userdoc)=>{
          if(userdoc.exists()){
            const userData = userdoc.data();
               dispatch(
              setUser({
                  name:userData.name,
                  email:userData.email,
                  uid:user.uid,
                  profileImage:userData.profileImage
              })
            )
          }
        },
        (error) => {
          console.error("Error fetching user data:",error);
        }
      );
      return () => {
         unsubscribedSnapshot();
      }
    }
  })

  return ()=>{
    unsubscibeAuth();
  }
 },[])

  return (
    <div className='app'>
      <ToastContainer/>
    <Router>
     <Header/>
     <Routes>
       <Route path='/' element={<SignUp/>}/>
       <Route element={<PrivateRoute/>} >
          <Route path='/profile' element={<ProfilePage/>} />
          <Route path='/start-podcast' element ={<CreatePodcastPage/>} />
          <Route path='/podcasts' element ={<PodcastsPage/>}/>
          <Route path='/podcast/:id' element={<PodcastDetails/>} />
          <Route path='/podcast/:id/episode' element={<CreateEpisode />} />
       </Route>
     </Routes>
    </Router>
    </div>
    
  )
}

export default App
