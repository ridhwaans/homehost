import React from 'react';
import useSWR from 'swr';

import { useGlobalContext } from '../../contexts/context';
import { useDebounce } from '../../hooks/useDebounce';
import SearchResults from '../SearchResults';

const Search = () => {
  const { moviesAndTVSearchInput } = useGlobalContext();

  const debouncedSearch = useDebounce(moviesAndTVSearchInput, 1000);

  const { data } = useSWR(() =>
    debouncedSearch ? `/watch/search?q=${debouncedSearch}` : null
  );

  if (data)
    return (
      <div className="search-background">
        {data.results ? (
          <React.Fragment>
            {data.results.length ? (
              <SearchResults
                mainTitle={`Results for "${debouncedSearch}"`}
                data={data.results}
                poster={false}
              />
            ) : (
              <div className="not-found">No results :/ </div>
            )}
          </React.Fragment>
        ) : (
          <div className="loading-content">
            <div className="loading-circle"></div>
            <span className="loading-name">LOADING...</span>
          </div>
        )}
      </div>
    );
};

export default Search;
