import React, { useState } from "react";
import { Row,Col } from "react-bootstrap";
import {Button,Form,Card} from 'react-bootstrap';

import sign_img from '../assets/sign_img.png';
import '../CSS/Signin.css';
import { useNavigate } from "react-router-dom";


// authentiation imports
import  {auth}  from "../firebase";
import { signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";

export default function Signin(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();

    async function handleLogin(){
        try{
            const userCredentials = await signInWithEmailAndPassword(auth,email,password);
            const user = userCredentials.user;
            // if(!user.emailVerified){
            //     alert("Please verify your email");
            //     await auth.signOut();
            //     return;
            // }
            navigate('/')
        }catch(err){
            setError("Login failed: "+err.message);
        }
    }

    async function handleForgotPassword(){
        try{
            await sendPasswordResetEmail(auth,email);
            alert("Password reset email sent. Please check your inbox.")
        }catch(err){
            setError("Error: " + err.message);
        }
    }

    return(
        <div style={{color:"white",backgroundColor:"#f15a24",width:"100%",height:"100vh"}}>
            <Row className="sign_page_row">
                <Col className="signCol-1">
                    <img src={sign_img} alt="" />
                </Col>
                <Col className="signCol-2">
                    <h2 style={{fontFamily:"Shrikhand", fontStyle:"italic"}}>CINEMA ELK</h2>
                    <Card style={{backgroundColor:'#f15a24',border:"none"}}>
                        <Card.Body className="sign-card-body">
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
                            
                            {error && <p style={{ color: "black",marginBottom:"0rem",marginTop:"0.5rem",textAlign:"center" }}>{error}</p>}
                        </Card.Body>
                    </Card>
                    <div className="bottom_sign">
                            <Button onClick={handleForgotPassword}  variant="link" style={{ color: "white",border:"none",width:"auto"}}>
                                Forgot Password?
                            </Button>
                            <p style={{marginBottom:"0rem"}}>Join the club,  <a className="link" onClick={()=>navigate('/signup')}> Click here!</a> </p>
                    </div>
                </Col>
            </Row>
        </div>
    )
}