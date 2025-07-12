# ReWear – Community Clothing Exchange

**Email:** harsh.panchal.0910@gmail.com

## Overview
ReWear is a web-based platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. The goal is to promote sustainable fashion and reduce textile waste by encouraging users to reuse wearable garments instead of discarding them.

## 🚀 Features

### 🔐 Authentication & User Management
- **User Registration & Login** - Secure account creation with email verification
- **Google OAuth Integration** - One-click login with Google accounts
- **Session Management** - JWT-based authentication with secure cookies
- **User Profiles** - Complete user profiles with points, ratings, and activity history
- **Password Management** - Secure password reset and change functionality

### 🛍️ Product Management
- **Product Listing** - Comprehensive product creation with detailed information
- **Image Upload** - Cloudinary integration for high-quality image storage and optimization
- **Product Categories** - Organized browsing by clothing types (Dresses, Tops, Bottoms, etc.)
- **Product Details** - Rich product information including:
  - Brand, color, material, size, condition
  - Original price and current points value
  - Detailed measurements and descriptions
  - Multiple high-quality images with gallery view
  - Seller information and ratings

### 🔍 Advanced Search & Filtering
- **Smart Search** - Full-text search across product titles and descriptions
- **Multi-Filter System** - Filter by category, size, condition, brand, color, price range
- **Advanced Search** - Combined filters for precise product discovery
- **Sorting Options** - Sort by newest, price (low/high), popularity, likes, views
- **Real-time Results** - Debounced search with instant results

### ❤️ Wishlist System
- **Add to Wishlist** - Save favorite items for later
- **Wishlist Management** - View, organize, and manage saved items
- **Wishlist Status** - Real-time wishlist status indicators
- **Wishlist Analytics** - Track available vs sold items
- **Quick Actions** - Easy add/remove from wishlist with visual feedback

### 🛒 Shopping Experience
- **Responsive Design** - Mobile-first design that works on all devices
- **Grid & List Views** - Flexible product display options
- **Product Gallery** - Multi-image product galleries with navigation
- **Price Display** - Clear points-based pricing with original price comparison
- **Condition Indicators** - Visual condition badges (Excellent, Good, Fair)
- **Seller Information** - Complete seller profiles with ratings and reviews

### 🎨 Modern UI/UX
- **Glass Morphism Design** - Beautiful glass-like interface elements
- **Gradient Accents** - Modern gradient text and button effects
- **Smooth Animations** - Hover effects, transitions, and micro-interactions
- **Loading States** - Skeleton loaders and progress indicators
- **Error Handling** - User-friendly error messages and recovery options
- **Dark/Light Theme Support** - Adaptive color schemes

### 🔧 Technical Features
- **Microservices Architecture** - Separate auth and product services
- **RESTful APIs** - Clean, well-documented API endpoints
- **Database Integration** - MongoDB with optimized indexes
- **Image Processing** - Automatic image optimization and transformations
- **CORS Support** - Cross-origin resource sharing for development
- **Health Checks** - Service health monitoring endpoints

### 📱 Mobile Responsiveness
- **Responsive Layout** - Adapts to all screen sizes
- **Touch-Friendly** - Optimized for mobile interactions
- **Fast Loading** - Optimized images and lazy loading
- **Progressive Web App** - PWA-ready with offline capabilities

### 🔒 Security Features
- **JWT Authentication** - Secure token-based authentication
- **HTTPS Support** - Secure communication protocols
- **Input Validation** - Comprehensive data validation
- **XSS Protection** - Cross-site scripting prevention
- **CSRF Protection** - Cross-site request forgery protection

### 📊 Analytics & Insights
- **User Activity Tracking** - Monitor user engagement
- **Product Performance** - Track views, likes, and interactions
- **Search Analytics** - Understand user search patterns
- **Wishlist Analytics** - Monitor wishlist engagement

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

### Backend
- **FastAPI** - Modern, fast Python web framework
- **MongoDB** - NoSQL database with PyMongo
- **JWT** - JSON Web Token authentication
- **Cloudinary** - Cloud image management
- **Python-dotenv** - Environment variable management

### Infrastructure
- **Docker** - Containerization support
- **CORS** - Cross-origin resource sharing
- **HTTPX** - Async HTTP client
- **Uvicorn** - ASGI server

## 🌟 Key Benefits

1. **Sustainability** - Promotes clothing reuse and reduces textile waste
2. **Community** - Builds a community of fashion-conscious users
3. **Affordability** - Access to quality clothing through points system
4. **Convenience** - Easy-to-use platform with advanced search
5. **Trust** - User ratings and verification system
6. **Modern UX** - Beautiful, intuitive interface design

## 🎯 Future Enhancements

- **Real-time Chat** - Direct messaging between users
- **Payment Integration** - Secure payment processing
- **Shipping Integration** - Automated shipping labels
- **AI Recommendations** - Smart product suggestions
- **Social Features** - User following and activity feeds
- **Mobile App** - Native iOS and Android applications
- **Analytics Dashboard** - Advanced user and business analytics