import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "../components/Carousel";
import BookingWidget from "../components/BookingWidget";


export default function PolicyPage(){
    const {id} = useParams();
    const [policy, setPolicy] = useState(null);
    
    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get(`/policies/${id}`).then(response => {
            setPolicy(response.data);
        })
    },[]);


    if(!policy) return '';
    ///console.log(policy);
    return(
        <div className="m-4 -mx-8 p-8 bg-blue-200">
            <h1 className="text-3xl text-center">{policy.pname}</h1>
            <p className="block font-semibold my-2 text-center">{policy.pquote}</p>
            <div className="flex gap-6 mt-4">
                <div className="ml-20">
                    <Carousel>
                        {policy.pimages.length > 0 && policy.pimages.map((photo) => (
                            <img id={policy?.pname} src={"http://localhost:4000/uploads/"+photo} className="w-[600px] h-[600px] rounded-2xl" />
                        ))}
                    </Carousel>
                </div>
                <div className="mt-6">
                    <h2 className="font-semibold text-2xl">Policy Number</h2>
                            {policy.pno}
                    <h2 className="font-semibold text-2xl mt-6">Policy Type</h2>
                            {policy.ptype}
                    <h2 className="font-semibold text-2xl mt-6">Description</h2>
                            {policy.pdesc}
                    <h2 className="font-semibold text-2xl mt-6">Features</h2>
                        {policy.pfeatures?.length>0 && policy.pfeatures.map((fet) => (
                            <div key={fet} className="m-4 text-center flex">
                                <div className="bg-secondary h-3 w-3 m-1 rounded-full"></div>
                                <p className="text-md">{fet}</p>
                            </div>
                    ))}
                    </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div className="my-4">
                    <h2 className="font-semibold text-2xl">Benifits</h2>
                    {policy.pbenifits}
                </div>
                <div>
                    <BookingWidget policy={policy} />
                </div>
            </div>

        </div>
    );
}