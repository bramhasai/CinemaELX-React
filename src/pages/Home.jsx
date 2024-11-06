import React, { useEffect, useState } from "react";
import {Card } from "react-bootstrap";
import axios from "axios";
import signin from  '../assets/sign_img.png';
import '../CSS/Home.css'
import { useNavigate } from "react-router-dom";

const NOW_PLAYING ='https://api.themoviedb.org/3/movie/now_playing?api_key=a0aa117344e38c46e616b4af160b2d01&language=en-US&region=IN&page=1';
const POPULAR_MOVIES ='https://api.themoviedb.org/3/movie/popular?api_key=a0aa117344e38c46e616b4af160b2d01&language=en-US&region=IN&page=1';
const TOP_RATED ='https://api.themoviedb.org/3/movie/top_rated?api_key=a0aa117344e38c46e616b4af160b2d01&language=en-US&region=IN&page=1';
const UPCOMING_MOVIES ='https://api.themoviedb.org/3/movie/upcoming?api_key=a0aa117344e38c46e616b4af160b2d01&language=en-US&region=IN&page=1';

const IMAGE_URL='https://image.tmdb.org/t/p/w500/';

export default function Home(){
    const [now_playing_movies,setNowPlayingMovies] = useState([]);
    const [popular_movies,setPopularMovies] = useState([]);
    const [top_rated,setTopRated] = useState([]);
    const [upcoming_movies,setUpcomingMovies] = useState([]);

    const navigate = useNavigate();

    useEffect(()=>{
        axios.get(NOW_PLAYING).then((res)=>{
            setNowPlayingMovies(res.data.results);
        });

        axios.get(POPULAR_MOVIES).then((res)=>{
            setPopularMovies(res.data.results);
        });

        axios.get(TOP_RATED).then((res)=>{
            setTopRated(res.data.results);
        });

        axios.get(UPCOMING_MOVIES).then((res)=>{
            setUpcomingMovies(res.data.results);
        });
    },[])

    const handleClick = (movie)=>{
        navigate(`/movie-review/${movie.id}`,{state:movie});
    }


    return(
        <div style={{marginLeft:"7rem",padding:"1rem",overflowY:"auto",height:"88vh",scrollbarWidth:"none"}}>
            <div className="now_playing">
                <h5>Now Playing</h5>
                <div className="now_play_movies">
                    {now_playing_movies.map((movie)=>{
                        return(
                            <Card className="movie-card" key={movie.id} onClick={()=> handleClick(movie)}>
                                <Card.Img variant="top" src={IMAGE_URL+movie.poster_path} />
                                <Card.Body>
                                    <Card.Text style={{padding:"0.5rem 0rem",textAlign:"center"}}>
                                        {movie.title.length>=15?movie.title.substring(0, 15) + "..." :movie.title}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
            </div>

            <div className="popular_movies">
                <h5>Popular Movies</h5>
                <div className="now_play_movies">
                    {popular_movies.map((movie)=>{
                        return(
                            <Card className="movie-card" key={movie.id}>
                                <Card.Img variant="top" src={IMAGE_URL+movie.poster_path} />
                                <Card.Body>
                                    <Card.Text style={{padding:"0.5rem 0rem",textAlign:"center"}}>
                                        {movie.title.length>=15?movie.title.substring(0, 15) + "..." :movie.title}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
            </div>

            <div className="top_rated">
                <h5>Top Rated</h5>
                <div className="now_play_movies">
                    {top_rated.map((movie)=>{
                        return(
                            <Card className="movie-card" key={movie.id}>
                                <Card.Img variant="top" src={IMAGE_URL+movie.poster_path} />
                                <Card.Body>
                                    <Card.Text style={{padding:"0.5rem 0rem",textAlign:"center"}}>
                                        {movie.title.length>=15?movie.title.substring(0, 15) + "..." :movie.title}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
            </div>

            <div className="upcoming_movies">
                <h5>Upcoming Movies</h5>
                <div className="now_play_movies">
                    {upcoming_movies.map((movie)=>{
                        return(
                            <Card className="movie-card" key={movie.id}>
                                <Card.Img variant="top" src={IMAGE_URL+movie.poster_path}/>
                                <Card.Body>
                                    <Card.Text style={{padding:"0.5rem 0rem",textAlign:"center"}}>
                                        {movie.title.length>=15?movie.title.substring(0, 15) + "..." :movie.title}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
