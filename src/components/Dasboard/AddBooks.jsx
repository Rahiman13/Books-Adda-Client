import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../Navbar/Navbar_admin';
import AddBooks_bg from '../assets/AddBooks_bg.jpg';

const AddBooksForm = () => {
  const [publisherName, setPublisherName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [bio, setBio] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [totalCopies, setTotalCopies] = useState('');
  const [genre, setGenre] = useState('');
  const [publishedDate, setPublishedDate] = useState('');

  const handleAddBook = async () => {
    if (!publisherName.trim() || !authorName.trim() || !title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Publisher, Author, and Title are required',
      });
      return;
    }

    try {
      const bookData = {
        publisherName,
        authorName,
        bio,
        title,
        summary,
        imageUrl,
        price: parseFloat(price),
        totalCopies: parseInt(totalCopies, 10),
        genre,
        publishedDate,
      };

      await axios.post('https://books-adda-backend.onrender.com/books', bookData);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Book added successfully',
      });

      // Reset form fields
      setPublisherName('');
      setAuthorName('');
      setBio('');
      setTitle('');
      setSummary('');
      setImageUrl('');
      setPrice('');
      setTotalCopies('');
      setGenre('');
      setPublishedDate('');
    } catch (error) {
      console.error('Error adding book:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add book',
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Navbar className="w-full lg:w-1/4" />
      <div className="container-fluid w-full mx-auto bg-cover bg-center h-auto" style={{ backgroundImage: `url(${AddBooks_bg})` }}>
        <div className="bg-black w-full lg:w-1/2 mx-auto bg-opacity-70 p-8 rounded-lg mt-8 lg:mt-16 shadow-lg">
          <h1 className="text-4xl text-white font-bold mb-6 text-center">Add Books</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              value={publisherName}
              onChange={(e) => setPublisherName(e.target.value)}
              placeholder="Publisher Name"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Author Name"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Author Bio"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book Title"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Genre"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
              placeholder="Total Copies"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Book Summary"
            className="border border-gray-300 p-3 rounded-md w-full mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end">
            <button
              onClick={handleAddBook}
              className="bg-blue-500 text-white px-6 py-3 rounded-md mt-6 hover:bg-blue-700 transition duration-300"
            >
              Add Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBooksForm;
