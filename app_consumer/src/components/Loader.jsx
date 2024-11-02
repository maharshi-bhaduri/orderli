// src/components/Loader.js

import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className='rounded-full shadow-xl'>
                <div className="relative w-24 h-24 border-[20px] border-white bg-white rounded-full animate-spin">
                    <div className="absolute w-3 h-3 bg-orange-500 rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute w-3 h-3 bg-orange-500 rounded-full top-1/2 left-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute w-3 h-3 bg-orange-500 rounded-full bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"></div>
                    <div className="absolute w-3 h-3 bg-orange-500 rounded-full top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
