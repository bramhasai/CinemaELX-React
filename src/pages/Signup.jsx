import React, { useState } from "react";
import { Row,Col } from "react-bootstrap";
import {Button,Form,Card} from 'react-bootstrap';

import sign_img from '../assets/sign_img.png';
import '../CSS/Signin.css';
import { useNavigate } from "react-router-dom";

// authentiation imports
import { auth,firestore } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc,setDoc } from "firebase/firestore";

<style>
    @import url('https://fonts.googleapis.com/css2?family=Shrikhand&display=swap');
</style>
export default function Signup(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [fullname,setFullname]=useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSignup(){
        try{
            const userCredentials = await createUserWithEmailAndPassword(auth,email,password);
            const user = userCredentials.user;
            // await sendEmailVerification(user);
            // alert("Verification email sent. Please check your inbox to verify your email.");
            // setError("Please verify your email before logging in.");

            await setDoc(doc(firestore,"users",user.uid),{
                uid:user.uid,
                email:user.email,
                fullname,
            });
            await updateProfile(user,{
                displayName:fullname,
            })
            navigate('/');
        }catch(err){
            console.error("Error during signup:", err.message);
            setError("Signup failed. " + err.message);
        }
    }

    return(
        <div style={{height:"100vh",padding:"0rem", margin:"0rem",color:"white",backgroundColor:"#f15a24"}}>
            <Row className="sign_page_row">
                <Col style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <img src={sign_img} alt="" />
                </Col>
                <Col style={{width:"90%"}}>
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
                            <Form style={{width:"100%"}}>
                                <Form.Group style={{width:"100%"}} className="mb-3" controlId="formBasicEmail">
                                    <Form.Control style={{width:"90%",margin:"0rem 0rem 1rem"}} type="text" placeholder="Enter Fullname" onChange={(e)=>setFullname(e.target.value)}/>
                                </Form.Group>
                            </Form>
                            <Button onClick={handleSignup} className="signin_button" variant="primary" type="submit">
                                Join the club
                            </Button>
                            {error && <p style={{ color: "black" }}>{error}</p>}
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