import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import Input from '../../components/Inputs/Input';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if(!fullName){
      setError("Please enter your name");
      return;
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }
    
    if(!password){
      setError("Please enter password");
      return;
    }

    setError("");
  }

  return (
    <AuthLayout>
      <div className='lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-5 mb-6'>
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignUp}>

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              placeholder="John Doe"
              label="Full Name"
              onChange={({target}) => setFullName(target.value)}
              type="text"
            />
            <Input
              value={email}
              placeholder="john@example.com"
              label="Email Address"
              onChange={({target}) => setEmail(target.value)}
              type="text"
            />
            <div className='col-span-2'>
              <Input
                value={password}
                placeholder="Min 8 characters"
                label="Password"
                onChange={({target}) => setPassword(target.value)}
                type="password"
              />
            </div>
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          
          <button type='submit' className='btn-primary'>
            SIGN UP
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <Link className='font-medium text-primary underline' to='/login'>
              LogIn
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp