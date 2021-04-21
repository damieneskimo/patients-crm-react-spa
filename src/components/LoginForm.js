import { apiClient } from '../api.js';
import { useState } from 'react';

export default function LoginForm (props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState(false);
    const [unknownError, setUnknownError] = useState(false);
    const [forbiddenError, setForbiddenError] = useState(false);
    console.log(props)
    const handleSubmit = (e) => {
        e.preventDefault();

        apiClient.get('/sanctum/csrf-cookie')
            .then(() => {
                apiClient.post('/login', {
                    email: email,
                    password: password
                }).then(response => {
                    if (response.status === 204) {
                        props.onLogin();
                    }
                }).catch(error => {
                    if (error.response && error.response.status === 422) {
                        setAuthError(true);
                    } else if (error.response.status === 403) {
                        setForbiddenError(true);
                    } else {
                        setUnknownError(true);
                        console.error(error);
                    }
                });
            });
    }

    return (
        <div className="min-h-screen flex justify-center items-center text-center">
            <form className="w-1/3">
                <h3 className="text-2xl">Patients CRM Login</h3>
                <div className="py-5">
                    <input
                        className="w-full border-2 rounded p-3 border-green-500"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="py-5">
                    <input
                        className="w-full border-2 rounded p-3 border-green-500"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {authError &&
                    <p className="text-red-400 p-3">Credentials not recognised. Please try again.</p>
                }
                {forbiddenError &&
                    <p className="text-red-400 p-3">Sorry, you don't have the permission to access.</p> 
                }
                {unknownError &&
                    <p className="text-red-400 p-3">There was an error submitting your details.</p>
                }

                <button onClick={handleSubmit} className="py-4 px-8 rounded bg-green-500 text-lg">Login</button>  
            </form>
        </div>
    )
}