const {Album, Movie, TVEpisode, TVShow} = require('../models');
const axios = require('axios');
var fs = require('fs');
var yaml = require('js-yaml');
var config = yaml.load(fs.readFileSync('./config.yml'));

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

class Metadata {
    constructor () {}

    get(item){
        let request_url;
        if (item instanceof Movie){
            request_url = `https://${config.movies.api}/movie/${item.id}?api_key=${config.movies.key}`
        } else if (item instanceof TVShow) {
            request_url = `https://${config.tv.api}/tv/${item.id}?api_key=${config.tv.key}`
        } else if (item instanceof TVEpisode) {
            request_url = `https://${config.tv.api}/tv/${item.tv_id}/season/${item.season_number}/episode/${item.episode_number}?api_key=${config.tv.key}`
        } else if (item instanceof Album) {
            request_url = `https://${config.music.api}/albums/${item.id}?access_token=${config.music.key}` // authorization header
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