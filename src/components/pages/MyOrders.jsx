import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Navbar from '../Navbar/Navbar';

const MyOrders = () => {
  const [aggregatedPurchases, setAggregatedPurchases] = useState([]);
  const [deletingPurchaseId, setDeletingPurchaseId] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPurchases = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Login to see your orders');
        return;
      }
      try {
        const response = await axios.get(`https://books-adda-backend.onrender.com/purchase/${userId}`);
        const purchases = response.data;

        // Aggregate purchases by book title
        const purchaseMap = purchases.reduce((acc, purchase) => {
          if (acc[purchase.bookTitle]) {
            acc[purchase.bookTitle].quantity += purchase.quantity;
            acc[purchase.bookTitle].totalPrice += purchase.totalPrice;
          } else {
            acc[purchase.bookTitle] = {
              ...purchase,
              quantity: purchase.quantity,
              totalPrice: purchase.totalPrice,
            };
          }
          return acc;
        }, {});

        setAggregatedPurchases(Object.values(purchaseMap));
      } catch (error) {
        console.error('Error fetching purchase data:', error);
      }
    };

    const fetchAddress = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return;
      }
      try {
        const response = await axios.get(`https://books-adda-backend.onrender.com/address/${userId}`);
        if (response.status === 200) {
          setAddresses(response.data);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };

    fetchPurchases();
    fetchAddress();
  }, []);

  const MySwal = withReactContent(Swal);

  const handleDelete = async (purchaseId) => {
    try {
      // Show confirmation dialog using SweetAlert
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this purchase!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      });

      if (result.isConfirmed) {
        // Make backend API call to delete purchase
        await axios.delete(`https://books-adda-backend.onrender.com/purchase/${purchaseId}`);

        // Update UI by filtering out the deleted purchase
        setAggregatedPurchases(aggregatedPurchases.filter(purchase => purchase._id !== purchaseId));

        MySwal.fire(
          'Deleted!',
          'Your purchase has been deleted.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire(
          'Cancelled',
          'Your purchase is safe :)',
          'error'
        );
      }
    } catch (error) {
      console.error('Error deleting purchase:', error);
      MySwal.fire(
        'Error!',
        'An error occurred while deleting your purchase.',
        'error'
      );
    }
  };

  const handleCancelDelete = () => {
    setDeletingPurchaseId(null); // Reset deleting state
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Login to update your address');
      return;
    }
    try {
      let response;
      if (editingAddress) {
        response = await axios.put(`https://books-adda-backend.onrender.com/address/${editingAddress._id}`, { userId, ...address });
      } else {
        response = await axios.post(`https://books-adda-backend.onrender.com/address`, { userId, ...address });
      }

      if (response.status === 201 || response.status === 200) {
        setShowModal(false);
        setEditingAddress(null);
        setAddress({
          street: '',
          landmark: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        });

        Swal.fire('Success', 'Address saved successfully', 'success');
        const fetchAddress = await axios.get(`https://books-adda-backend.onrender.com/address/${userId}`);
        setAddresses(fetchAddress.data);
      } else {
        Swal.fire('Error', 'Failed to save address', 'error');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Swal.fire('Error', 'An error occurred while saving your address', 'error');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddress(address);
    setShowModal(true);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddress({
      street: '',
      landmark: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    });
    setShowModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this address!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      });

      if (result.isConfirmed) {
        await axios.delete(`https://books-adda-backend.onrender.com/address/${addressId}`);
        setAddresses(addresses.filter((addr) => addr._id !== addressId));

        MySwal.fire(
          'Deleted!',
          'Your address has been deleted.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire(
          'Cancelled',
          'Your address is safe :)',
          'error'
        );
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      MySwal.fire(
        'Error!',
        'An error occurred while deleting your address.',
        'error'
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 flex justify-center">
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-6 mt-20 text-center">My Orders</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col">
              <div className="max-w-lg w-full bg-white px-4 py-4 rounded-md shadow-md overflow-hidden hover:transform">
                <h2 className="text-2xl text-center font-bold mb-4">Addresses</h2>
                {addresses.length > 0 ? (
                  addresses.map((addr, index) => (
                    <div key={index} className="mb-4">
                      <p><strong>Street:</strong> {addr.street}</p>
                      <p><strong>Landmark:</strong> {addr.landmark}</p>
                      <p><strong>City:</strong> {addr.city}</p>
                      <p><strong>State:</strong> {addr.state}</p>
                      <p><strong>Postal Code:</strong> {addr.postalCode}</p>
                      <p><strong>Country:</strong> {addr.country}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleEditAddress(addr)} className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-700">Edit</button>
                        <button onClick={() => handleDeleteAddress(addr._id)} className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-700">Delete</button>
                      </div>
                      <hr className="mt-2" />
                    </div>
                  ))
                ) : (
                  <p>No addresses found.</p>
                )}
                <button onClick={handleAddAddress} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Address</button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-6">
                {aggregatedPurchases.map((purchase) => (
                  <div key={purchase._id} className={`bg-white shadow-md rounded-lg overflow-hidden hover:transform hover:scale-105 ${deletingPurchaseId === purchase._id ? 'opacity-50' : ''}`}>
                    <div className="px-4 py-2 flex">
                      <div className="flex-shrink-0 overflow-hidden rounded-lg">
                        <img src={purchase.bookimageUrl} alt={purchase.bookTitle} className="w-32 h-36 hover:transform hover:scale-110 object-cover rounded-lg" />
                      </div>
                      <div className="ml-4 flex justify-between">
                        <div>
                          <h2 className="text-xl font-semibold mb-2">{purchase.bookTitle}</h2>
                          <p className="text-gray-700"><strong>Purchased Date:</strong> {new Date(purchase.purchasedDate).toLocaleDateString()}</p>
                          <p className="text-gray-700 mb-1"><strong>Quantity:</strong> {purchase.quantity}</p>
                          <p className="text-gray-700 mb-1"><strong>Total Price:</strong> ${purchase.totalPrice}</p>
                        </div>
                        {/* <button onClick={() => handleDelete(purchase._id)} className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-700">Delete</button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingAddress ? 'Edit Address' : 'Add Address'}</h2>
            <form onSubmit={handleSaveAddress} className="grid grid-cols-1 gap-4">
              <div className="">
                <div>
                  <label htmlFor="street" className="block text-gray-700 font-bold mb-2">Street</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="landmark" className="block text-gray-700 font-bold mb-2">Landmark</label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={address.landmark}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-gray-700 font-bold mb-2">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-gray-700 font-bold mb-2">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="postalCode" className="block text-gray-700 font-bold mb-2">Pincode</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-gray-700 font-bold mb-2">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;
