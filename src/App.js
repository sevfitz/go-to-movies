import React, { Component } from 'react';
import './App.css';
import { Movies } from './movies/Movies';

const API_KEY = process.env.REACT_APP_API_KEY;

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            movies: [],
            page: 1,
            loading: false,
            title: ''
        };
    }


    handleChange(event) {
        this.setState({
            title: event.target.value
        });
    }

    handleSubmit(event) {
        console.log('submitted was', this.state.title);
        this.fetchMovies(this.state.page, this.state.title);
        event.preventDefault();
    }

    fetchMovies(page, title) {
        console.log('title is', encodeURI(title));
        this.setState({
            loading: true,
            movies: []
        });

        fetch(`http://www.omdbapi.com/?s=${encodeURI(title)}&plot=short&r=json&page=${page}&apikey=${API_KEY}`)
            .then(res => res.json())
            .then(data => data.Search)
            .then(movies => {
                console.log('movies are', movies);
                if(movies) {
                    this.setState({
                        movies,
                        loading: false
                    });
                }
            });
    }

    handlePageChange(incr) {
        const page = Math.max(1, this.state.page + incr);
        this.setState({ page });
        this.fetchMovies(page);
    }

    render() {
        const { loading, movies } = this.state;
        if(loading) return <div>Loading...</div>;

        return (
            <div>
                <div>
                    <div style={{  }}>
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <label>
                                Search by Title:
                                <input type="text" name="title" style={{ width: '300px' }} value={this.state.title} onChange={this.handleChange.bind(this)} />
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                    <Movies movies={movies} />
                    <div>
                        <PagingButton label="Prev Page" incr={-1} onClick={this.handlePageChange.bind(this)} />
                        <PagingButton label="Next Page" incr={1} onClick={this.handlePageChange.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }
}

function PagingButton({ onClick, incr, label }) {
    return (
        <button onClick={() => onClick(incr)}>
            {label}
        </button>
    );
}

export default App;
