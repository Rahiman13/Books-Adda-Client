import React, { useState, useEffect } from 'react';
import Navbar_admin from '../Navbar/Navbar_admin';
import Books_charts from './charts/books_charts';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import EditBookModal from './EditBookModal';

const BookDetails = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('https://books-adda-backend.onrender.com/books');
            if (response.ok) {
                const bookData = await response.json();
                setBooks(bookData);
            } else {
                console.error('Failed to fetch books');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleEditClick = (book) => {
        setSelectedBook(book);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = async (bookId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://books-adda-backend.onrender.com/books/${bookId}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        setBooks(books.filter(book => book._id !== bookId));
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Book has been deleted.',
                            icon: 'success'
                        });
                    } else {
                        console.error('Failed to delete book');
                    }
                } catch (error) {
                    console.error('Error deleting book:', error);
                }
            }
        });
    };

    const handleModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedBook(null);
    };

    const handleBookUpdate = (updatedBook) => {
        if (updatedBook && updatedBook._id) {
            setBooks(books.map(book => (book._id === updatedBook._id ? updatedBook : book)));
        }
        handleModalClose();
    };

    return (
        <>
            <div className="flex flex-col-2 lg:flex-row ">
                <Navbar_admin />
                <div className="container mx-auto mt-8 px-5 mb-8">
                    <h1 className="text-3xl font-bold text-center mb-8">Available Books</h1>
                    <div className="container flex flex-col-2 lg:flex-row mb-8 justify-center items-center">
                        <Books_charts />
                    </div>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Book Name</th>
                                <th className="border border-gray-300 px-4 py-2">Author Name</th>
                                <th className="border border-gray-300 px-4 py-2">Copies Available</th>
                                <th className="border border-gray-300 px-4 py-2">Genre</th>
                                <th className="border border-gray-300 px-4 py-2">Price</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book._id}>
                                    <td className="border border-gray-300 px-4 py-2">{book.title}</td>
                                    <td className="border border-gray-300 px-4 py-2">{book.author}</td>
                                    <td className="border border-gray-300 px-4 py-2">{book.copiesAvailable}</td>
                                    <td className="border border-gray-300 px-4 py-2">{book.genre}</td>
                                    <td className="border border-gray-300 px-4 py-2">${book.price}</td>
                                    <td className="border border-gray-300 px-4 py-3 text-center space-x-2">
                                        <button onClick={() => handleEditClick(book)}>
                                            <FaEdit className="text-blue-500" />
                                        </button>
                                        <button onClick={() => handleDeleteClick(book._id)}>
                                            <FaTrash className="text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isEditModalOpen && (
                <EditBookModal
                    book={selectedBook}
                    onClose={handleModalClose}
                    onUpdate={handleBookUpdate}
                />
            )}
        </>
    );
};

export default BookDetails;
