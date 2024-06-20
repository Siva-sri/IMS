import { useContext, useEffect, useState} from "react";
import { UserContext } from "../components/UserContext";
import axios from "axios";
import { Navigate } from "react-router-dom";
export default function BookingWidget({policy}){
    const [mobile, setMobile] = useState('');
    const [uname, setUName] = useState('');
    const [redirect, setRedirect] = useState('');
    const [agent, setAgent] = useState('');
    const {user} = useContext(UserContext);

    //console.log(policy.powner);
    console.log(agent?.name);
    useEffect(()=>{
        if(user){
            setUName(user.name);
            findAgent();
        }
    },[user])

    async function bookPolicy(event){
        event.preventDefault();
        const response = await axios.post('/bookings',{uname,mobile,policy:policy._id,agent:policy.powner});
        const bookingId = response.data._id;
        setRedirect(`/account/customers/${bookingId}`);
    }

    async function findAgent(){
        const resAgent = await axios.get('/agent',{params:{_id:policy.powner}});
        setAgent(resAgent.data);
    }

    if(redirect){
        return <Navigate to={redirect} />
    }

    return(
        <div className="bg-primary shadow p-4 rounded-2xl">
                    <div>
                    <h2 className="text-2xl text-center">Agent Name - {agent?.name} </h2>
                    </div>
                    <label>Your Full Name:</label>
                    <input type="text" placeholder="Your Name" value={uname} onChange={e => setUName(e.target.value)} />
                    <label>Phone number:</label>
                    <input type="tel" placeholder="Your Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} />
                    <button className="mt-4" onClick={bookPolicy}>Book policy</button>
        </div>
    )
}