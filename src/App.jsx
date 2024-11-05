import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Container,Navbar,Nav } from 'react-bootstrap'
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import logo from './assets/logo.png';
import profile from './assets/profile.png';
import movie from './assets/movie.png';
import home from './assets/home.png';

import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Home from './pages/Home'

<style>
    @import url('https://fonts.googleapis.com/css2?family=Shrikhand&display=swap');
</style>
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
  return (
    <div>
      {!isAuthPage && (
        <Navbar className="bg-body-tertiary">
          <Container>
            <Navbar.Brand onClick={()=>navigate('/')}>
              <img
                alt=""
                src={logo}
                width="40"
                height="40"
                className="d-inline-block align-top"
              />{' '}
              <h2 style={{fontFamily:"Shrikhand", fontStyle:"italic",fontSize:"1.5rem"}}>CINEMA ELK</h2>
            </Navbar.Brand>
          </Container>
        </Navbar>
      )}

      {!isAuthPage && (
        <div className="sidebar">
          <Nav defaultActiveKey="/" className="flex-column">
            <Nav.Link onClick={()=>navigate('/')}>
              <img src={home} alt="" />
            </Nav.Link>
            <Nav.Link onClick={()=>navigate('/')}>
              <img src={movie} alt="" />
            </Nav.Link>
            <Nav.Link onClick={()=>navigate('/')}>
              <img src={profile} alt="" />
            </Nav.Link>
          </Nav>
        </div>
      )}

      <Routes>
        <Route path='/signin' element={<Signin />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/' element={<Home />}/>
      </Routes>
    </div>
  )
}

export default App
