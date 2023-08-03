// import { SongsModel } from './prismaClient';

// export const searchMusic = async (keyword) => {
//   if (keyword.trim() == '') {
//     return { results: { songs: [], artists: [], albums: [] } };
//   }
//   const songs = await SongsModel.findMany({
//     include: { album: { include: { artists: true } } },
//     where: {
//       OR: [
//         { name: { contains: keyword } },
//         {
//           album: {
//             artists: {
//               some: {
//                 name: { contains: keyword },
//               },
//             },
//           },
//         },
//       ],
//     },
//   });
//   const artists = await prisma.artist.findMany({
//     where: {
//       name: {
//         contains: keyword,
//       },
//     },
//   });
//   const albums = await prisma.album.findMany({
//     include: {
//       artists: true,
//       songs: { include: { album: { include: { artists: true } } } },
//     },
//     where: {
//       OR: [
//         { name: { contains: keyword } },
//         {
//           artists: {
//             some: {
//               name: { contains: keyword },
//             },
//           },
//         },
//       ],
//     },
//   });
//   return {
//     results: {
//       songs: format(songs),
//       artists: format(artists),
//       albums: format(albums),
//     },
//   };
// };

// export const getAllArtists = async () => {
//   const result = await prisma.artist.findMany();
//   return format(result);
// };

// export const getMostPopularArtists = async () => {
//   const result = await prisma.artist.findMany({
//     orderBy: {
//       popularity: 'desc',
//     },
//   });
//   return format(result);
// };

// export const getAllAlbums = async () => {
//   const result = await prisma.album.findMany({
//     include: {
//       artists: true,
//       songs: { include: { album: { include: { artists: true } } } },
//     },
//   });
//   return format(result);
// };

// export const lastAddedSong = (album) => {
//   return Math.max(...album.songs.map((s) => s.mtime));
// };

// export const getRecentlyAddedAlbums = async () => {
//   const result = await prisma.album.findMany({
//     include: {
//       artists: true,
//       songs: { include: { album: { include: { artists: true } } } },
//     },
//   });
//   return format(result.sort((a, b) => lastAddedSong(b) - lastAddedSong(a)));
// };

// export const getLatestAlbumReleases = async () => {
//   const result = await prisma.album.findMany({
//     include: {
//       artists: true,
//       songs: { include: { album: { include: { artists: true } } } },
//     },
//     orderBy: {
//       release_date: 'desc',
//     },
//   });
//   return format(result);
// };

// export const getMusicAlbum = async (album_id) => {
//   const result = await prisma.album.findUnique({
//     include: { artists: true, songs: { include: { artists: true } } },
//     where: {
//       spotify_id: album_id,
//     },
//   });
//   return format(result);
// };

// export const getAllSongs = async () => {
//   const result = await prisma.song.findMany({
//     include: { album: { include: { artists: true } } },
//   });
//   return format(result);
// };

// export const getRecentlyAddedSongs = async () => {
//   const result = await prisma.song.findMany({
//     include: { album: { include: { artists: true } } },
//     orderBy: {
//       mtime: 'desc',
//     },
//   });
//   return format(result);
// };

// export const getSongFilePath = async (album_id, disc_number, track_number) => {
//   const result = await prisma.album.findUnique({
//     select: {
//       songs: {
//         where: {
//           disc_number: parseInt(disc_number),
//           track_number: parseInt(track_number),
//         },
//         select: {
//           fs_path: true,
//         },
//       },
//     },
//     where: {
//       spotify_id: album_id,
//     },
//   });
//   return result.songs[0].fs_path;
// };
