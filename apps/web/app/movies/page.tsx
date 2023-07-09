"use client"

import useSWR from "swr"

import { ActorsMoviesContainer } from "@/components/actors-movies-container"
import { BigBillboard } from "@/components/big-billboard"
import { CarouselHorizontal } from "@/components/carousel-horizontal"

import "./movies.css"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

/*
background-image: radial-gradient(circle 800px at 700px 200px, var(--purple-2), transparent), radial-gradient(circle 600px at calc(100% - 300px) 300px, var(--blue-3), transparent), radial-gradient(circle 800px at right center, var(--sky-3), transparent), radial-gradient(circle 800px at right bottom, var(--sky-1), transparent), radial-gradient(circle 800px at calc(50% - 600px) calc(100% - 100px), var(--pink-3), var(--pink-1), transparent);
}

*/
export default function MoviesPage() {
  const { data: billboardMovie } = useSWR(
    "http://localhost:5000/api/watch/billboard",
    fetcher
  )
  const { data: recentlyAddedMovies } = useSWR(
    "http://localhost:5000/api/movies/recently_added",
    fetcher
  )
  const { data: popularMovies } = useSWR(
    "http://localhost:5000/api/movies/most_popular",
    fetcher
  )
  const { data: highestRatedMovies } = useSWR(
    "http://localhost:5000/api/movies/highest_rated",
    fetcher
  )
  const { data: animationMovies } = useSWR(
    "http://localhost:5000/api/movies/genre/Animation",
    fetcher
  )
  const { data: warMovies } = useSWR(
    "http://localhost:5000/api/movies/genre/War",
    fetcher
  )

  return (
    <div className="flex flex-col gap-4 px-64">
      <BigBillboard data={billboardMovie} />
      <CarouselHorizontal data={recentlyAddedMovies} />
      <div className="sm:grid-row-4 lg:grid-row-3 grid h-64 grid-cols-10 gap-4">
        <div className="row-span-2 h-full bg-lime-700 sm:col-span-10 lg:col-span-6"></div>
        <div className="h-full bg-lime-500 sm:col-span-5 lg:col-span-2"></div>
        <div className="h-full bg-lime-600 sm:col-span-5 lg:col-span-2"></div>
        <div className="h-full bg-lime-400 sm:col-span-10 sm:row-span-1 lg:col-span-4"></div>
      </div>

      <div className="grid h-64 grid-cols-[20%_80%]">
        <div className="grid h-full grid-cols-2 bg-red-700">
          <div className="h-full bg-orange-500"></div>
          <div className="h-full bg-orange-600"></div>
        </div>
        <div className="h-full bg-red-500"></div>
      </div>

      <div className="grid h-64 grid-cols-3">
        <div className="grid h-full grid-cols-2 bg-blue-700">
          <div className="h-full bg-blue-500"></div>
          <div className="h-full bg-blue-600"></div>
        </div>
        <div className="h-full bg-blue-500"></div>
      </div>

      <ActorsMoviesContainer />
    </div>
  )
}

// #content {
//   padding: 10px;
//   background-color: #eee;
//   display: flex;
//   flex-flow: row nowrap;
//   flex-grow: 1;
// }

// #content > .group {
//   margin: 10px;
//   padding: 10px;
//   border: 1px solid #cfcfcf;
//   background-color: #ddd;
//   display: flex;
//   flex-flow: column wrap;
//   max-height: 600px;
// }
