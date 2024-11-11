import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Container,Navbar,Nav,Button } from 'react-bootstrap'
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import logo from './assets/logo.png';
import profile from './assets/profile.png';
import movie from './assets/movie.png';
import home from './assets/home.png';


import { useState,useEffect } from 'react';

import { auth,firestore } from './firebase';
import { doc,setDoc,deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Home from './pages/Home'
import MoviePage from './pages/MoviePage';
import ReviewPage from './pages/ReviewPage';
import Profile from './pages/profile';


<style>
    @import url('https://fonts.googleapis.com/css2?family=Shrikhand&display=swap');
</style>
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink,setActiveLink]=useState(location.pathname);
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';


  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth,(user)=>{
      console.log(user);
      if(!user && !isAuthPage){
        navigate('/signin');
      }
      return unsubscribe;
    })
  },[navigate,isAuthPage])

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLogout = async ()=>{
    await signOut(auth);
    navigate('/signin');
  }

  const handleClick = (path)=>{
    setActiveLink(path);
    navigate(path);
  } 

  return (
    <div>
      {!isAuthPage && (
        <Navbar className="bg-body-tertiary">
          <Container>
            <Navbar.Brand onClick={()=>navigate('/')}>
              <img
                alt=""
                src={logo}
                width="45"
                height="45"
                className="d-inline-block align-top"
              />{' '}
              <h2 style={{fontFamily:"Shrikhand",margin:0, fontStyle:"italic",fontSize:"1.5rem", fontWeight:600}}>CINEMA ELK</h2>
            </Navbar.Brand>
            <Button variant="primary" onClick={handleLogout}>Logout</Button>
          </Container>
        </Navbar>
      )}

      {!isAuthPage && (
        <div className="sidebar">
          <Nav className="flex-column">
            <Nav.Link onClick={()=>handleClick('/')}>
              <img style={{backgroundColor:activeLink==='/' || activeLink.startsWith('/movie-review') ? '#f15a24' : '#0d6efd'}} src={home} alt="" />
            </Nav.Link>
            <Nav.Link onClick={()=>handleClick('/reviews')}>
              <img style={{backgroundColor:activeLink==='/reviews' ? '#f15a24' : "#0d6efd"}} src={movie} alt="" />
            </Nav.Link>
            <Nav.Link onClick={()=>handleClick('/profile')}>
              <img style={{backgroundColor:activeLink==='/profile' ? '#f15a24' : '#0d6efd'}} src={profile} alt="" />
            </Nav.Link>
          </Nav>
        </div>
      )}

      <Routes>
        <Route path='/signin' element={<Signin />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/' element={<Home />}/>
        <Route path='/movie-review/:id' element={<MoviePage />}/>
        <Route path='/reviews' element={<ReviewPage />}/>
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
