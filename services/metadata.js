const {Album, Movie, TVEpisode, TVShow} = require('../models');
const axios = require('axios');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

class Metadata {
    constructor () {}

    get(item){
        let request_url;
        if (item instanceof Movie){
            request_url = `https://${process.env.MOVIES_API}/movie/${item.id}?api_key=${process.env.MOVIES_KEY}&append_to_response=images,credits,similar`
        } else if (item instanceof TVShow) {
            request_url = `https://${process.env.TV_API}/tv/${item.id}?api_key=${process.env.TV_KEY}`
        } else if (item instanceof TVEpisode) {
            request_url = `https://${process.env.TV_API}/tv/${item.tv_id}/season/${item.season_number}/episode/${item.episode_number}?api_key=${process.env.TV_KEY}`
        } else if (item instanceof Album) {
            request_url = `https://${process.env.MUSIC_API}/albums/${item.id}?access_token=${process.env.MUSIC_KEY}` // authorization header
        }

        console.log('url: ' + request_url); 
        return wait(250).then(() => axios.get(request_url)
            .then((response) => {
                return response.data;
            })
        )
        
    }
}

module.exports = Metadata;