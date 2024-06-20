import AccountNav from "../components/AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PolicyImg from "../components/PolicyImg";
import { Link } from "react-router-dom";

export default function CustomerPage(){
 const [bookings, setBookings] = useState([]);
    useEffect(()=>{
        axios.get('/bookings').then(response => {
            setBookings(response.data);
        });
    },[]);
    console.log(bookings);
    return (
        <div>
            <AccountNav />
            <div>
                {bookings?.length >0 && bookings.map(booking => (
                    <Link to={`/account/customers/${booking._id}`}>
                    <div className="flex gap-8 bg-blue-200 rounded-2xl overflow-hidden border border-solid m-5 h-40">
                        <div className="w-48 bg-blue-200">
                            <PolicyImg policy={booking.policy} className={'border border-solid border-2 border-blue-200'}/>
                        </div>
                        <div className="py-3 pr-3">
                            <h2 className="text-2xl">{booking.policy.pname}</h2>
                            <h2 className="text-xl mt-2 text-primary">{booking._id}</h2>
                            <h2 className="text-xl mt-2">{booking.uname}</h2>
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}