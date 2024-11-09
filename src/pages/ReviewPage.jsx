import React, { useEffect, useMemo, useState } from "react";
import { Card,Button,Modal } from "react-bootstrap";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
const IMAGE_URL='https://image.tmdb.org/t/p/w500/';
const API_KEY = 'a0aa117344e38c46e616b4af160b2d01';
const NOW_PLAYING ='https://api.themoviedb.org/3/movie/now_playing?api_key=a0aa117344e38c46e616b4af160b2d01&language=en-US&region=IN&page=1';
const POPULAR_MOVIES ='https://api.themoviedb.org/3/movie/popular?api_key=a0aa117344e38c46e616b4af160b2d01&language=en-US&region=IN&page=1';
const TOP_RATED ='https://api.themoviedb.org/3/movie/top_rated?api_key=a0aa117344e38c46e616b4af160b2d01&language=en-US&region=IN&page=1';

import cast_profile from '../assets/cast.png'
import '../CSS/ReviewPage.css'
import { StarRating } from "./MoviePage";
// function StarRating({ rating }) {
//     const getStarIcon = (index) => {
//         if (rating >= index + 1) {
//             return <FaStar key={index} color="#ffc107" />;
//         } else if (rating >= index + 0.5) {
//             return <FaStarHalfAlt key={index} color="#ffc107" />;
//         } else {
//             return <FaRegStar key={index} color="#ffc107" />;
//         }
//     };

//     return (
//         <div className="star-rating">
//             {[0, 1, 2, 3, 4].map((index) => getStarIcon(index))}
//         </div>
//     );
// }

export default function ReviewPage(){
    const [moviesList,setMoviesList] = useState([]);
    const [reviewsList,setReviewsList] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [displayReviews, setDisplayReviews] = useState([]);

    const handleShow = (review) => {
        setSelectedReview(review);
    };

    const handleClose = () => {
        setSelectedReview(null);
    };

    useEffect(()=>{
         axios.get(NOW_PLAYING).then((res)=>{
            setMoviesList((prevList)=>[...prevList,...res.data.results]);
        });

         axios.get(POPULAR_MOVIES).then((res)=>{
            setMoviesList((prevList)=>[...prevList,...res.data.results]);
        });

         axios.get(TOP_RATED).then((res)=>{
            setMoviesList((prevList)=>[...prevList,...res.data.results]);
        });
    },[])

    useEffect(()=>{
        if(moviesList.length>0){
            moviesList.forEach((movie)=>{
                axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/reviews?api_key=${API_KEY}&language=en-US`).then((res)=>{
                    const newReviews = res.data.results.map((review) => ({
                        ...review,
                        moviePoster: movie.poster_path,
                        movieTitle: movie.title,
                    }));
                    setReviewsList((prevReviews) => {
                        const uniqueReviews = newReviews.filter(
                            (newReview) => !prevReviews.some((existingReview) => existingReview.id === newReview.id)
                        );
                        return [...prevReviews, ...uniqueReviews];
                    });
                })
            })
        }
    },[moviesList])

    const initialReviews = useMemo(() => {
        const shuffled = [...reviewsList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 100);
    }, [reviewsList]);

    useEffect(() => {
        setDisplayReviews(initialReviews);
    }, [initialReviews]);

    const handleUserClick = (username) => {
        setSelectedUser(username);
        setDisplayReviews(reviewsList.filter(review => review.author_details.username === username));
    }

    const handleBackClick = () => {
        setSelectedUser(null);
        setDisplayReviews(initialReviews);
    };
    

    return(
        <div className="reviews_div" style={{marginLeft:"7rem",padding:"1rem",overflowY:"auto",height:"88vh",scrollbarWidth:"none"}}>
            {selectedUser && (
                <Button variant="secondary" onClick={handleBackClick} style={{ marginBottom: "1rem" }}>
                   Back to Random Reviews
                </Button>
            )}
            {displayReviews.map((review,index)=>{
                console.log(review)
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
                                <Button variant="primary" onClick={() => handleShow(review)}>Read more</Button>
                            </div>
                            <img src={IMAGE_URL+review.moviePoster} style={{height:"30vh"}} alt="" />
                        </Card.Body>
                    </Card>
                )
            })}

            {selectedReview && (
                <Modal show={true} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedReview.movieTitle} - Full Review</Modal.Title>
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
        </div>
    )
}