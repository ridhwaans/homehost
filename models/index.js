class Album {
    constructor({id = 0}) {
        this.id = id; 
     }
 }

class Movie {
    constructor({id = 0} = {}) {
        this.id = id; 
    }
 }

class TVEpisode {
    constructor({tv_id = 0, season_number = 0, episode_number = 0}) {
        this.tv_id = tv_id; 
        this.season_number = season_number;
        this.episode_number = episode_number;
    }
}

class TVShow {
    constructor({id = 0}) {
       this.id = id; 
    }
 }

module.exports = { Album, Movie, TVEpisode, TVShow }