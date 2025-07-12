import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  condition: string;
  size: string;
  brand: string;
  seller: string;
  addedDate: string;
  available: boolean;
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('rewear-wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('rewear-wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoading]);

  const addToWishlist = (item: Omit<WishlistItem, 'addedDate' | 'available'>) => {
    setWishlistItems(prevItems => {
      const existingItem = prevItems.find(wishlistItem => wishlistItem.id === item.id);
      
      if (existingItem) {
        toast({
          title: "Already in Wishlist",
          description: "This item is already in your wishlist."
        });
        return prevItems;
      } else {
        const newItem: WishlistItem = {
          ...item,
          addedDate: new Date().toISOString(),
          available: true
        };
        const newItems = [...prevItems, newItem];
        toast({
          title: "Added to Wishlist",
          description: "Item has been added to your wishlist."
        });
        return newItems;
      }
    });
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist."
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist."
    });
  };

  const isInWishlist = (itemId: string) => {
    return wishlistItems.some(item => item.id === itemId);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const getAvailableItems = () => {
    return wishlistItems.filter(item => item.available);
  };

  const getUnavailableItems = () => {
    return wishlistItems.filter(item => !item.available);
  };

  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
    getAvailableItems,
    getUnavailableItems
  };
}; 