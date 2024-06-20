import { useContext, useState } from 'react';
import {Link, Navigate} from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../components/UserContext';

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [userType,setUserType] = useState('User');
    const [agentId, setAgentId] = useState('');
    const {setUser} = useContext(UserContext);
    async function submit(event){
        event.preventDefault();
        try{
            const {data} = await axios.post('/login',{email,password,agentId,userType});
            console.log(data);
            if(data === 'not found'){
                alert('Login failed by data');
            }else{
                    setUser(data);
                    alert('Login success');
                    setRedirect(true);
                }
        }catch(e){
            console.log(e);
            alert('Login failed by catch');
        }
    }

    if(redirect){
        return <Navigate to={'/'} />
    }
    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Login</h1>
            <div className='flex items-center justify-around m-4'>
                <label><input type='radio' 
                        name='reg' value='Agent'
                        checked={userType=='Agent'}
                        onChange={e => setUserType(e.target.value)}/> Agent</label>
                <label><input type='radio' 
                        name='reg' value='User'
                        checked={userType=='User'}
                        onChange={e => setUserType(e.target.value)}/> User</label>
            </div>
            <form className="max-w-md mx-auto" onSubmit={submit}>
                <input type="email" 
                    placeholder="Your Email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)} />
                <input type="password" 
                    placeholder="Your password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)} />
                {(userType=='Agent') && 
                <input type="text"
                    placeholder="Your Id"
                    value={agentId}
                    onChange={e => setAgentId(e.target.value)}
                 />}
                <button>Login</button>
                <div className='text-center py-2 text-gray-500'>
                    Don't have an account? <Link to={'/register'} className='text-primary underline'>Register Now</Link>
                </div>
            </form>
            </div>
        </div>
    )
}