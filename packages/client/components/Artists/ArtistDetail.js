import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import AlbumItem from '../Albums/AlbumItem/AlbumItem';
import style from './Artists.module.css';

const ArtistDetail = () => {
  const { id } = useParams();
  const { data: artist } = useSWR(`/music/artists/${encodeURIComponent(id)}`);

  if (!artist) return null;

  return (
    <div className={style.Albums}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <img
          src={artist.image_url}
          alt={artist.name}
          style={{ width: '180px', height: '180px', borderRadius: '50%' }}
        />
        <h1 className={style.Title}>{artist.name}</h1>
      </div>

      <h2 className={style.Title}>Albums</h2>
      <div className={style.Container}>
        {artist.albums.map((album) => (
          <AlbumItem key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
};

export default ArtistDetail;
