import React, { useState } from "react";
import { Row,Col } from "react-bootstrap";
import {Button,Form,Card} from 'react-bootstrap';

import sign_img from '../assets/sign_img.png';
import '../CSS/Signin.css';
import { useNavigate } from "react-router-dom";


export default function Signin(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = ()=>{
        alert("Hello login");
    }

    return(
        <div style={{height:"100vh",width:"100%",color:"white",backgroundColor:"#f15a24"}}>
            <Row className="sign_page_row">
                <Col style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <img src={sign_img} alt="" />
                </Col>
                <Col>
                    <h2 style={{fontFamily:"Shrikhand", fontStyle:"italic",fontSize:"4rem"}}>CINEMA ELK</h2>
                    <Card style={{backgroundColor:'#f15a24',border:"none"}}>
                        <Card.Body>
                            <Form className="signin_form">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control type="email" placeholder="Enter email address" onChange={(e)=>setEmail(e.target.value)}/>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Control type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                                </Form.Group>
                            </Form>
                            <Button onClick={handleLogin} className="signin_button" variant="primary" type="submit">
                                    Login Now
                            </Button>
                        </Card.Body>
                    </Card>
                    <div style={{marginTop:"1rem",display:"flex", alignItems:"center", justifyContent:"center",width:"90%"}}>
                        <p>Join the club,  <a className="link" onClick={()=>navigate('/signup')}> Click here!</a> </p>
                    </div>
                </Col>
            </Row>
        </div>
    )
}