import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await axios.get(`https://books-adda-backend.onrender.com/${userId}/favorites`);
                    if (response.status === 200) {
                        setFavorites(response.data);
                        updateLocalStorage(response.data);
                    } else {
                        console.error('Failed to fetch favorites data');
                    }
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                    setError(error);
                }
            }
        };

        fetchFavorites();
    }, []);

    const toggleFavorite = async (book) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No userId found in localStorage');
            return;
        }

        const isFavorite = favorites.some(fav => fav._id === book._id);
        let updatedFavorites;
        try {
            if (isFavorite) {
                updatedFavorites = favorites.filter(fav => fav._id !== book._id);
                setFavorites(updatedFavorites);
                await axios.delete(`https://books-adda-backend.onrender.com/users/${userId}/favorites/${book._id}`);
            } else {
                updatedFavorites = [...favorites, book];
                setFavorites(updatedFavorites);
                await axios.post(`https://books-adda-backend.onrender.com/users/${userId}/favorites`, { bookId: book._id });
            }
            updateLocalStorage(updatedFavorites);
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };

    const updateLocalStorage = (favoritesList) => {
        const favoriteIds = favoritesList.map(fav => fav._id);
        localStorage.setItem('favorites', JSON.stringify(favoriteIds));
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, error }}>
            {children}
        </FavoritesContext.Provider>
    );
};
