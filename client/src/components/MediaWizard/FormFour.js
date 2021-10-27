import React, {useContext} from 'react';
import { addMovie, addEpisode, addSong } from "../../api"
import AppContext from './Context';
import './styles.css';

const FormFour = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.fileDetails;

    const next = () => {
        updateContext.setStep(updateContext.currentPage + 1)
    };

    const previous = () => {
        updateContext.setStep(updateContext.currentPage - 1)
    };

    const applyMovie = async (item) => {
        await addMovie({
        type: updateContext.selectedFile.type,
        fs_path: updateContext.selectedFile.fs_path,
        id: item.id,
        title: item.title,
        release_year: parseInt(item.release_date)
        })
    }

    const applyEpisode = async (item) => {
        await addEpisode({
        type: updateContext.selectedFile.type,
        fs_path: updateContext.selectedFile.fs_path,
        id: item.id,
        title: item.title
        })
    }

    const applySong = async (item) => {
        await addSong({
        type: updateContext.selectedFile.type,
        fs_path: updateContext.selectedFile.fs_path,
        album_id: item.album.id,
        album_name: item.album.name,
        album_release_year: parseInt(item.album.release_date),
        name: item.name,
        disc_number: item.disc_number,
        track_number: item.track_number
        })
    }

    const applyUnknownAlbumSong = async () => {
        await addSong({
        type: updateContext.selectedFile.type,
        fs_path: updateContext.selectedFile.fs_path,
        album_name: "Unknown Album"
        })
    }

    return (
        <div className="container">
            <p>Is this information correct?</p>
            <div className="formContainer">
                <form className="form">

                    <button className="formSubmit" value="Next" type="submit" onClick={next}>Next </button>
                    <button className="formSubmit" value="Previous" type="submit" onClick={previous}>Go Back </button>
                </form>
            </div>
        </div>
    );
};

export default FormFour;