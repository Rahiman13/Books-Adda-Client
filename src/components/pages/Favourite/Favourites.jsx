import React, { useContext, useEffect, useState } from 'react';
import { FavoritesContext } from './FavoritesContext';
import Swal from 'sweetalert2';
import Navbar from '../../Navbar/Navbar';
import { BsHeartFill } from 'react-icons/bs';
import axios from 'axios';

const Favorites = () => {
    const { favorites, toggleFavorite } = useContext(FavoritesContext);
    const [favoritesList, setFavoritesList] = useState([]);

    useEffect(() => {
        const fetchFavoriteBooks = async () => {
            const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];
            if (favoriteIds.length > 0) {
                try {
                    const response = await axios.get(`https://books-adda-backend.onrender.com/books`);
                    const allBooks = response.data;
                    const favoriteBooks = allBooks.filter(book => favoriteIds.includes(book._id));
                    setFavoritesList(favoriteBooks);
                } catch (error) {
                    console.error('Error fetching favorite books:', error);
                }
            }
        };

        fetchFavoriteBooks();
    }, [favorites]);

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


    const handleBuy = async (book) => {
        const userId = localStorage.getItem('userId');
    
        if (!userId) {
            // Redirect to login page or handle not logged in scenario
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
                confirmButtonText: 'Confirm Purchase',
            });
    
            if (copiesAvailable) {
                const purchaseData = {
                    userId,
                    bookTitle: book.title,
                    bookimageUrl: book.imageUrl,
                    author: book.author,
                    price: book.price,
                    quantity: parseInt(copiesAvailable),
                    totalPrice: book.price * parseInt(copiesAvailable),
                    purchasedDate: new Date().toISOString(),
                };
    
                const response = await axios.post('https://books-adda-backend.onrender.com/purchase', purchaseData);
    
                if (response.status === 201) {
                    // Remove from favorites list if present
                    const isFavorite = favorites.some(fav => fav._id === book._id);
                    if (isFavorite) {
                        const updatedFavoritesList = favoritesList.filter(fav => fav._id !== book._id);
                        setFavoritesList(updatedFavoritesList);
                        const favoriteIds = updatedFavoritesList.map(fav => fav._id);
                        localStorage.setItem('favorites', JSON.stringify(favoriteIds));
                    }
    
                    Swal.fire('Purchased!', `You have successfully purchased "${book.title}".`, 'success');
                    fetchBooks();
                } else {
                    Swal.fire('Error!', 'Failed to complete purchase', 'error');
                }
            }
        } catch (error) {
            console.error('Error purchasing book:', error);
            Swal.fire('Error!', 'Failed to complete purchase', 'error');
        }
    };
    
    const handleToggleFavorite = (book) => {
        toggleFavorite(book);
        const updatedFavoritesList = favoritesList.filter(fav => fav._id !== book._id);
        setFavoritesList(updatedFavoritesList);

        const favoriteIds = updatedFavoritesList.map(fav => fav._id);
        localStorage.setItem('favorites', JSON.stringify(favoriteIds));
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-24">
                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">My Favorite Books</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favoritesList.map((book) => (
                        <div key={book._id} className="bg-white rounded-lg shadow-md p-4 relative">
                            <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="w-full h-40 sm:h-48 md:h-56 lg:h-64 mb-2 rounded-lg cursor-pointer object-cover"
                                onClick={() => handleViewMore(book)}
                            />
                            <div className="flex justify-between">
                                <h2 className="text-xl sm:text-2xl font-bold italic mb-2">{book.title}</h2>
                                <button
                                    className=" text-2xl bg-white p-1 rounded-full"
                                    onClick={() => handleToggleFavorite(book)}
                                >
                                    <BsHeartFill color="red" />
                                </button>
                            </div>
                            <p className="text-gray-600 mb-2"><strong className='text-md font-bold'>Author:</strong> {book.author}</p>
                            <p className="text-gray-600 mb-2"><strong className='text-md font-bold'>Copies Available:</strong> {book.copiesAvailable}</p>
                            <p className="text-gray-600 mb-2"><strong className='text-md font-bold'>Price:</strong> ₹{book.price}</p>

                            <div className="flex justify-between">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                                    onClick={() => handleViewMore(book)}
                                >
                                    View More
                                </button>
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                                    onClick={() => handleBuy(book)}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Favorites;
