import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"

import Input from '../../components/Inputs/Input';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validateEmail } from '../../utils/helper';
import { apiPost } from '../../utils/apiUtils';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const  { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    if(!password){
      setError("Please enter password");
      return;
    }

    setError("");

    try {
      const body = {
        email,
        password
      }
      const response = await apiPost(API_PATHS.AUTH.LOGIN, body);
      if(response?.accessToken){
        localStorage.setItem("isLoggedIn", true);
        
        updateUser(response?.user);
        toast.success("Logged in successfully");
        navigate("/dashboard");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 mid:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-1.25 mb-6'>
          Please enter your deatils to login
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            placeholder="john@example.com"
            label="Email Address"
            onChange={({target}) => setEmail(target.value)}
            type="text"
          />

          <Input
            value={password}
            placeholder="Min 8 characters"
            label="Password"
            onChange={({target}) => setPassword(target.value)}
            type="password"
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            LOGIN
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <Link className='font-medium text-primary underline' to='/signup'>
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login