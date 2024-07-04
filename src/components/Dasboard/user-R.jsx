import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../pages/Favourite/FavoritesContext';
import Navbar from '../Navbar/Navbar';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';
import lib1 from '../assets/lib1.jpg';
import lib2 from '../assets/lib2.jpg';
import lib3 from '../assets/lib3.jpg';
import lib4 from '../assets/lib4.jpg';
import { motion } from 'framer-motion';
import ReactPaginate from 'react-paginate';
import { BsHeart, BsHeartFill, BsSearch } from 'react-icons/bs';
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { Typewriter } from 'react-simple-typewriter';
import Testimonials from './testimonials';
import Services from './services';
import Gallery from './gallery';

const User = () => {
    const [books, setBooks] = useState([]);
    const { favorites, toggleFavorite } = useContext(FavoritesContext);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;
    const [userData, setUserData] = useState({});
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        fetchBooks();
        fetchUserData();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('https://books-adda-backend.onrender.com/books');
            if (response.status === 200) {
                const booksWithGenre = response.data.map(book => ({
                    ...book,
                    genre: book.genre.toLowerCase()
                }));
                setBooks(booksWithGenre);
                setFilteredBooks(booksWithGenre);
            } else {
                console.error('Failed to fetch books data');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const fetchUserData = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        
        try {
            const response = await axios.get(`https://books-adda-backend.onrender.com/users/${userId}`);
            if (response.status === 200) {
                setUserData(response.data);
                fetchAddresses(response.data._id);
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchAddresses = async (userId) => {
        try {
            const response = await axios.get(`https://books-adda-backend.onrender.com/address/${userId}`);
            if (response.status === 200) {
                setAddresses(response.data);
            } else {
                console.error('Failed to fetch addresses');
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };
    
    const handleAddAddress = async (address) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.post('https://books-adda-backend.onrender.com/address', { userId, ...address });
            if (response.status === 201) {
                fetchAddresses(userId);
                Swal.fire('Success', 'Address added successfully', 'success');
            } else {
                console.error('Failed to add address');
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const handleEditAddress = async (addressId, updatedAddress) => {
        try {
            const response = await axios.put(`https://books-adda-backend.onrender.com/address/${addressId}`, updatedAddress);
            if (response.status === 200) {
                const userId = localStorage.getItem('userId');
                fetchAddresses(userId);
                Swal.fire('Success', 'Address updated successfully', 'success');
            } else {
                console.error('Failed to update address');
            }
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            const response = await axios.delete(`https://books-adda-backend.onrender.com/address/${addressId}`);
            if (response.status === 200) {
                const userId = localStorage.getItem('userId');
                fetchAddresses(userId);
                Swal.fire('Success', 'Address deleted successfully', 'success');
            } else {
                console.error('Failed to delete address');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        const filtered = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
        setFilteredBooks(filtered);
        setCurrentPage(0);
    };

    const isFavorite = (bookId) => favorites.some(book => book._id === bookId);

    const handleViewMore = (book) => {
        Swal.fire({
            title: book.title,
            html: `
                <div style="text-align: left;">
                    <p><strong style="font-size: 18px; font-weight: semibold;">Summary:</strong></p>
                    <p>${book.summary}</p>
                </div>
            `,
            imageUrl: book.imageUrl,
            imageWidth: 400,
            imageHeight: 400,
            imageAlt: 'Book cover',
            confirmButtonText: 'Close',
            showCancelButton: true,
            cancelButtonText: 'Buy',
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                handleBuy(book);
            }
        });
    };

    const handleBuy = async (book) => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            navigate('/login');
            return;
        }

        try {
            const { value: copiesAvailable } = await Swal.fire({
                title: 'Enter number of copies to purchase:',
                input: 'number',
                inputValue: 1,
                inputAttributes: {
                    min: 1,
                    max: book.copiesAvailable,
                    step: 1,
                },
                inputValidator: (value) => {
                    if (!value || value < 1 || value > book.copiesAvailable) {
                        return 'Please enter a valid number of copies';
                    }
                },
                showCancelButton: true,
                confirmButtonText: 'Next',
            });

            if (copiesAvailable) {
                const { value: selectedAddressId } = await Swal.fire({
                    title: 'Select Address',
                    input: 'radio',
                    inputOptions: addresses.reduce((options, address) => {
                        options[address._id] = `${address.street}, ${address.landmark}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
                        return options;
                    }, {}),
                    inputPlaceholder: 'Select an address',
                    showCancelButton: true,
                    confirmButtonText: 'Next',
                    inputValidator: (value) => {
                        if (!value) {
                            return 'You need to select an address';
                        }
                    }
                });

                if (selectedAddressId) {
                    const selectedAddress = addresses.find(address => address._id === selectedAddressId);

                    const purchaseData = {
                        userId,
                        bookTitle: book.title,
                        bookimageUrl: book.imageUrl,
                        author: book.author,
                        price: book.price,
                        quantity: parseInt(copiesAvailable),
                        totalPrice: book.price * parseInt(copiesAvailable),
                        purchasedDate: new Date().toISOString(),
                        address: selectedAddress,
                    };

                    const response = await axios.post('https://books-adda-backend.onrender.com/purchase', purchaseData);

                    if (response.status === 201) {
                        // Remove from favorites if it exists
                        if (isFavorite(book._id)) {
                            toggleFavorite(book); // Update context state
                            const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];
                            const updatedFavoriteIds = favoriteIds.filter(id => id !== book._id);
                            localStorage.setItem('favorites', JSON.stringify(updatedFavoriteIds));
                        }

                        Swal.fire('Purchased!', `You have successfully purchased "${book.title}".`, 'success');
                        fetchBooks();
                    } else {
                        Swal.fire('Error!', 'Failed to complete purchase', 'error');
                    }
                }
            }
        } catch (error) {
            console.error('Error purchasing book:', error);
            Swal.fire('Error!', 'Failed to complete purchase', 'error');
        }
    };

    const handleToggleFavorite = (book) => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            navigate('/login');
        } else {
            toggleFavorite(book);
            const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];
            if (isFavorite(book._id)) {
                const updatedFavoriteIds = favoriteIds.filter(id => id !== book._id);
                localStorage.setItem('favorites', JSON.stringify(updatedFavoriteIds));
            } else {
                favoriteIds.push(book._id);
                localStorage.setItem('favorites', JSON.stringify(favoriteIds));
            }
        }
    };

    const pageCount = Math.ceil(filteredBooks.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentPageItems = filteredBooks.slice(offset, offset + itemsPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className="bg-white">
            <Navbar />
            <Carousel autoPlay interval={3000} infiniteLoop showStatus={false} showThumbs={false}>
                <div>
                    <img src={lib1} alt="Library 1" />
                </div>
                <div>
                    <img src={lib2} alt="Library 2" />
                </div>
                <div>
                    <img src={lib3} alt="Library 3" />
                </div>
                <div>
                    <img src={lib4} alt="Library 4" />
                </div>
            </Carousel>
            <div className="container mx-auto py-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-semibold">
                        Welcome to Our Book Store
                    </h1>
                    <p className="text-gray-600">
                        <Typewriter words={['Discover your next great read...', 'Explore our collection...']} loop={false} cursor cursorStyle="_" typeSpeed={70} deleteSpeed={50} delaySpeed={1000} />
                    </p>
                </div>
                <div className="mb-6 flex justify-center">
                    <input type="text" className="border rounded-lg py-2 px-4 w-full md:w-1/2 lg:w-1/3" placeholder="Search by title or author..." value={searchTerm} onChange={handleSearch} />
                    <button className="ml-2 bg-blue-500 text-white rounded-lg py-2 px-4 flex items-center">
                        <BsSearch className="mr-2" />
                        Search
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentPageItems.map(book => (
                        <motion.div key={book._id} whileHover={{ scale: 1.05 }} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img src={book.imageUrl} alt={book.title} className="w-full h-64 object-cover" />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold">{book.title}</h2>
                                <p className="text-gray-600">by {book.author}</p>
                                <p className="text-gray-800 font-bold">${book.price}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <button onClick={() => handleViewMore(book)} className="bg-blue-500 text-white rounded-lg py-2 px-4">
                                        View More
                                    </button>
                                    <button onClick={() => handleToggleFavorite(book)} className={`text-2xl ${isFavorite(book._id) ? 'text-red-500' : 'text-gray-400'}`}>
                                        {isFavorite(book._id) ? <BsHeartFill /> : <BsHeart />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <ReactPaginate
                    previousLabel={<MdArrowBackIos />}
                    nextLabel={<MdArrowForwardIos />}
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    containerClassName="flex justify-center mt-6"
                    pageClassName="mx-2"
                    previousClassName="mx-2"
                    nextClassName="mx-2"
                    activeClassName="text-blue-500 font-bold"
                    disabledClassName="text-gray-300"
                />
            </div>
            <Services />
            <Gallery />
            <Testimonials />
        </div>
    );
};

export default User;
