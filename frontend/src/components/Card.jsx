import React from 'react';
import ThreeDotsVerticalIcon from '../assets/icons/ThreeDotsVerticalIcon.js'; 
import agsLogo from '../assets/images/ags-logo.png';

const idrFormat = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
};

const Card = ({
  bgColor,
  description,
  name,
  price,
  imageSrc,
  isActive,
  onToggleActive,
  onEdit
}) => (
  <div className={`relative flex-shrink-0 m-4 overflow-hidden ${bgColor} rounded-lg w-64 h-[360px] shadow-lg flex flex-col`}>
    <svg
      className="absolute bottom-0 left-0 mb-8"
      viewBox="0 0 375 283"
      fill="none"
      style={{ transform: 'scale(1.5)', opacity: 0.1 }}
    >
      <rect
        x="159.52"
        y="175"
        width="152"
        height="152"
        rx="8"
        transform="rotate(-45 159.52 175)"
        fill="white"
      />
      <rect
        y="107.48"
        width="152"
        height="152"
        rx="8"
        transform="rotate(-45 0 107.48)"
        fill="white"
      />
    </svg>

    {/* Product Image */}
    <div className="w-full h-48 overflow-hidden rounded-t-lg">
        <img
          src={imageSrc}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = agsLogo;
          }}
          className="object-cover w-full h-48"
        />
      </div>


    {/* Product Info */}
    <div className="relative text-white px-4 mt-6 flex flex-col h-[120px]">
      <span className="block font-semibold text-xl truncate">{name}</span>
      <span className="text-lg font-bold mb-1">
        {idrFormat(price)}
      </span>
      <span className="block text-[10px] opacity-75">{description}</span>
    </div>

    {/* Action */}
    <div className="absolute bottom-4 left-4 flex items-center space-x-2 z-10">
      {onToggleActive && (
        <button
        onClick={onToggleActive}
        aria-label={isActive ? 'Deactivate' : 'Activate'}
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
          isActive ? 'bg-green-400 hover:bg-green-700' : 'bg-gray-400 hover:bg-gray-300'
        }`}
      >
        <div
          className="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"
          style={{
            transform: isActive ? 'translateX(1.5rem)' : 'translateX(0)',
          }}
        />
      </button>
      )}
    </div>

    {onEdit && (
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={onEdit}
          aria-label="Edit"
          className="p-2 hover:bg-[#055a75] rounded-full"
        >
          <ThreeDotsVerticalIcon fill="#ffffff" />
        </button>
      </div>
    )}
  </div>
);

export default Card;
  