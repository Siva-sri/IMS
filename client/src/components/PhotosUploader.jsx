import { useState } from "react";
import axios from 'axios';

export default function PhotosUploader({addedPhotos, onChange}){
    const [photoLink, setPhotoLink] = useState('');
    async function addPhotoByLink(event){
        event.preventDefault();
        const {data: filename } = await axios.post('/upload-by-link', {link : photoLink});
        onChange(prev => {
            return [...prev, filename];
        });
        setPhotoLink('');
    }

    function uploadPhoto(event){
        const files = event.target.files;
        const data = new FormData();
        for(let i=0; i<files.length;i++){
            data.append('photos',files[i]);
        }
        axios.post('/upload', data, {
            headers: {'Content-Type' : 'multipart-form-data'}
        }).then(response => {
            const {data:filenames} = response;
            onChange(prev => {
                return [...prev, ...filenames];
            });
        });
    }

    function removePhoto(event,filename){
        event.preventDefault();
        onChange([...addedPhotos.filter(photo => photo !== filename)]);
    }

    function setAsMainPhoto(event,filename){
        event.preventDefault();
        const addedPhotosWithoutSelected = addedPhotos.filter(photo => photo !== filename);
        const newAddedPhotos = [filename,...addedPhotosWithoutSelected];
        onChange(newAddedPhotos);
    }

    return(
        <>
            <div className="flex gap-2 grid-cols-2">
                        <input type="text" placeholder="add using link ...jpg" className="w-3/4" value={photoLink} onChange={e => setPhotoLink(e.target.value)}/>
                        <button onClick={addPhotoByLink} className="w-1/4">Add&nbsp;photo</button>
                    </div>
                    <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {addedPhotos.length > 0 && addedPhotos.map(link => (
                            <div className="flex relative" key={link}>
                                <button onClick={(event)=>removePhoto(event,link)} className="absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-xl cursor-pointer py-2 px-3 w-1/4">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button onClick={(event)=>setAsMainPhoto(event,link)} className="absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-xl cursor-pointer py-2 px-3 w-1/4">
                                    {link === addedPhotos[0] && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {link !== addedPhotos[0] && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                        </svg>
                                    )}
                                </button>
                                <img className="rounded-2xl w-[400px] h-[400px]" src= {"http://localhost:4000/uploads/"+link }></img>
                            </div>
                        )) }
                    </div>
                    <label className="border rounded-2xl p-2 text-2xl flex justify-center items-center w-1/4 mt-4 bg-secondary cursor-pointer">
                    <input type="file" className="hidden" multiple onChange={uploadPhoto}/>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                        </svg>
                            Upload
                    </label>
        </>
    );
}