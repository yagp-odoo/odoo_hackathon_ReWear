import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  added_at: string;
  product: any; // Product details
}

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Load wishlist only once when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]); // Only depend on authentication status

  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getWishlist();
      setWishlist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (!isAuthenticated) {
      setError('Please login to add items to wishlist');
      return false;
    }

    try {
      await apiService.addToWishlist(productId);
      // Reload wishlist to get updated data
      await loadWishlist();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to wishlist');
      return false;
    }
  }, [isAuthenticated, loadWishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!isAuthenticated) {
      setError('Please login to remove items from wishlist');
      return false;
    }

    try {
      await apiService.removeFromWishlist(productId);
      // Reload wishlist to get updated data
      await loadWishlist();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from wishlist');
      return false;
    }
  }, [isAuthenticated, loadWishlist]);

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlist.some(item => item.product_id === productId);
  }, [wishlist]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    wishlist,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearError,
    refreshWishlist: loadWishlist
  };
}; 