import React, { useEffect, useState } from "react";
import '../CSS/MoviePage.css'
import { Row,Col,Button, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const IMAGE_URL='https://image.tmdb.org/t/p/w500/';
import cast_profile from '../assets/cast.png'

export default function MoviePage(){
    const location = useLocation();
    const movie=location.state;
    const navigate=useNavigate();
    const [CastDetails,setCast]=useState([]);
    const [CrewDetails,setCrew]=useState([]);
    const [similarMovies,setSimilarMovies]=useState([]);
    console.log(movie)
    useEffect(()=>{
        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=a0aa117344e38c46e616b4af160b2d01&language=en-US`).then((res)=>{        
            setCast(res.data.cast);
            setCrew(res.data.crew);
        })

        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=a0aa117344e38c46e616b4af160b2d01&language=en-US`).then((res)=>{
            setSimilarMovies(res.data.results);
        })
    },[]);

    const handleClick = (movie)=>{
        navigate(`/movie-review/${movie.id}`,{state:movie});
    }

    return(
        <div style={{marginLeft:"7rem",padding:"1rem",overflowY:"auto",height:"88vh",scrollbarWidth:"none"}}>
            <Row style={{display:"grid",gridTemplateColumns:"50% 50%", scrollbarWidth:"none"}}>
                <Col style={{borderRight:"2px solid gray"}}> 
                    <img src={IMAGE_URL+movie.poster_path} height={350} width={300} alt="" />
                    <h5 style={{margin:"1rem 0rem"}}>{movie.title}</h5>
                    <Button variant="primary" className="ReviewPost">Post Review</Button>
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
                    <h6 style={{margin:"1rem 0rem 0.5rem"}}>Crew</h6>
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
                    <h6 style={{margin:"1rem 0rem 0.5rem"}}>Similar Movies</h6>
                    <div className="similar_movies">
                        {similarMovies.map((movie,index)=>{
                            return(
                                <Card className="similar_movie" key={index} onClick={()=> handleClick(movie)}>
                                    <Card.Img variant="top" src={IMAGE_URL+movie.poster_path} />
                                    <Card.Body>
                                        <Card.Text style={{padding:"0.5rem 0rem",textAlign:"center",fontSize:"0.8rem"}}>
                                            {movie.title.length>=18?movie.title.substring(0, 18) + "..." :movie.title}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </div>
                    
                </Col>
                <Col> </Col>
            </Row>
        </div>
    )
}