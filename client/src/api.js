import axios from "axios"

const API = "api_key=129c09bb93839f3653b2510e55744d9f"
const URL = "https://api.themoviedb.org/3/"
const HOMEHOST_API = "http://localhost:5000/api"
export const IMAGE_BASE = "https://image.tmdb.org/t/p/"

export async function searchMoviesBy(text, page = 1) {

    return await axios.get(`${URL}search/movie?${API}&language=en-US&query=${text}&page=${page}&include_adult=false`)

}

export async function getMovieInformation(id) {

    return await axios.get(`${HOMEHOST_API}/movies/${id}`)
        .then(function (response) {
            return response.data

        })
}

export async function getRandomMovie() {

    return await axios.get(`${HOMEHOST_API}/movies/random`)
        .then(function (response) {
            return response.data

        })
}


export async function getMovieGenres() {

    return await axios.get(`${HOMEHOST_API}/movies/genres`)

}

export async function getMoviesByGenre(genre) {

    return await axios.get(`${HOMEHOST_API}/movies/genres/${genre}`)
        .then(function (response) {
            return response.data

        })
}


export async function getMoviesBy(type) {

    let discover = null

    switch (type) {
        case "most_popular":
            discover = `${HOMEHOST_API}/movies/most_popular`
            break;
        case "highest_rated":
            discover = `${HOMEHOST_API}/movies/highest_rated`
            break;
        case "recently_added":
            discover = `${HOMEHOST_API}/movies/recently_added`
            break;
        default:

    }


    return await axios.get(discover)
        .then(function (response) {
            return response.data

        })


}