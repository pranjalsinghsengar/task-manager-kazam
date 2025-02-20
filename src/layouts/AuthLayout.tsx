import  { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-5 gap-5 md:gap-0  rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-7xl h-[90vh] md:h-[80vh] overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center  bg-white">
          {/* <div className="flex items-center justify-start mb-6 w-full ">
            <img src="https://img.freepik.com/free-photo/link-icon-right-side-white-backround_187299-40177.jpg" alt="Logo" className="w-8 mr-1" />
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Task Manager</h1>
          </div> */}
          <div className="w-full flex flex-col items-center">{children}</div>
        </div>

        {/* Right Section */}
        <div
          className="w-full h-32  md:h-auto   rounded-md md:w-1/2 bg-cover bg-center bg-[url(https://images.pexels.com/photos/17485710/pexels-photo-17485710/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-visualises-the-input-and-output-of-neural-networks-and-how-ai-systems-perceive-data-it-was-created-by-rose-pilkington.png)]  flex flex-col justify-center items-center p-6 sm:p-8 md:p-10 order-first md:order-last"
        >
         
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;