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
import emailjs from 'emailjs-com';
import AddressModal from './AddressModal';
import { toast } from 'react-toastify';

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
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        fetchBooks();
        fetchUserData();
        fetchAddresses();
        setAddresses;

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



    const fetchAddresses = async (userId) => {
        try {
            const response = await axios.get(`https://books-adda-backend.onrender.com/address/${userId}`);
            if (response.status === 200) {
                setAddresses(response.data);
                console.log('Addresses fetched:', response.data); // Log addresses to debug
            } else {
                console.error('Failed to fetch addresses');
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };



    const fetchUserData = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return;
        }
        try {
            const response = await axios.get(`https://books-adda-backend.onrender.com/user/${userId}`);
            if (response.status === 200) {
                setUserData(response.data);
                fetchAddresses(userId); // Correctly fetch addresses
            } else {
                console.error('Failed to fetch user data:', response.status);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };



    const handleAddAddress = async (address) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.post(`https://books-adda-backend.onrender.com/address/${userId}`);
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

        // Fetch the latest addresses before proceeding
        await fetchAddresses(userId);

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
                    input: 'select',
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

                    // Show purchase details
                    const result = await Swal.fire({
                        title: 'Purchase Details',
                        html: `
                            <p><strong>Book:</strong> ${book.title}</p>
                            <p><strong>Author:</strong> ${book.author}</p>
                            <p><strong>Price:</strong> ₹${book.price}</p>
                            <p><strong>Quantity:</strong> ${copiesAvailable}</p>
                            <p><strong>Total Price:</strong> ₹${book.price * parseInt(copiesAvailable)}</p>
                            <p><strong>Purchased Date:</strong> ${new Date().toLocaleDateString()}</p>
                            <hr>
                            <p><strong>Shipping Address:</strong><br>${selectedAddress.street}, ${selectedAddress.landmark}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.postalCode}, ${selectedAddress.country}</p>
                        `,
                        showCancelButton: true,
                        confirmButtonText: 'Confirm',
                        cancelButtonText: 'Cancel'
                    });

                    if (result.isConfirmed) {
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

                            Swal.fire({
                                title: 'Success!',
                                text: 'Your purchase has been completed successfully.',
                                icon: 'success',
                                confirmButtonText: 'OK',
                            });
                            fetchBooks();

                        }
                        const emailParams = {
                            to_email: userData.email,
                            book_title: book.title,
                            book_author: book.author,
                            quantity: copiesAvailable,
                            total_price: book.price * parseInt(copiesAvailable),
                            shipping_address: `${selectedAddress.street}, ${selectedAddress.landmark}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.postalCode}, ${selectedAddress.country}`
                        };

                        emailjs.send('service_dxwypsr', 'template_7lp5izd', emailParams, 'azBe2gyRVGRab22cR')
                            .then((response) => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Check your email for details',
                                    toast: true,
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.onmouseenter = Swal.stopTimer;
                                        toast.onmouseleave = Swal.resumeTimer;
                                    }
                                });
                            })
                            .catch((error) => {
                                console.error('Error sending email:', error);
                            });

                        Swal.fire('Success', 'Book purchased successfully!', 'success');
                    }
                    else {
                        Swal.fire('Error!', 'Failed to complete purchase', 'error');
                    }
                }
            }
        }
        catch (error) {
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

    const indexOfLastBook = (currentPage + 1) * itemsPerPage;
    const indexOfFirstBook = indexOfLastBook - itemsPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const imageUrls = [
        { url: lib1, text: 'Welcome to Books Adda, your one-stop shop for all genres!' },
        { url: lib2, text: 'Explore a vast collection of books at unbeatable prices!' },
        { url: lib3, text: 'Find your next great read at Books Adda!' },
        { url: lib4, text: 'Join our community of book lovers today!' }
    ];

    const handleSelectAddress = async (address) => {
        const userId = localStorage.getItem('userId');

        const purchaseData = {
            userId,
            bookTitle: selectedBook.title,
            bookimageUrl: selectedBook.imageUrl,
            author: selectedBook.author,
            price: selectedBook.price,
            quantity: copiesAvailable,
            shippingAddress: address,
        };

        try {
            const response = await axios.post('https://books-adda-backend.onrender.com/myorders', purchaseData);
            if (response.status === 201) {
                Swal.fire('Success!', 'Book purchased successfully', 'success');
            } else {
                console.error('Failed to purchase book');
            }
        } catch (error) {
            console.error('Error purchasing book:', error);
            Swal.fire('Error!', 'Failed to complete purchase', 'error');
        } finally {
            setIsAddressModalOpen(false); // Close the modal
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid mx-auto mt-20">
                <Carousel
                    showThumbs={false}
                    autoPlay
                    infiniteLoop
                    interval={5000}
                    transitionTime={500}
                    showStatus={false}
                    showArrows
                >
                    {imageUrls.map((item, index) => (
                        <div key={index} className="relative">
                            <img src={item.url} alt={`Carousel image ${index + 1}`} className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl md:text-4xl font-bold p-4">
                                <Typewriter
                                    words={[item.text]}
                                    loop={false}
                                    cursor
                                    cursorStyle='_'
                                    typeSpeed={70}
                                    deleteSpeed={50}
                                    delaySpeed={1000}
                                />
                            </div>
                        </div>
                    ))}
                </Carousel>
                <div className="mt-6 px-8 pb-4">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-semibold">
                            Welcome to Our Book's Adda
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 sm:px-8">
                        {currentBooks.map((book) => (
                            <motion.div
                                key={book._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                layout
                            >
                                <div className="overflow-hidden">
                                    <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-cover hover:scale-110 transition ease-in" />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between">
                                        <h2 className="text-xl sm:text-2xl font-bold italic mb-2">{book.title}</h2>
                                        <button
                                            className="text-red-500 hover:text-red-700 relative focus:outline-none"
                                            onClick={() => handleToggleFavorite(book)}
                                        >
                                            {isFavorite(book._id) ? <BsHeartFill size={20} /> : <BsHeart size={20} />}
                                        </button>
                                    </div>
                                    <p className="text-gray-600 mb-2"><strong className="text-md font-bold">Author:</strong> {book.author}</p>
                                    <p className="text-gray-600 mb-2"><strong className="text-md font-bold">Copies Available:</strong> {book.copiesAvailable}</p>
                                    <p className="text-gray-600 mb-2"><strong className="text-md font-bold">Price:</strong> ₹{book.price}</p>
                                    <div className="flex justify-between">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 font-semibold rounded mt-4 hover:bg-blue-700"
                                            onClick={() => handleViewMore(book)}
                                        >
                                            View More
                                        </button>
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 font-semibold rounded mt-4 hover:bg-green-700"
                                            onClick={() => handleBuy(book)}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4 mr-5">
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center">
                                <ReactPaginate
                                    pageCount={totalPages}
                                    onPageChange={handlePageClick}
                                    containerClassName="flex items-center space-x-2"
                                    activeClassName="font-bold"
                                    previousLabel={<MdArrowBackIos />}
                                    nextLabel={<MdArrowForwardIos />}
                                    previousClassName="px-2 py-1 rounded text-black text-lg"
                                    nextClassName="px-2 py-1 rounded text-black text-lg"
                                    disabledClassName="opacity-50 cursor-not-allowed"
                                    pageClassName="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
                                    breakClassName="px-2 py-1"
                                    activeLinkClassName="font-bold"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <Services />
                <Gallery />
                <Testimonials />
                <AddressModal
                    isOpen={isAddressModalOpen}
                    addresses={addresses}
                    onSelect={handleSelectAddress}
                    onRequestClose={() => setIsAddressModalOpen(false)}
                />
            </div >
        </>
    );
};

export default User;
