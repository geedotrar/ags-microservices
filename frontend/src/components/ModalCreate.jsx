import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ModalCreate = ({ isOpen, onClose, onCreated }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });

  const formatPrice = (value) => {
    if (!value) return '';
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        description: '',
        price: '',
        image: null,
      });
      setPreviewImage(null);
    }
  }, [isOpen]);


  const handlePriceChange = (e) => {
    const inputValue = e.target.value;
    let numericValue = inputValue.replace(/\D/g, '');
  
    const maxPrice = 99999999;
  
    if (parseInt(numericValue) > maxPrice) {
      numericValue = maxPrice.toString();
      toast.error('Max Price is 99.999.999');
    }
  
    setFormData((prev) => ({
      ...prev,
      price: numericValue,
    }));
  };
    
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      } else {
        setPreviewImage(null);
      }
    } else if (name === 'price') {
      handlePriceChange(e);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); 

    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('image', formData.image);

    try {
      await axios.post('http://localhost:8080/products/create', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Product created successfully!');
      onCreated();
      onClose();
    } catch (error) {
      if (error.response?.data) {
        const data = error.response.data;

        if (data.error) {
          if (typeof data.error === 'string') {
            toast.error(data.error);
          } else if (typeof data.error === 'object') {
            const messages = Object.values(data.error).flat().join('\n');
            toast.error(messages);
          } else {
            toast.error(data.message || 'Validation failed');
          }
        } else if (data.message) {
          toast.error(data.message);
        } else {
          toast.error('Failed to create product.');
        }
      } else {
        toast.error('Failed to create product.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-white bg-opacity-70 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-4 border-[#033149] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg w-[90%] md:w-[400px] p-6 space-y-4 relative"
        >
          <h2 className="text-xl font-semibold text-slate-800">Create Product</h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />

          <input
            type="text"
            name="price"
            placeholder="Price"
            required
            className="w-full p-2 border rounded"
            value={formatPrice(formData.price)}
            onChange={handleChange}
          />

          {previewImage && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Preview Image:
              </label>
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-40 object-cover rounded border"
              />
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            required
            className="w-full"
            onChange={handleChange}
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border py-2 px-4 text-sm text-slate-600 hover:bg-slate-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#033149] py-2 px-4 text-sm text-white hover:bg-[#055a75]"
              disabled={loading}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalCreate;
