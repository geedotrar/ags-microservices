import React from 'react';

const CreateProductWidget = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-4 right-4 flex items-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition duration-200 z-50"
    >
      <span className="text-2xl font-bold">+</span>
      <span className="font-medium text-sm">Add New Product</span>
    </button>
  );
};

export default CreateProductWidget;
