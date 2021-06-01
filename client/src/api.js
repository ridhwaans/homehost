import axios from "axios"

export async function searchMoviesBy(text, page = 1) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/watch/search?q=${text}`)
        .then(function (response) {
            return response.data

        })
}

export async function searchMusicBy(text, page = 1) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/listen/search?q=${text}`)
        .then(function (response) {
            return response.data

        })
}

export async function getMovieInformation(id) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/movies/${id}`)
        .then(function (response) {
            return response.data

        })
}

export async function getRandomMovie() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/movies/random`)
        .then(function (response) {
            return response.data

        })
}


export async function getMovieGenres() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/movies/genres`)
        .then(function (response) {
            return response.data

        })
}

export async function getMoviesByGenre(genre) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/movies/genres/${genre}`)
        .then(function (response) {
            return response.data

        })
}


export async function getMoviesBy(type) {

    let discover = null

    switch (type) {
        case "most_popular":
            discover = `${process.env.REACT_APP_HOMEHOST_API}/movies/most_popular`
            break;
        case "highest_rated":
            discover = `${process.env.REACT_APP_HOMEHOST_API}/movies/highest_rated`
            break;
        case "recently_added":
            discover = `${process.env.REACT_APP_HOMEHOST_API}/movies/recently_added`
            break;
        default:

    }

    return await axios.get(discover)
        .then(function (response) {
            return response.data

        })
}


export async function getTVShowInformation(id) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/tv/${id}`)
        .then(function (response) {
            return response.data

        })
}

export async function getRandomTVShow() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/tv/random`)
        .then(function (response) {
            return response.data

        })
}


export async function getTVShowGenres() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/tv/genres`)
        .then(function (response) {
            return response.data

        })
}

export async function getTVShowsByGenre(genre) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/tv/genres/${genre}`)
        .then(function (response) {
            return response.data

        })
}


export async function getTVShowsBy(type) {

    let discover = null

    switch (type) {
        case "most_popular":
            discover = `${process.env.REACT_APP_HOMEHOST_API}/tv/most_popular`
            break;
        case "highest_rated":
            discover = `${process.env.REACT_APP_HOMEHOST_API}/tv/highest_rated`
            break;
        case "recently_added":
            discover = `${process.env.REACT_APP_HOMEHOST_API}/tv/recently_added`
            break;
        default:

    }

    return await axios.get(discover)
        .then(function (response) {
            return response.data

        })
}

export async function getAllAlbums() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/music/albums`)
        .then(function (response) {
            return response.data

        })
}

export async function getAllArtists() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/music/artists`)
        .then(function (response) {
            return response.data

        })
}

export async function getAllSongs() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/music/songs`)
        .then(function (response) {
            return response.data

        })
}

export async function getAlbumInformation(id) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_API}/music/albums/${id}`)
        .then(function (response) {
            return response.data

        })
}

export async function getMusicBy(type) {

    let discover = null

    switch (type) {
        case "recently_added":
            discover = `${process.env.REACT_APP_HOMEHOST_API}/music/recently_added`
            break;
        default:

    }

    return await axios.get(discover)
        .then(function (response) {
            return response.data

        })
}