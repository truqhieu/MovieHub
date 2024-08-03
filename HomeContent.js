import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './HomeContent.css';
import { Link, useNavigate } from 'react-router-dom';

const HomeContent = ({ reloadTrigger }) => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [newMovies, setNewMovies] = useState([]);
    const [newSeries, setNewSeries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
    const navigate = useNavigate();

    const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&release_date.lte=${today}&sort_by=popularity.desc`;
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOWI5ZTk4Zjg0M2VhNDJjZjY5ZDZmZjBjMjNkNTczNiIsIm5iZjY2OGUwN2VkMmNkODFlOWI2Nzk1NTZmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gKNlX0MNuyhEOViGrTUGlr72yjsTyjq-tLRZ02cDUg4'
                    }
                };

                const response = await fetch(url, options);
                const data = await response.json();
                if (data && data.results) {
                    const filteredMovies = data.results.filter(movie => movie.title && movie.poster_path);
                    setPopularMovies(filteredMovies.slice(0, 10)); // Set popular movies
                    setNewMovies(filteredMovies.slice(10, 20)); // Set new movies
                    localStorage.setItem('movies', JSON.stringify(filteredMovies)); // Save to local storage
                } else {
                    console.error("Error fetching movie data:", data);
                }
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        const storedMovies = JSON.parse(localStorage.getItem('movies'));
        if (storedMovies) {
            const filteredMovies = storedMovies.filter(movie => movie.title && movie.poster_path);
            setPopularMovies(filteredMovies.slice(0, 10)); // Get popular movies from local storage
            setNewMovies(filteredMovies.slice(10, 20)); // Get new movies from local storage
        } else {
            fetchMovies();
        }
    }, [reloadTrigger, today]);

    useEffect(() => {
        const fetchNewSeries = async () => {
            try {
                const url = `https://api.themoviedb.org/3/discover/tv?air_date.gte=${today}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc`;
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOWI5ZTk4Zjg0M2VhNDJjZjY5ZDZmZjBjMjNkNTczNiIsIm5iZjY2OGUwN2VkMmNkODFlOWI2Nzk1NTZmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gKNlX0MNuyhEOViGrTUGlr72yjsTyjq-tLRZ02cDUg4'
                    }
                };

                const response = await fetch(url, options);
                const data = await response.json();
                if (data && data.results) {
                    setNewSeries(data.results);
                    localStorage.setItem('series', JSON.stringify(data.results)); // Save to local storage
                } else {
                    console.error("Error fetching series data:", data);
                }
            } catch (error) {
                console.error("Error fetching series:", error);
            }
        };

        const storedSeries = JSON.parse(localStorage.getItem('series'));
        if (storedSeries) {
            setNewSeries(storedSeries); // Get new series from local storage
        } else {
            fetchNewSeries();
        }
    }, [reloadTrigger, today]);

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 9 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`/search/${searchQuery}`);
        }
    };

    return (
        <div className="container-fluid home-content-container" id='container'>
            <div className='search-container'>
                <h1 style={{ fontWeight: 'bold' }}>Welcome to MOVIE<span className='text-warning'>HUB</span></h1>
                <h3 style={{ fontWeight: 'bold' }}>Millions of movies, TV shows and people to discover. Explore now.</h3>
                <br></br>
                <form className="form" style={{ width: '80%' }} onSubmit={handleSearch}>
                    <div className="input-group">
                        <input type="text" className="form-control" style={{ backgroundColor: '#0e1f23', color: 'white' }} placeholder="Search for movies, series, episodes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <div className="input-group-append">
                            <button type='submit' className="btn btn-warning"><i className="fa fa-search"></i></button>
                        </div>
                    </div>
                </form>
            </div>

            <section className="section popular-courses" style={{ marginTop: "30px" }}>
                <div className="container">
                    <div className="section-header aos" data-aos="fade-up">
                        <h2 className='text-warning' style={{fontWeight:'bold'}}>TRENDING MOVIES</h2>
                    </div>
                    <hr></hr>
                    <Carousel responsive={responsive}>
                        {popularMovies.map((movie) => (
                            <div data-aos="fade-up" style={{ scale: "90%" }} key={movie.id}>
                                <div className="movie">
                                    <div className="movie-img" >
                                        <Link to={`/details/${movie.id}`}>
                                            <img className="img-fluid" src={`${tmdbImageBaseUrl}${movie.poster_path}`} onError={(e) => {
                                                e.target.src = 'https://image.tmdb.org/t/p/w500/uS1AIL7I1Ycgs8PTfqUeN6jYNsQ.jpg';
                                            }} alt={movie.title}></img>
                                        </Link>
                                    </div>
                                    <div className="top" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px" }}>
                                        <h5 className="text-warning"><Link className="text-warning" to={`/details/${movie.id}`}>{movie.title}</Link></h5>
                                    </div>
                                    <div className="bottom">
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", listStyleType: "none" }}>
                                            <div><i className="far fa-clock"></i> {movie.release_date}</div>
                                            <span className="rating text-warning"><i className="fas fa-thumbs-up"></i> {movie.vote_average}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>

                    <hr></hr>
                    <div className="section-header aos" data-aos="fade-up">
                        <h2 className='text-warning' style={{fontWeight:'bold'}}>NEW MOVIES</h2>
                    </div>
                    <hr></hr>
                    <Row className='newMovie'>
                        {newMovies.map((movie) => (
                            <Col md={3} key={movie.id}>
                                <div data-aos="fade-up " style={{ scale: "90%" }}>
                                    <div className="movie">
                                        <div className="movie-img" >
                                            <Link to={`/details/${movie.id}`}>
                                                <img className="img-fluid" src={`${tmdbImageBaseUrl}${movie.poster_path}`} onError={(e) => {
                                                    e.target.src = 'https://image.tmdb.org/t/p/w500/uS1AIL7I1Ycgs8PTfqUeN6jYNsQ.jpg';
                                                }} alt={movie.title}></img>
                                            </Link>
                                        </div>
                                        <div className="top" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px" }}>
                                            <h5 className="text-warning"><Link className="text-warning" to={`/details/${movie.id}`}>{movie.title}</Link></h5>
                                        </div>
                                        <div className="bottom">
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", listStyleType: "none" }}>
                                                <div><i className="far fa-clock"></i> {movie.release_date}</div>
                                                <span className="rating text-warning"><i className="fas fa-thumbs-up"></i> {movie.vote_average}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    <hr></hr>
                    <br></br>
                    <div className="section-header aos" data-aos="fade-up">
                        <h2 className='text-warning' style={{fontWeight:'bold'}}>NEW TV SHOWS</h2>
                    </div>
                    <hr></hr>
                    <Row>
                        {newSeries.map((movie) => (
                            <Col md={4} key={movie.id}>
                                <div data-aos="fade-up" style={{ scale: "90%" }}>
                                    <div className="movie">
                                        <div className="movie-img">
                                            <Link to={`/details/${movie.id}`}>
                                                <img className="img-fluid" src={`${tmdbImageBaseUrl}${movie.poster_path}`} onError={(e) => {
                                                    e.target.src = 'https://image.tmdb.org/t/p/w500/uS1AIL7I1Ycgs8PTfqUeN6jYNsQ.jpg';
                                                }} alt={movie.name}></img>
                                            </Link>
                                        </div>
                                        <div className="top" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px" }}>
                                            <h5 className="text-warning"><Link className="text-warning" to={`/details/${movie.id}`}>{movie.name}</Link></h5>
                                        </div>
                                        <div className="bottom">
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", listStyleType: "none" }}>
                                                <div><i className="far fa-clock"></i> {movie.first_air_date}</div>
                                                <span className="rating text-warning"><i className="fas fa-thumbs-up"></i> {movie.vote_average}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>
        </div>
    );
}

export default HomeContent;
