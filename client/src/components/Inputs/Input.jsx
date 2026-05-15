import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

const Input = ({ value, onChange, placeholder, label, type }) => {
    const [showPassword, setShowPassoword] = useState(false);

    const toggleShowPassword = (e) => {
        e.preventDefault();
        setShowPassoword(!showPassword);
    };

    return (
        <div>
            <label className='text-[13px] text-slate-800 '>{label}</label>

            <div className='input-box'>
                <input
                    type={type === "password" ? showPassword ? "text" : "password" : type}
                    placeholder={placeholder}
                    className='w-full bg-transparent outline-none'
                    value={value}
                    onChange={(e) => onChange(e)}
                />

                {type === "password" && (
                    <button type='button' onClick={(e) => toggleShowPassword(e)}>
                        {showPassword ? (
                            <FaRegEye
                                size={22}
                                className='text-primary cursor-pointer'
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={22}
                                className='text-slate-400 cursor-pointer'
                            />    
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Input