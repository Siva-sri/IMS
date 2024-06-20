import PhotosUploader from "../components/PhotosUploader";
import Features from "../components/Features";
import { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function PolicyFormPage(){
    const {id} = useParams();
    const [pid, setPId] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [quote, setQuote] = useState('');
    const [desc, setDesc] = useState('');
    const [features, setFeatures] = useState([]);
    const [benifits, setBenifits] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get('/policies/'+id).then(response =>{
            const {data} = response;
            setPId(data.pno);
            setName(data.pname);
            setType(data.ptype);
            setQuote(data.pquote);
            setDesc(data.pdesc);
            setBenifits(data.pbenifits);
            setFeatures(data.pfeatures);
            setAddedPhotos(data.pimages);
        });
    },[id]);

    function inputHeader(text){
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }

    function inputDesc(text){
        return (
            <p className="text-sm text-gray-500">{text}</p>
        );
    }

    function preInput(header, desc){
        return (
            <>
                {inputHeader(header)}
                {inputDesc(desc)}
            </>
        )
    }

    async function savePolicy(event){
        event.preventDefault();
        const poilicyData = {
            pid,name,type,addedPhotos,
            quote,desc,features,benifits
        }
        if(id){
            await axios.put('/policies',{
                id, ...poilicyData
            });
        }
        else{
            await axios.post('/policies',poilicyData);
        }
        setRedirect(true);
    }

    if(redirect){
        return <Navigate to={'/account/policies'} />
    }

    return(
        <div>
        <AccountNav />
        <form onSubmit={savePolicy}>
            {preInput('Policy ID','ID of the policy')}
            <input type="text" placeholder="policy number" value={pid} onChange={e => setPId(e.target.value)} />
            {preInput('Policy Name','Name of the policy')}
            <input type="text" placeholder="name for policy" value={name} onChange={e => setName(e.target.value)} />
            {preInput('Policy Type','Type of the policy')}
            <input type="text" placeholder="type of policy" value={type} onChange={e => setType(e.target.value)} />
            {preInput('Pamplets','Scheme images')}
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            {preInput('Policy Quote','Catchy quote for policy')}
            <input type="text" placeholder="quote for policy" value={quote} onChange={e => setQuote(e.target.value)} />
            {preInput('Policy Description','Describe the policy')}
            <textarea className="resize-none" value={desc} onChange={e => setDesc(e.target.value)}/>
            {preInput('Features','Select policy features')}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                 <Features selected={features} onChange={setFeatures} />   
            </div>
            {preInput('Benifits','Describe policy benifits')}
            <textarea className="resize-none" value={benifits} onChange={e => setBenifits(e.target.value)}/>
            <div>
                <button className="my-4">Save</button>
            </div>
        </form>
        </div>
    )
}