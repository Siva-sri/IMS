import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function IndexPage(){
    const [policies, setPolicies] = useState();
    useEffect(()=>{
      axios.get('/policies').then(response =>{
        setPolicies([...response.data]);
      });
    },[])
    return (
        <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {policies?.length >0 && policies.map(policy => (
            <Link key={policy._id} to={'/policy/'+policy._id}>
              <div className="bg-gray-200 mb-2 rounded-2xl flex h-[282px] w-[282px]">
                {policy.pimages?.[0] && (
                  <img className="rounded-2xl object-cover h-full w-full" src={'http://localhost:4000/uploads/'+policy.pimages?.[0]} />
                )}
              </div>
              <h2 className="text-sm truncate">{policy.pname}</h2>
              <h3 className="font-bold">{policy.pquote}</h3>
            </Link>
          ))}
        </div>
      )
}