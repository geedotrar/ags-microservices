import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import ModalConfirmation from "../components/ModalConfirmation";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import ModalCreate from "../components/ModalCreate";
import CreateProductWidget from "../components/CreateProductWidget";
import ModalUpdate from "../components/ModalUpdate";

const Product = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";

  const hasPermission = (permission = "") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      const decoded = jwtDecode(token);

      if (decoded.role === "admin") return true;

      if (permission && decoded.permissions) {
        return decoded.permissions.includes(permission);
      }

      return false;
    } catch (e) {
      console.error("Invalid token or missing permissions", e);
      return false;
    }
  };

  const fetchProducts = async (
    pageNumber = page,
    keyword = search,
    status = queryParams.get("status") || ""
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      let endpoint = `http://localhost:8080/products?page=${pageNumber}`;
      if (keyword) endpoint += `&search=${keyword}`;
      if (status !== "") endpoint += `&status=${status}`;

      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProductData(res.data.data);
      setTotalPages(res.data.total_pages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentSearch = queryParams.get("search") || "";
    const currentStatus = queryParams.get("status") || "";
    fetchProducts(page, currentSearch, currentStatus);
  }, [location.search, page]);

  const handleToggleClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const toggleStatus = async (productId) => {
    setLoadingStatus(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/products/update-status/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProductData((prev) =>
        prev.map((product) =>
          product.id === productId
            ? { ...product, status: product.status === 1 ? 0 : 1 }
            : product
        )
      );

      toast.success("Successfully changed status!");
    } catch (error) {
      console.error("Failed to change status:", error);
      toast.error("Failed to change status.");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setLoadingStatus(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/products/delete/${productToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchProducts(page);
      setProductToDelete(null);
      setShowDeleteModal(false);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product.");
      alert("Failed to delete product.");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setShowModalUpdate(true);
  };

  const getImageSrc = (url) => {
    if (url.startsWith("http")) {
      return url;
    }
    return `http://localhost:8080${url}`;
  };

  return (
    <div className="flex flex-col items-center relative">
      {(loading || loadingStatus) && (
        <div className="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
          <div className="flex justify-center items-center mt-[50vh]">
            <div className="fas fa-circle-notch fa-spin fa-5x text-[#033149]"></div>
          </div>
        </div>
      )}

      {productData.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-center text-gray-500 text-lg">Product is empty.</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center">
          {productData.map((product) => (
            <div
              key={product.id}
              className="w-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex flex-col items-center"
            >
              <Card
                bgColor="bg-[#033149]"
                id={product.id}
                description={product.description}
                name={product.name}
                price={product.price}
                imageSrc={getImageSrc(product.image_url)}
                isActive={product.status === 1}
                onToggleActive={
                  hasPermission("update_products")
                    ? () => handleToggleClick(product)
                    : null
                }
                onDelete={
                  hasPermission("delete_products")
                    ? () => handleDeleteClick(product)
                    : null
                }
                onEdit={
                  hasPermission("update_products")
                    ? () => handleEditClick(product)
                    : null
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {productData.length > 0 && (
        <div className="mt-6 mb-8 space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-[#033149] text-white rounded disabled:bg-gray-400 hover:bg-[#055a75] transition"
          >
            Previous
          </button>

          <span className="text-lg font-semibold">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-[#033149] text-white rounded disabled:bg-gray-400 hover:bg-[#055a75] transition"
          >
            Next
          </button>
        </div>
      )}

      {hasPermission("create_products") && (
        <CreateProductWidget onClick={() => setShowModalCreate(true)} />
      )}

      <ModalUpdate
        isOpen={showModalUpdate}
        onClose={() => setShowModalUpdate(false)}
        product={productToEdit}
        onUpdated={() => fetchProducts(page)}
      />

      <ModalConfirmation
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
        onConfirm={async () => {
          if (selectedProduct) {
            await toggleStatus(selectedProduct.id);
            setShowModal(false);
            setSelectedProduct(null);
          }
        }}
        title={
          selectedProduct?.status === 0
            ? "Activate Product"
            : "Deactivate Product"
        }
        message={`Are you sure you want to ${
          selectedProduct?.status === 0 ? "activate" : "deactivate"
        } "${selectedProduct?.name}"?`}
      />

      <ModalConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${
          productToDelete?.name
        }"? This action cannot be undone.`}
      />

      <ModalCreate
        isOpen={showModalCreate}
        onClose={() => setShowModalCreate(false)}
        onCreated={() => fetchProducts(page)}
      />
    </div>
  );
};

export default Product;
