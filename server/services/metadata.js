const axios = require('axios');
const Cookies  = require('universal-cookie');
const qs = require('qs');
const { Type } = require('../constants');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const cookies = new Cookies();

class Metadata {
    constructor () {}

    async get(item, delay=0){
        let request_url
        let auth
        
        if (item.type in Type.Music){
            auth = await getAuth() // authorization header
        }

        if (item.type == Type.Movie){
            request_url = `https://${process.env.MOVIES_API}/movie/${item.id}?api_key=${process.env.MOVIES_KEY}&append_to_response=images,credits,similar`
        } else if (item.type == Type.TV.Show) {
            request_url = `https://${process.env.TV_API}/tv/${item.id}?api_key=${process.env.TV_KEY}&append_to_response=images,credits,similar,external_ids`
        } else if (item.type == Type.TV.Episode) {
            request_url = `https://${process.env.TV_API}/tv/${item.tv_show_id}/season/${item.season_number}/episode/${item.episode_number}?api_key=${process.env.TV_KEY}`
        } else if (item.type == Type.Music.Album) {
            request_url = `https://${process.env.MUSIC_API}/albums/${item.id}?access_token=${auth}` 
        } else if (item.type == Type.Music.Artist) {
            request_url = `https://${process.env.MUSIC_API}/artists/${item.id}?access_token=${auth}`
        }

        console.log('url: ' + request_url)
        return wait(delay).then(() => axios.get(request_url)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
        )
    }
}

async function getAuthorizationToken() {
    return axios
      .post(
        "https://accounts.spotify.com/api/token",
        qs.stringify({
          grant_type: "client_credentials",
          client_id: process.env.MUSIC_CLIENT_ID,
          client_secret: process.env.MUSIC_CLIENT_SECRET,
        }),
        {
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
        }
      )
      .then(function (response) {
        cookies.set("auth", response.data.access_token, {
          maxAge: response.data.expires_in,
        });
    });
}
  
const getAuth = async () => {
    let auth = cookies.get("auth")

    if (!auth) {
        await getAuthorizationToken()
        auth = cookies.get("auth")
    }

    return auth;
}

module.exports = Metadata