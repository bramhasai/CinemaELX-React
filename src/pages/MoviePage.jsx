import React, { useEffect, useState } from "react";
import '../CSS/MoviePage.css'
import { Row,Col,Button, Card, Modal, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const IMAGE_URL='https://image.tmdb.org/t/p/w500/';
const API_KEY = 'a0aa117344e38c46e616b4af160b2d01';
import cast_profile from '../assets/cast.png'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { firestore,auth } from "../firebase";
import { collection,addDoc,doc,getDoc,setDoc, getDocs,onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function StarRating({ rating }) {
    const getStarIcon = (index) => {
        if (rating >= index + 1) {
            return <FaStar key={index} color="#ffc107" />;
        } else if (rating >= index + 0.5) {
            return <FaStarHalfAlt key={index} color="#ffc107" />;
        } else {
            return <FaRegStar key={index} color="#ffc107" />;
        }
    };

    return (
        <div className="star-rating">
            {[0, 1, 2, 3, 4].map((index) => getStarIcon(index))}
        </div>
    );
}

export default function MoviePage(){
    const location = useLocation();
    const movie=location.state;
    const navigate=useNavigate();
    const [CastDetails,setCast]=useState([]);
    const [CrewDetails,setCrew]=useState([]);
    const [similarMovies,setSimilarMovies]=useState([]);
    const [reviews,setReviews] = useState([]);
    const [userReview,setUserReview] = useState({
        content:"",
        rating:0
    })

    // const [myReviews,setMyReviews] = useState([]); 

    const [currentUser,setCurrentUser] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchAndstoreReviews = async(firestore,movieId,reviews)=>{
        const movieRef = doc(firestore,"movies",movieId);
        const reviewCollectionRef = collection(movieRef,"reviews");
        reviews.forEach(async(review)=>{
            const reviewRef = doc(reviewCollectionRef,review.id);
            const reviewCheck = await getDoc(reviewRef);

            if(!reviewCheck.exists()){
                await setDoc(reviewRef,review);
                console.log(`Added review with ID: ${review.id}`)
            }
        })
    }

    useEffect(()=>{
        const unsubscribe= onAuthStateChanged(auth,(user)=>{
            if(user){
                setCurrentUser(user);
            }
            else{
                setCurrentUser(null);
            }
        })
        return ()=>unsubscribe();
    },[])


    useEffect(()=>{
        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}&language=en-US`).then((res)=>{        
            setCast(res.data.cast);
            setCrew(res.data.crew);
        })

        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/recommendations?api_key=${API_KEY}&language=en-US`).then((res)=>{
            setSimilarMovies(res.data.results);
        })
        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/reviews?api_key=${API_KEY}&language=en-US`).then(async(res) => {
            fetchAndstoreReviews(firestore,String(movie.id),res.data.results);
        })
    },[movie.id]);

    useEffect(()=>{
        const fetchReviewsFromFirestore = async ()=>{
            const movieRef = doc(firestore,"movies",String(movie.id));
            const reviewCollectionRef = collection(movieRef,"reviews");
            const unsubscribe = onSnapshot(reviewCollectionRef, (snapshot) => {
                const reviewList = snapshot.docs.map((doc) => doc.data());
                setReviews(reviewList);
            });
    
            // Cleanup listener on unmount
            return () => unsubscribe();
        }
        fetchReviewsFromFirestore();
    },[movie.id])


    const handleClick = (movie)=>{
        navigate(`/movie-review/${movie.id}`,{state:movie});
    }

    const handleReview =async ()=>{
        if(currentUser){
            if(userReview.rating>0 && userReview.content){
                const newReview = {
                    id:new Date().getTime().toString(),
                    author: currentUser.displayName || currentUser.email,
                    author_details:{
                        name:currentUser.displayName || currentUser.email,
                        username:currentUser.displayName || currentUser.email,
                        avatar_path: currentUser.photoURL || "",
                        rating: userReview.rating,
                        poster_path:movie.poster_path,
                        movieTitle:movie.title,
                        movieID:movie.id
                    },
                    content:userReview.content,
                    created_at: new Date().toISOString(),
                }
                setUserReview({content:"",rating:0})
                const movieRef = doc(firestore,"movies",String(movie.id));
                const reviewCollectionRef = collection(movieRef,"reviews");
                const reviewRefID= await addDoc(reviewCollectionRef,newReview);
                await updateDoc(reviewRefID,{reviewDoc_id: reviewRefID.id});

                const myReviewRef = doc(firestore,"users",currentUser.uid);
                const myReviewCollectionRef = collection(myReviewRef,"myReviews");
                const reviewDocRef=await addDoc(myReviewCollectionRef,newReview);
                await updateDoc(reviewDocRef,{
                    myReviewDoc_id: reviewDocRef.id,
                    allReviewDoc_id:reviewRefID.id,
                });
                handleClose();
            }            
        } 
    }

    return(
        <div className="movie-page-div">
            <Row className="row_movie_page" >
                <Col className="movie-page-col-1"> 
                    <img className="poster" src={IMAGE_URL+movie.poster_path} alt="" />
                    <h5 style={{margin:"1rem 0rem"}}>{movie.title}</h5>
                    <Button variant="primary" className="ReviewPost" onClick={handleShow}>Post Review</Button>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Write Your Review Here</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <textarea onChange={(e)=>setUserReview({...userReview,content:e.target.value})} style={{border:"none",outline:"none",borderBottom:"2px solid black",width:"100%",height:"20vh"}}></textarea>
                            <h6 style={{padding:"1rem 0rem"}}>Rating <input onChange={(event)=>{
                                let rating = parseFloat(event.target.value);
                                if (isNaN(rating)) rating = 0;
                                rating = Math.max(0, Math.min(10, rating));
                                event.target.value = rating;
                                setUserReview({...userReview,rating});
                            }} style={{textAlign:"center",border:"none",outline:"none",width:"5rem", borderBottom:"2px solid black"}} type="number" min={0} max={10} step={0.5}/> out of 10</h6>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleReview}>
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <h6 style={{margin:"1rem 0rem 0.5rem"}}>Movie Overview :</h6>
                    <p>{movie.overview}</p>
                    <h6 style={{margin:"1rem 0rem 0.5rem"}}>Cast</h6>
                    <div className="CastCrew">
                        {CastDetails.map((cast,index)=>{
                            return(
                                <div className="Cast" key={index}>
                                    <img src={cast.profile_path ? IMAGE_URL + cast.profile_path : cast_profile} alt={cast.name || 'Cast member'} />
                                    <p>{cast.name}</p>
                                </div>
                            )
                        })}
                    </div>
                    <h6 style={{margin:"0.5rem 0rem 0.5rem"}}>Crew</h6>
                    <div className="CastCrew">
                        {CrewDetails.map((crew,index)=>{
                            return(
                                <div className="Cast" key={index}>
                                    <img src={crew.profile_path?IMAGE_URL+crew.profile_path: cast_profile} alt={crew.name || 'Crew member'} />
                                    <p>{crew.name}</p>
                                </div>
                            )
                        })}
                    </div>
                    <h6 style={{margin:"1rem 0rem 0.5rem"}}>Recommendations</h6>
                    <div className="similar_movies">
                        {similarMovies.map((movie,index)=>{
                            return(
                                <Card className="similar_movie" key={index} onClick={()=> handleClick(movie)}>
                                    <Card.Img variant="top" src={IMAGE_URL+movie.poster_path} />
                                    <Card.Body className="similar_cardbody" style={{padding:"0.5rem 0rem"}}>
                                        <Card.Text style={{textAlign:"center",fontSize:"0.8rem"}}>
                                            {movie.title.length>13?movie.title.substring(0, 13) + "..." :movie.title}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </div>
                    
                </Col>
                <Col className="movie-page-col-2"> 
                    <h5><i>Reviews By Cinema ELK Users</i></h5>
                    {reviews.length > 0 ? (
                        <div className="reviews">
                            {reviews.map((review,index)=>{
                                return(
                                    <div key={index} className="review">
                                        <div className="review_div">
                                            <div className="review_name">
                                                <img height={40} width={40} src={review.author_details.avatar_path ? IMAGE_URL+review.author_details.avatar_path : cast_profile} alt="" />
                                                <h6>{review.author_details?.name || review.author_details?.username || "Anonymous"}</h6>
                                            </div>
                                            <StarRating rating={review.author_details.rating/2 || 0} />
                                        </div>
                                        <p style={{padding:"0.5rem 0.2rem 0rem 0.7rem", marginBottom:"1rem"}}>{review.content}</p>
                                    </div>
                                )
                            })}
                        </div>
                        ) : (
                            <h6>No reviews posted</h6>
                        )}
                </Col>
            </Row>
        </div>
    )
}