import React, { useEffect, useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import './MovieManagement.css';

const MovieManagement = ({ setReloadTrigger }) => {
    const [movies, setMovies] = useState([]);
    const [movie, setMovie] = useState({
        id: '',
        title: '',
        release_date: '',
        poster_path: '',
        vote_average: 0,
        overview: '',
        genres: '',
        backdrop_path: '',
        popularity: 0
    });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchMoviesFromTMDB = async () => {
            try {
                const API_KEY = '09b9e98f843ea42cf69d6ff0c23d5736';
                const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
                const response = await fetch(url);
                const data = await response.json();

                if (data && data.results) {
                    const initialMovies = await Promise.all(
                        data.results.map(async (movie) => {
                            const movieDetailResponse = await fetch(
                                `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-US`
                            );
                            const movieDetail = await movieDetailResponse.json();

                            return {
                                id: movie.id,
                                title: movie.title,
                                release_date: movie.release_date,
                                poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                                vote_average: movie.vote_average,
                                overview: movieDetail.overview,
                                genres: movieDetail.genres.map((genre) => genre.name).join(', '),
                                backdrop_path: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
                                popularity: movie.popularity
                            };
                        })
                    );

                    setMovies(initialMovies);
                    localStorage.setItem('movies', JSON.stringify(initialMovies));
                } else {
                    console.error('Error fetching movies data:', data);
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        const storedMovies = JSON.parse(localStorage.getItem('movies'));
        if (storedMovies) {
            setMovies(storedMovies);
        } else {
            fetchMoviesFromTMDB();
        }
    }, []);

    const handleEdit = (movie) => {
        setMovie({
            ...movie,
            genres: Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres
        });
        setEditing(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMovie = { ...movie, genres: movie.genres.split(', ') };
        if (editing) {
            const updatedMovies = movies.map((m) => (m.id === movie.id ? newMovie : m));
            setMovies(updatedMovies);
            saveToLocalStorage(updatedMovies);
            setReloadTrigger((prev) => prev + 1);
            toast.success('Movie updated successfully!');
        } else {
            newMovie.id = new Date().getTime().toString();
            const updatedMovies = [...movies, newMovie];
            setMovies(updatedMovies);
            saveToLocalStorage(updatedMovies);
            setReloadTrigger((prev) => prev + 1);
            toast.success('Movie added successfully!');
        }
        setMovie({
            id: '',
            title: '',
            release_date: '',
            poster_path: '',
            vote_average: 0,
            overview: '',
            genres: '',
            backdrop_path: '',
            popularity: 0
        });
        setEditing(false);
    };

    const handleDelete = (id) => {
        const updatedMovies = movies.filter((m) => m.id !== id);
        setMovies(updatedMovies);
        saveToLocalStorage(updatedMovies);
        setReloadTrigger((prev) => prev + 1);
        toast.success('Movie deleted successfully!');
    };

    const saveToLocalStorage = (movies) => {
        localStorage.setItem('movies', JSON.stringify(movies));
        window.dispatchEvent(new Event('storage')); // Trigger storage event to notify other tabs/pages
    };

    return (
        <div className="container movie-management">
            <div className="header">
                <h2>Movie Management</h2>
                <Link to="/" className="btn btn-secondary">
                    Home
                </Link>
            </div>
            <Form onSubmit={handleSubmit} className="movie-form">
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" value={movie.title} onChange={(e) => setMovie({ ...movie, title: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="release_date">
                    <Form.Label>Release Date</Form.Label>
                    <Form.Control type="text" value={movie.release_date} onChange={(e) => setMovie({ ...movie, release_date: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="poster_path">
                    <Form.Label>Poster Path</Form.Label>
                    <Form.Control type="text" value={movie.poster_path} onChange={(e) => setMovie({ ...movie, poster_path: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="vote_average">
                    <Form.Label>Vote Average</Form.Label>
                    <Form.Control type="number" value={movie.vote_average} onChange={(e) => setMovie({ ...movie, vote_average: +e.target.value })} />
                </Form.Group>
                <Form.Group controlId="overview">
                    <Form.Label>Overview</Form.Label>
                    <Form.Control type="text" value={movie.overview} onChange={(e) => setMovie({ ...movie, overview: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="genres">
                    <Form.Label>Genres</Form.Label>
                    <Form.Control type="text" value={movie.genres} onChange={(e) => setMovie({ ...movie, genres: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="backdrop_path">
                    <Form.Label>Backdrop Path</Form.Label>
                    <Form.Control type="text" value={movie.backdrop_path} onChange={(e) => setMovie({ ...movie, backdrop_path: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="popularity">
                    <Form.Label>Popularity</Form.Label>
                    <Form.Control type="number" value={movie.popularity} onChange={(e) => setMovie({ ...movie, popularity: +e.target.value })} />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                    {editing ? 'Update Movie' : 'Add Movie'}
                </Button>
            </Form>

            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Release Date</th>
                        <th>Poster</th>
                        <th>Vote Average</th>
                        <th>Overview</th>
                        <th>Genres</th>
                        <th>Backdrop Path</th>
                        <th>Popularity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map((movie) => (
                        <tr key={movie.id}>
                            <td>{movie.title}</td>
                            <td>{movie.release_date}</td>
                            <td><img src={movie.poster_path} alt={movie.title} className="poster-img" /></td>
                            <td>{movie.vote_average}</td>
                            <td>{movie.overview}</td>
                            <td>{Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}</td>
                            <td>{movie.backdrop_path}</td>
                            <td>{movie.popularity}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(movie)} className="action-button">Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(movie.id)} className="action-button">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default MovieManagement;
