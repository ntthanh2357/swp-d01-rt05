import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { getFavoriteScholarships } from '../services/seekerApi';

const FavoriteContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoriteContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoriteProvider');
    }
    return context;
};

export const FavoriteProvider = ({ children }) => {
    const { user } = useContext(UserContext);
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    // Load danh sách yêu thích khi user đăng nhập
    useEffect(() => {
        if (user && user.isLoggedIn && user.role === 'seeker') {
            loadFavorites();
        } else {
            setFavoriteIds(new Set());
        }
    }, [user]);

    const loadFavorites = async () => {
        if (!user?.accessToken) return;
        
        setLoading(true);
        try {
            const response = await getFavoriteScholarships(user.accessToken);
            if (response.status === 200 && Array.isArray(response.data)) {
                const ids = new Set(response.data.map(fav => 
                    fav.scholarship?.scholarshipId || fav.scholarshipId
                ));
                setFavoriteIds(ids);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToFavorites = (scholarshipId) => {
        setFavoriteIds(prev => new Set([...prev, scholarshipId]));
    };

    const removeFromFavorites = (scholarshipId) => {
        setFavoriteIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(scholarshipId);
            return newSet;
        });
    };

    const isFavorite = (scholarshipId) => {
        return favoriteIds.has(scholarshipId);
    };

    const refreshFavorites = () => {
        loadFavorites();
    };

    const value = {
        favoriteIds,
        isFavorite,
        addToFavorites,
        removeFromFavorites,
        refreshFavorites,
        loading
    };

    return (
        <FavoriteContext.Provider value={value}>
            {children}
        </FavoriteContext.Provider>
    );
}; 