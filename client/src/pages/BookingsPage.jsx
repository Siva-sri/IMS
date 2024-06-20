import { useParams } from "react-router-dom";
import { useEffect, useState,useContext } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";

export default function BookingPage(){
    const {id} = useParams();
    const {user} = useContext(UserContext);
    const [booking, setBooking] = useState();
    //console.log(user.agentId);
    console.log(booking);
    useEffect(()=>{
        if(id){
            axios.get('/bookings').then(response => {
                const foundBooking = response.data.find(({_id}) => _id === id );
                if(foundBooking){
                    setBooking(foundBooking);
                }
            });
        }
    },[id]);

    if(!booking){
        return '';
    }

    return(
        <>
        {user && !user.agentId &&
        <div className="bg-green-200 p-4 rounded-2xl m-6">
            <h2 className="text-2xl mb-2">Your Booking Information:</h2>
            <p>Name:- {booking.policy.pname}</p>
            <p>ID:- {booking.user}</p>
            <p>Agent ID:- {booking.policy.powner}</p>
        </div>
        }
        {user && user.agentId &&
        <div className="bg-green-200 p-4 rounded-2xl m-6">
            <h2 className="text-2xl mb-2">Customer Information:</h2>
            <p>{booking.policy.pname}</p>
            <p>{booking.uname}</p>
            <p>{booking.mobile}</p>
        </div>
        }
        </>
    )
}