import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
