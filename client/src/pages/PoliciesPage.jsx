import { Link} from "react-router-dom";
import AccountNav from "../components/AccountNav";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../components/UserContext";
import axios from "axios";
import PolicyImg from "../components/PolicyImg";

export default function PoliciesPage(){
    const [policies, setPolicies] = useState([]);
    const {user} = useContext(UserContext);
    //console.log(user.agentId);
    useEffect(()=>{
        axios.get('/user-policies').then(({data})=>{
            setPolicies(data);
        });
    },[]);
    return(
        <div>
            <AccountNav />
                <div className="text-center">
                {user && user.agentId!==undefined &&
                <Link className='inline-flex gap-1 bg-secondary text-white py-2 px-6 rounded-full' to={'/account/policies/new'}> 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                <div>Add new policy</div></Link>
                }
            </div>
            <div className="mt-4">
                {policies.length>0 && policies.map(policy => (
                    <Link key={policy?._id} to={'/account/policies/'+policy?._id} className="flex cursor-pointer gap-4 bg-green-100 p-4 rounded-2xl m-4">
                        <div className="flex w-32 h-32 bg-blue-300 grow shrink-0">
                            <PolicyImg policy= {policy} className={'object-cover h-32 w-32'} />
                        </div>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{policy.pname}</h2>
                            <p>{policy.pdesc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}