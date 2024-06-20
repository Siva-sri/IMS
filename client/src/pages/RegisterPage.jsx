import { useState } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agentId, setAgentId] = useState('');
    const [user,setUser] = useState('User');
    //console.log(user);

    const checkRegister = e =>{
        setUser(e.target.value);
    }

    async function register(event){
        event.preventDefault();
        try{
            await axios.post('/register',{name, email, password,agentId,user});
            alert('Registration success');
        } catch(e){
            console.log(e);
            alert('Duplicate Email ID');
        }
    }

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Register</h1>
            <div className='flex items-center justify-around m-4'>
                <label><input type='radio' 
                        name='reg' value='Agent'
                        checked={user=='Agent'}
                        onChange={checkRegister}/> Agent</label>
                <label><input type='radio' 
                        name='reg' value='User'
                        checked={user=='User'}
                        onChange={checkRegister}/> User</label>
            </div>
            <form className="max-w-md mx-auto" onSubmit={register}>
                <input type='text' 
                    placeholder='Your Name' 
                    value={name}
                    onChange={e => setName(e.target.value)}/>
                <input type="email" 
                    placeholder="Your Email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}/>
                <input type="password" 
                    placeholder="Your password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    />
                {(user=='Agent') && 
                <input type="text"
                    placeholder="Your Id"
                    value={agentId}
                    onChange={e => setAgentId(e.target.value)}
                 />}
                <button>Register</button>
                <div className='text-center py-2 text-gray-500'>
                    Already a member? <Link to={'/login'} className='text-primary underline'>Login</Link>
                </div>
            </form>
            </div>
        </div>
    )
}