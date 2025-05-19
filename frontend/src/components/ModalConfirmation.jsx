import React from 'react';

const ModalConfirmation = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[400px] p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>
        <p className="text-slate-600 font-light mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="rounded-md border py-2 px-4 text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-md bg-[#033149] py-2 px-4 text-sm text-white hover:bg-[#055a75]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;
