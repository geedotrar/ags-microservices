import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ModalConfirmation from './ModalConfirmation';
import agsLogo from '../assets/images/ags-logo.png';

const ModalUpdate = ({ isOpen, onClose, product, onUpdated }) => {
  const [confirmType, setConfirmType] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const getImageSrc = (url) => {  
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:8080${url}`;
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });

  const formatPrice = (value) => {
    if (!value) return '';
    const stringValue = String(value); 
    const numericValue = stringValue.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        image: null,
      });
      setPreviewImage(null); 
    }
  }, [product]);

  useEffect(() => {
    if (!isOpen) {
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
      }
    } else if (name === 'price') {
      handlePriceChange(e);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    setLoading(true); 

    try {
      await axios.delete(`http://localhost:8080/products/delete/${product.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Product deleted successfully!');
      onUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    if (!formData.price || Number(formData.price) < 1) {
      toast.error('Price must be at least 1');
      return;
    }  

    const token = localStorage.getItem('token');
    const form = new FormData();

    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    if (formData.image) {
      form.append('image', formData.image);
    }

    setLoading(true); 

    try {
      await axios.put(`http://localhost:8080/products/update/${product.id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Product updated successfully!');
      onUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

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
          className="bg-white rounded-lg shadow-lg w-[90%] md:w-[400px] p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold text-slate-800">Edit Product</h2>

          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            required
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />

          <input
            type="text"
            name="description"
            value={formData.description}
            placeholder="Description"
            required
            className="w-full p-2 border rounded"
            onChange={handleChange}/>
          <input
            type="text"
            name="price"
            value={formatPrice(formData.price)}
            placeholder="Price"
            required
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
          
          {(previewImage || product?.image_url) && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {previewImage ? 'Preview Image:' : 'Current Image:'}
              </label>
              <img
                src={previewImage || getImageSrc(product.image_url)}
                alt="Product preview"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = agsLogo;
                }}
                className="w-full h-40 object-cover rounded border"
              />
            </div>
          )}

          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full"
            onChange={handleChange}
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setConfirmType('delete');
                setShowConfirmModal(true);
              }}
              className="rounded-md bg-red-600 py-2 px-4 text-sm text-white hover:bg-red-700 mr-auto"
            >
              Delete
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md border py-2 px-4 text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                setConfirmType('update');
                setShowConfirmModal(true);
              }}
              className="rounded-md bg-[#033149] py-2 px-4 text-sm text-white hover:bg-[#055a75]"
            >
              Update
            </button>
          </div>

          <ModalConfirmation
            isOpen={showConfirmModal}
            onClose={() => {
              setShowConfirmModal(false);
              setConfirmType(null);
            }}
            onConfirm={async () => {
              if (confirmType === 'update') {
                await handleSubmit();
              } else if (confirmType === 'delete') {
                await handleDelete();
              }
              setShowConfirmModal(false);
              setConfirmType(null);
            }}
            title={confirmType === 'delete' ? 'Delete Product' : 'Update Product'}
            message={
              confirmType === 'delete'
                ? `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
                : `Are you sure you want to update "${product.name}"?`
            }
          />
        </form>
      </div>
    </>
  );
};

export default ModalUpdate;
