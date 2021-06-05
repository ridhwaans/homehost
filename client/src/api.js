import axios from "axios"

export async function searchMoviesBy(text, page = 1) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/watch/search?q=${text}`)
        .then(function (response) {
            return response.data

        })
}

export async function searchMusicBy(text, page = 1) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/listen/search?q=${text}`)
        .then(function (response) {
            return response.data

        })
}

export async function getBillboardItem() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/watch/billboard`)
        .then(function (response) {
            return response.data

        })
}

export async function getMovieInformation(id) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/movies/${id}`)
        .then(function (response) {
            return response.data

        })
}

export async function getRandomMovie() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/movies/random`)
        .then(function (response) {
            return response.data

        })
}


export async function getMovieGenres() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/movies/genres`)
        .then(function (response) {
            return response.data

        })
}

export async function getMoviesByGenre(genre) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/movies/genres/${genre}`)
        .then(function (response) {
            return response.data

        })
}


export async function getMoviesBy(type) {

    let discover = null

    switch (type) {
        case "most_popular":
            discover = `${process.env.REACT_APP_HOMEHOST_BASE}/api/movies/most_popular`
            break;
        case "highest_rated":
            discover = `${process.env.REACT_APP_HOMEHOST_BASE}/api/movies/highest_rated`
            break;
        case "recently_added":
            discover = `${process.env.REACT_APP_HOMEHOST_BASE}/api/movies/recently_added`
            break;
        default:

    }

    return await axios.get(discover)
        .then(function (response) {
            return response.data

        })
}


export async function getTVShowInformation(id) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/tv/${id}`)
        .then(function (response) {
            return response.data

        })
}

export async function getRandomTVShow() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/tv/random`)
        .then(function (response) {
            return response.data

        })
}


export async function getTVShowGenres() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/tv/genres`)
        .then(function (response) {
            return response.data

        })
}

export async function getTVShowsByGenre(genre) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/tv/genres/${genre}`)
        .then(function (response) {
            return response.data

        })
}


export async function getTVShowsBy(type) {

    let discover = null

    switch (type) {
        case "most_popular":
            discover = `${process.env.REACT_APP_HOMEHOST_BASE}/api/tv/most_popular`
            break;
        case "highest_rated":
            discover = `${process.env.REACT_APP_HOMEHOST_BASE}/api/tv/highest_rated`
            break;
        case "recently_added":
            discover = `${process.env.REACT_APP_HOMEHOST_BASE}/api/tv/recently_added`
            break;
        default:

    }

    return await axios.get(discover)
        .then(function (response) {
            return response.data

        })
}

export async function getAllAlbums() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/music/albums`)
        .then(function (response) {
            return response.data

        })
}

export async function getAllArtists() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/music/artists`)
        .then(function (response) {
            return response.data

        })
}

export async function getAllSongs() {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/music/songs`)
        .then(function (response) {
            return response.data

        })
}

export async function getAlbumInformation(id) {

    return await axios.get(`${process.env.REACT_APP_HOMEHOST_BASE}/api/music/albums/${id}`)
        .then(function (response) {
            return response.data

        })
}

export async function getMusicBy(type) {

    let discover = null

    switch (type) {
        case "recently_added":
            discover = `${process.env.REACT_APP_HOMEHOST_BASE}/api/music/recently_added`
            break;
        default:

    }

    return await axios.get(discover)
        .then(function (response) {
            return response.data

        })
}