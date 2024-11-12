import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firestore, auth } from "../firebase";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Card,Button,Modal } from "react-bootstrap";
const IMAGE_URL='https://image.tmdb.org/t/p/w500/';
const API_KEY = 'a0aa117344e38c46e616b4af160b2d01';
import cast_profile from '../assets/cast.png'
import { StarRating } from "./MoviePage";
import '../CSS/Profile.css'

import deleteIcon from '../assets/trash.svg';
import editIcon from '../assets/pencil-square.svg';


export default function Profile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [myReviews, setMyReviews] = useState([]);
    
    //readmore
    const [selectedReview, setSelectedReview] = useState(null);
    const handleShow = (review) => {
        setSelectedReview(review);
    };

    const handleClose = () => {
        setSelectedReview(null);
    };

    //edit
    const [editReview,setEditReview] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const handleCloseEdit = () => setShowEdit(false);
    const [editedReview,setEditedReview] = useState("");
    const [editedRating,setEditedRating] = useState(0);
    const handleShowEdit = (review) => {
        setEditReview(review);
        setEditedReview(review?.content || "");
        setEditedRating(review?.author_details?.rating || 0); 
        setShowEdit(true);
    }

    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchReviewsFromFirestore = async () => {
            if (!currentUser) return; // Exit if currentUser is not defined
            const myReviewRef = doc(firestore, "users", currentUser.uid);
            const myReviewCollectionRef = collection(myReviewRef, "myReviews");

            const unsubscribe = onSnapshot(myReviewCollectionRef, (snapshot) => {
                const myReviewList = snapshot.docs.map((doc) => doc.data());
                setMyReviews(myReviewList);
            });
            return () => unsubscribe();
        };
        
        fetchReviewsFromFirestore();
    }, [currentUser]);

   
    const updateEditedReview = async(userID,ReviewID_Details,reviewContent,ratingValue)=>{
        try{
            const reviewDocRef = doc(firestore,"users",userID,"myReviews",ReviewID_Details.myReviewDoc_id);
            await updateDoc(reviewDocRef,{
                content:reviewContent,
                "author_details.rating":ratingValue,
            })

            const allReviewDocRef = doc(firestore,"movies",String(ReviewID_Details.author_details.movieID),"reviews",ReviewID_Details.allReviewDoc_id);
            await updateDoc(allReviewDocRef,{
                content:reviewContent,
                "author_details.rating":ratingValue,
            })
        }catch(error){
            console.error("Error updating review:", error);
        }
        handleCloseEdit()
    }

    const handleDelete = async(reviewDetails)=>{
        try{
            const reviewDocRef = doc(firestore,"users",currentUser.uid,"myReviews",reviewDetails.myReviewDoc_id);
            const allReviewDocRef = doc(firestore,"movies",String(reviewDetails.author_details.movieID),"reviews",reviewDetails.allReviewDoc_id);
            await deleteDoc(reviewDocRef);
            await deleteDoc(allReviewDocRef);
        }catch{
            console.error("Error deleting review:", error);
        }
    }

    return (
        <div style={{ marginLeft: "7rem", padding: "1rem", overflowY: "auto", height: "88vh", scrollbarWidth: "none" }}>
            <h4>My Reviews</h4>
            <div className="myReviews">
                {myReviews.map((review,index)=>{
                    return(
                        <Card key={index} className="review-card">
                            <Card.Body className="review-body">
                                <div className="review_div">
                                    <div className="heading_div">
                                        <img height={50} src={review.author_details.avatar_path ? IMAGE_URL+review.author_details.avatar_path : cast_profile} alt="" 
                                            onClick={() => handleUserClick(review.author_details.username)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <h6 style={{margin:"0rem",cursor:"pointer"}} onClick={() => handleUserClick(review.author_details.username)}>{review.author_details.name || review.author_details.username || "Anonymous"}</h6>
                                    </div>
                                    <StarRating rating={review.author_details.rating/2 || 0} />
                                    <p style={{margin:"0rem"}}>{review.content.length>75 ?review.content.substring(0,75)+'...':review.content}</p>
                                    <div className="buttons">
                                        <Button variant="primary" onClick={() => handleShow(review)}>Read more</Button>
                                        <img style={{backgroundColor:"#ffbd59"}} src={editIcon} alt="" onClick={()=>handleShowEdit(review)} />
                                        <img style={{backgroundColor:"#ff5757"}} src={deleteIcon} alt="" onClick={()=>handleDelete(review)}/>
                                    </div>
                                </div>
                                <img src={IMAGE_URL+review.author_details.poster_path} style={{height:"30vh"}} alt="" />
                            </Card.Body>
                        </Card>
                    )
                })}
            </div>

            {selectedReview && (
                <Modal show={true} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedReview.author_details.movieTitle} - Full Review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Reviewer:</strong> {selectedReview.author_details.name || selectedReview.author_details.username || "Anonymous"}</p>
                        <StarRating rating={selectedReview.author_details.rating / 2 || 0} />
                        <p>{selectedReview.content}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {editReview && 
                (<Modal show={showEdit} onHide={handleCloseEdit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Your Review Here</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <textarea onChange={(e)=>setEditedReview(e.target.value)} value={editedReview} style={{border:"none",outline:"none",borderBottom:"2px solid black",width:"100%",height:"20vh"}}></textarea>
                        <h6 style={{padding:"1rem 0rem"}}>Rating 
                            <input value={editedRating}
                                onChange={(event)=>{
                                    let rating=parseFloat(event.target.value)
                                    if (isNaN(rating)) rating = 0;
                                    rating = Math.max(0, Math.min(10, rating));
                                    event.target.value = rating;
                                    setEditedRating(rating);
                                }} style={{textAlign:"center",border:"none",outline:"none",width:"5rem", borderBottom:"2px solid black"}} type="number" min={0} max={10} step={0.5}/> out of 10</h6>
                                
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEdit}>
                            Close
                        </Button>

                        <Button variant="primary" onClick={()=>updateEditedReview(currentUser.uid,editReview,editedReview,editedRating)}>
                            Submit
                        </Button>
                        
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}
