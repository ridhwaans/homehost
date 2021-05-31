class Movie {
    constructor({id = 0}) {
        this.id = id; 
    }
 }

class TVShow {
    constructor({id = 0}) {
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

class Music {}

class Album extends Music {
    constructor({id = 0}) {
        super();
        this.id = id; 
     }
 }

 class Artist extends Music {
    constructor({id = 0}) {
        super();
        this.id = id; 
     }
 }

module.exports = { Movie, TVShow, TVEpisode, Music, Album, Artist }