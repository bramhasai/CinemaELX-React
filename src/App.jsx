import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Container,Navbar,Nav,Button } from 'react-bootstrap'
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import logo from './assets/logo.png';
import profile from './assets/profile.png';
import movie from './assets/movie.png';
import home from './assets/home.png';

import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Home from './pages/Home'
import { useState } from 'react';
import MoviePage from './pages/MoviePage';

<style>
    @import url('https://fonts.googleapis.com/css2?family=Shrikhand&display=swap');
</style>
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink,setActiveLink]=useState(location.pathname);
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

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
            <Button variant="primary">Logout</Button>
          </Container>
        </Navbar>
      )}

      {!isAuthPage && (
        <div className="sidebar">
          <Nav className="flex-column">
            <Nav.Link onClick={()=>handleClick('/')}>
              <img style={{backgroundColor:activeLink==='/' ? 'orange' : 'rgb(64, 64, 251)'}} src={home} alt="" />
            </Nav.Link>
            <Nav.Link onClick={()=>handleClick('/movie')}>
              <img style={{backgroundColor:activeLink==='/movie' ? 'orange' : 'rgb(64, 64, 251)'}} src={movie} alt="" />
            </Nav.Link>
            <Nav.Link onClick={()=>handleClick('/profile')}>
              <img style={{backgroundColor:activeLink==='/profile' ? 'orange' : 'rgb(64, 64, 251)'}} src={profile} alt="" />
            </Nav.Link>
          </Nav>
        </div>
      )}

      <Routes>
        <Route path='/signin' element={<Signin />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/' element={<Home />}/>
        <Route path='/movie-review/:id' element={<MoviePage />}/>
      </Routes>
    </div>
  )
}

export default App
