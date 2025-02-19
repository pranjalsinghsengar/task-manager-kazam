import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`h-screen flex items-center justify-center  bg-gray-200 `}>
      <div className='bg-white p-5 rounded-xl shadow-lg flex w-full h-full overflow-hidden'>
        {/* Left Section */}
        <div className='w-1/2 flex flex-col justify-center items-center p-10 bg-white'>
          <div className='flex items-center mb-6  w-8/12'>
            <img src='/logo.png' alt='Logo' className='w-8 h-8 mr-2' />
            <h1 className='text-2xl font-semibold text-gray-800'>Fillianta</h1>
          </div>
          <>{children}</>
        </div>

        {/* Right Section */}
        <div
          className={`w-1/2 bg-cover bg-center bg-[url(https://images.pexels.com/photos/17485710/pexels-photo-17485710/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-visualises-the-input-and-output-of-neural-networks-and-how-ai-systems-perceive-data-it-was-created-by-rose-pilkington.png)] rounded-2xl flex flex-col justify-center items-center  p-10`}
        >
          {/* <div>
          <h2 className='text-8xl font-bold text-orange-600/70'>MANAGE YOUR</h2>
          <h3 className='text-9xl font-bold text-orange-600 mb-6'>TASK</h3>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
