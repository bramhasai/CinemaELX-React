import React, { useState } from "react";
import { Row,Col } from "react-bootstrap";
import {Button,Form,Card} from 'react-bootstrap';

import sign_img from '../assets/sign_img.png';
import '../CSS/Signin.css';
import { useNavigate } from "react-router-dom";

<style>
    @import url('https://fonts.googleapis.com/css2?family=Shrikhand&display=swap');
</style>
export default function Signup(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = ()=>{
        alert("Hello login");
    }

    return(
        <div style={{height:"100vh",padding:"0rem", margin:"0rem",color:"white",backgroundColor:"#f15a24"}}>
            <Row className="sign_page">
                <Col style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <img src={sign_img} alt="" />
                </Col>
                <Col style={{width:"90%"}}>
                    <h2 style={{fontFamily:"Shrikhand", fontStyle:"italic",fontSize:"4rem"}}>CINEMA ELK</h2>
                    <Card>
                        <Card.Body>
                            <Form className="signin_form">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control type="email" placeholder="Enter email address" onChange={(e)=>setEmail(e.target.value)}/>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Control type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                                </Form.Group>
                            </Form>
                            <Form style={{width:"100%"}}>
                                <Form.Group style={{width:"100%"}} className="mb-3" controlId="formBasicEmail">
                                    <Form.Control style={{width:"90%",margin:"0rem 0rem 1rem"}} type="text" placeholder="Enter Full  Name" onChange={(e)=>setEmail(e.target.value)}/>
                                </Form.Group>
                            </Form>
                            <Button onClick={handleLogin} className="signin_button" variant="primary" type="submit">
                                Join the club
                            </Button>
                        </Card.Body>
                    </Card>
                    <div style={{marginTop:"1rem",display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <p>Already a member?  <a className="link" onClick={()=>navigate('/signin')}> Click here!</a> </p>
                    </div>
                </Col>
            </Row>
        </div>
    )
}