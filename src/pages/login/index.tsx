import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Loader from '../../components/Loader';
import authService from '../../services/auth';
import { useAsync } from '../../utils/useAsync';

export default function Login() {
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [credential, setCredential] = useState({email: '', password: ''})
    const location = useLocation()
    const navigate = useNavigate()

    let from = location.state?.from?.pathname || "/patients";

    const handleLogin = async () => {
      const user = await authService.login(credential)

      if (user) {
        navigate(from, {replace: true})
      }
    }

    // const [{ isLoading, data: user, error }] = useAsync(handleLogin, [])

    // if (isLoading) {
    //   return <Loader />
    // }
    
    return (
        <div className="min-h-screen flex justify-center items-center text-center">
            <form className="w-1/3" onSubmit={handleLogin} aria-label="form">
                <h3 className="text-2xl">Patients CRM Login</h3>
                <div className="py-5">
                    <input
                      className="w-full border-2 rounded p-3 border-green-500"
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={(e) => setCredential({...credential, email: e.target.value})}
                      required
                    />
                </div>
                <div className="py-5">
                    <input
                        className="w-full border-2 rounded p-3 border-green-500"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => setCredential({...credential, password: e.target.value})}
                        required
                    />
                </div>

                {
                    <p className="text-red-400 p-3">Credentials not recognised. Please try again.</p>
                }

                <button 
                    type="submit"
                    onClick={() => handleLogin()}
                    className="py-4 px-8 rounded bg-green-500 text-lg"
                    disabled={btnDisabled}
                    >Login</button>
            </form>
        </div>
    )
}
