import React from 'react';

const Spinner = () => {
    return (
        <div className='flex justify-center items-center h-full'>
            <div className="w-20 h-20 border-2 border-dashed border-spacing-12  rounded-full animate-spin border-blue-800"></div>
        </div>
    );
};

export default Spinner;