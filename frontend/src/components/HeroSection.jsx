import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className='text-center bg-gradient-to-r from-[#2D1E6B] to-[#4B2E83] py-20'>
            <div className='flex flex-col gap-5 my-10 text-white'>
                <span className='mx-auto px-4 py-2 rounded-full bg-[#F8B400] text-[#2D1E6B] font-medium'>
                    Find, Apply, Succeed!
                </span>
                <h1 className='text-5xl font-bold leading-tight'>
                    Unlock Opportunities. <br /> Land Your <span className='text-[#F8B400]'>Dream Job Today!</span>
                </h1>
                <p className="text-lg text-gray-300">
                    Discover top career opportunities tailored just for you.
                </p>
                
                <div className='flex w-[50%] bg-white pl-4 py-2 rounded-full items-center gap-4 mx-auto shadow-md'>
                    <input
                        type="text"
                        placeholder='Search for your next job...'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full text-gray-700 placeholder-gray-400 px-2 text-lg'
                    />
                    <Button onClick={searchJobHandler} className="rounded-full bg-[#F8B400] hover:bg-[#d99a00] text-[#2D1E6B] px-5 py-2 transition">
                        <Search className='h-6 w-6' />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
