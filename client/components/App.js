import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SWRConfig } from 'swr';

import Admin from './Admin';
import AlbumDetail from './AlbumDetail/AlbumDetail';
import Albums from './Albums/Albums';
import Artists from './Artists/Artists';
import Movies from './Movies';
import Music from './Music';
import MusicHome from './MusicHome/MusicHome';
import MusicSearch from './MusicSearch';
import NotFound from './NotFound';
import Songs from './Songs/Songs';
import TVShows from './TVShows';

const App = () => {
  return (
    <React.Fragment>
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(
              `${process.env.REACT_APP_HOMEHOST_BASE}/api` + resource,
              init
            ).then((res) => res.json()),
        }}
      >
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TVShows />} />
            <Route path="music" element={<Music />}>
              <Route index element={<MusicHome />} />
              <Route path="search" element={<MusicSearch />} />
              <Route path="search/:id" element={<MusicSearch />} />
              <Route path="albums" element={<Albums />} />
              <Route path="album/:id" element={<AlbumDetail />} />
              <Route path="artists" element={<Artists />} />
              <Route path="songs" element={<Songs />} />
            </Route>
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SWRConfig>
    </React.Fragment>
  );
};

export default App;
