import React, { createContext, useContext, useState, useEffect,useRef } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom'
import { User, Search, ShoppingCart } from 'lucide-react'
import axios from 'axios'
import { login, signup, logout, getCurrentUser } from './services/auth'
import SignUp from './components/signup';
import Login from './components/Login';  
import { createOrder, updateOrderAddress, cancelOrder } from './services/order';
import emailjs from '@emailjs/browser';


// Updated productData
const productData = {
  1: [ // Sofas and Chairs
    { id: 101, name: 'Modern Leather Sofa', description: 'Sleek and comfortable leather sofa', price: 999.99, image: 'https://img.freepik.com/free-photo/industrial-living-room-interior-design-with-faux-leather-sofa_53876-126770.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 102, name: 'Velvet Armchair', description: 'Luxurious velvet armchair', price: 399.99, image: 'https://img.freepik.com/free-photo/living-pillow-residential-couch-light_1203-4119.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 103, name: 'Recliner Chair', description: 'Comfortable recliner for relaxation', price: 549.99, image: 'https://img.freepik.com/premium-photo/brown-leather-recliner-with-black-seat-black-armrest_1231149-2.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 104, name: 'Sectional Sofa', description: 'Large sectional sofa for family rooms', price: 1299.99, image: 'https://img.freepik.com/premium-photo/sofa-apartment_278455-3683.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 105, name: 'Accent Chair', description: 'Stylish accent chair for any room', price: 249.99, image: 'https://img.freepik.com/free-photo/background-zoom-calls-with-chair-plant_23-2149684454.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 106, name: 'Chaise Lounge', description: 'Elegant chaise lounge for lounging', price: 599.99, image: 'https://img.freepik.com/premium-photo/contemporary-orange-chaise-lounge-adds-touch-elegance-comfort-minimalist-room-setting_1103944-12194.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 107, name: 'Ottoman', description: 'Versatile ottoman for extra seating or as a footrest', price: 149.99, image: 'https://img.freepik.com/premium-photo/stylish-long-red-velour-ottoman-footstool-exposition-hall-furniture-store_328764-10237.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 108, name: 'Loveseat', description: 'Cozy loveseat for small spaces', price: 699.99, image: 'https://img.freepik.com/premium-photo/japandi-boho-beige-interior-with-sofa-stucco-background-light-modern-australian-livingroom-d_370638-1043.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 109, name: 'Wingback Chair', description: 'Classic wingback chair with modern touch', price: 449.99, image: 'https://img.freepik.com/premium-photo/living-room-with-armchair_84738-8255.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 110, name: 'Bean Bag Chair', description: 'Casual and fun bean bag chair', price: 99.99, image: 'https://img.freepik.com/free-photo/home-retro-decor-decoration-interior_1203-4643.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
  ],
  2: [ // Tables
    { id: 201, name: 'Dining Table Set', description: 'Elegant dining table with 6 chairs', price: 899.99, image: 'https://images.unsplash.com/photo-1617104551722-3b2d51366400?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    { id: 202, name: 'Coffee Table', description: 'Modern coffee table with storage', price: 299.99, image: 'https://img.freepik.com/premium-photo/tea-cup-cup-full-tea-professional-picture_693193-2958.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 203, name: 'Side Table', description: 'Compact side table for living room', price: 129.99, image: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    { id: 204, name: 'Console Table', description: 'Slim console table for entryway', price: 199.99, image: 'https://img.freepik.com/premium-photo/stylish-floral-composition-beautiful-flowers-modern-vases-retro-wooden-commode-with-elegant-accessories-blossom-concept-with-shadows-beige-wall-interior-design_431307-1490.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 205, name: 'Extendable Dining Table', description: 'Extendable dining table for flexible seating', price: 599.99, image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    { id: 206, name: 'Nest of Tables', description: 'Set of 3 nesting tables', price: 179.99, image: 'https://img.freepik.com/free-photo/beautiful-shot-modern-wooden-furniture-isolated-white-background_181624-25290.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 207, name: 'Bar Table', description: 'High bar table with 4 stools', price: 449.99, image: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    { id: 208, name: 'Folding Table', description: 'Versatile folding table for various uses', price: 89.99, image: 'https://img.freepik.com/premium-photo/delicious-breakfast-with-fresh-croissants-ripe-berries-beautiful-wooden-table_73989-8124.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 209, name: 'Outdoor Dining Table', description: 'Weather-resistant outdoor dining table', price: 349.99, image: 'https://img.freepik.com/free-photo/life-style_1122-1815.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 210, name: 'Glass Top Table', description: 'Modern glass top table with metal base', price: 279.99, image: 'https://img.freepik.com/free-photo/glass-tablet-with-flower-vase_1203-486.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
  ],
  3: [ // Bedding & Bedroom Essentials
    { id: 301, name: 'Queen Size Mattress', description: 'Comfortable queen size mattress', price: 699.99, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    { id: 302, name: 'Duvet Cover Set', description: 'Soft duvet cover set with pillowcases', price: 89.99, image: 'https://img.freepik.com/premium-photo/bed-with-pink-blanket-pillow-with-pink-pillowcase-pillowcase-with-pink-pillowcase_884630-95.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 303, name: 'Memory Foam Pillow', description: 'Supportive memory foam pillow', price: 49.99, image: 'https://img.freepik.com/premium-photo/beautiful-interior-photographs-modern-bedroom-comfortable-pillows-orthopedic_713163-122.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 304, name: 'Bed Sheet Set', description: 'High-quality bed sheet set', price: 79.99, image: 'https://img.freepik.com/premium-photo/white-beige-pile-linen-bedclothes-blankets-sheets_157402-1317.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 305, name: 'Comforter', description: 'Warm and cozy comforter', price: 99.99, image: 'https://img.freepik.com/free-photo/bed-arrangement-with-fresh-sheets_23-2150551113.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 306, name: 'Mattress Topper', description: 'Plush mattress topper for extra comfort', price: 129.99, image: 'https://media.istockphoto.com/id/1387865929/photo/mattress-memory-foam-bed-topper.jpg?b=1&s=612x612&w=0&k=20&c=Zb3cAGpaf-8O7Diyi9O5-OyWwNSjr68QlnI8Dge4dIw=' },
    { id: 307, name: 'Bed Skirt', description: 'Decorative bed skirt', price: 39.99, image: 'https://img.freepik.com/premium-photo/interior-with-white-bed-linen-sofa-bedroom-with-bed-white-bedding-bedside-table-white_874909-9669.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 308, name: 'Throw Blanket', description: 'Soft throw blanket for bed or couch', price: 59.99, image: 'https://images.unsplash.com/photo-1600369672770-985fd30004eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    { id: 309, name: 'Bed Pillows Set', description: 'Set of 2 comfortable bed pillows', price: 69.99, image: 'https://img.freepik.com/free-photo/bed-arrangement-with-fresh-sheets_23-2150551111.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 310, name: 'Mattress Protector', description: 'Waterproof mattress protector', price: 34.99, image: 'https://img.freepik.com/premium-photo/woman-is-putting-bedding-cover-mattress-pad-bed-putting-off-cleaning-process_325774-608.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
  ],
  4: [ // Curtains and Mattresses and other stuff which we need in life 
    { id: 401, name: 'Blackout Curtains', description: 'Light-blocking blackout curtains', price: 69.99, image: 'https://img.freepik.com/premium-photo/interior-home_1048944-22775417.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 402, name: 'Sheer Curtains', description: 'Lightweight sheer curtains', price: 39.99, image: 'https://img.freepik.com/premium-psd/interior-room-with-white-curtains_176382-1279.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 403, name: 'Thermal Curtains', description: 'Energy-saving thermal curtains', price: 79.99, image: 'https://img.freepik.com/free-photo/elegant-blue-drapes-surrounding-window_157027-4204.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 404, name: 'Curtain Rod Set', description: 'Adjustable curtain rod with finials', price: 29.99, image: 'https://img.freepik.com/free-photo/curtain-with-sunlight_1339-4059.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 405, name: 'King Size Mattress', description: 'Luxurious king size mattress', price: 899.99, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    { id: 406, name: 'Twin Mattress', description: 'Comfortable twin size mattress', price: 299.99, image: 'https://img.freepik.com/premium-photo/bedroom-apartment-bed-wardrobe-bedside-tables-t_278455-5321.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 407, name: 'Memory Foam Mattress', description: 'Supportive memory foam mattress', price: 599.99, image: 'https://img.freepik.com/premium-photo/orthopedic-mattress-dreamscape_989064-13306.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 408, name: 'Hybrid Mattress', description: 'Best of both worlds hybrid mattress', price: 749.99, image: 'https://img.freepik.com/premium-photo/orthopedic-mattress-heavenly-haven_989064-9957.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 409, name: 'Curtain Tiebacks', description: 'Decorative curtain tiebacks', price: 19.99, image: 'https://img.freepik.com/free-photo/house-creative-modern-couch-lamp_1203-4133.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 410, name: 'Window Valance', description: 'Stylish window valance', price: 24.99, image: 'https://img.freepik.com/premium-photo/curtain-window-with-decorative_97891-15.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
  ],
  5: [ // Storage & Organization
    { id: 501, name: 'Bookshelf', description: 'Spacious bookshelf for home or office', price: 199.99, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1139&q=80' },
    { id: 502, name: 'Dresser', description: '6-drawer dresser for bedroom storage', price: 349.99, image: 'https://img.freepik.com/premium-photo/wooden-chest-drawers-with-niche-scandinavian-bedroom-3d-rendering_295714-2527.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 503, name: 'Storage Ottoman', description: 'Multi-functional storage ottoman', price: 129.99, image: 'https://img.freepik.com/premium-photo/white-blue-chest-drawers-with-blue-floral-design_1022944-39298.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 504, name: 'Closet Organizer', description: 'Complete closet organization system', price: 179.99, image: 'https://img.freepik.com/free-photo/wardrobe-renovation-concept_23-2149190370.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 505, name: 'Under-bed Storage', description: 'Rolling under-bed storage containers', price: 49.99, image: 'https://img.freepik.com/premium-photo/free-photo-beautiful-modern-bedroom-white-colors-scandinavian-styles_125604-750.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 506, name: 'Shoe Rack', description: 'Multi-tier shoe rack', price: 39.99, image: 'https://img.freepik.com/free-photo/view-shoe-rack-with-storage-space-footwear_23-2150839906.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 507, name: 'Wall Mounted Shelves', description: 'Set of 3 floating wall shelves', price: 59.99, image: 'https://img.freepik.com/premium-photo/diy-floating-glass-frame-shelves_1036975-51948.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 508, name: 'Coat Rack', description: 'Freestanding coat rack with shoe storage', price: 89.99, image: 'https://img.freepik.com/premium-photo/empty-clothes-hangers-hanging-clothes-rack-bedroom-copy-spase_339295-25.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 509, name: 'Storage Baskets', description: 'Set of 5 woven storage baskets', price: 34.99, image: 'https://img.freepik.com/free-photo/plastic-baskets-shelf-store_78492-3929.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 510, name: 'File Cabinet', description: '2-drawer file cabinet', price: 119.99, image: 'https://img.freepik.com/premium-photo/white-drawer-with-silver-handle-is-partially-open-revealing-stack-colorful-files_1380939-1274.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
  ],
  6: [ // Home Decor
    { id: 601, name: 'Wall Clock', description: 'Modern wall clock', price: 39.99, image: 'https://img.freepik.com/free-photo/square-clock-indoors-still-life_23-2150436141.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 602, name: 'Table Lamp', description: 'Stylish table lamp for ambient lighting', price: 59.99, image: 'https://img.freepik.com/free-photo/view-contemporary-photorealistic-lamp_23-2151038896.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 603, name: 'Decorative Pillows', description: 'Set of 3 decorative throw pillows', price: 49.99, image: 'https://img.freepik.com/premium-photo/sturdy-brown-tweed-sofa-with-grey-patterned-pillows_65102-202.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 604, name: 'Wall Art', description: 'Abstract canvas wall art', price: 79.99, image: 'https://img.freepik.com/premium-vector/boho-poster-set-hand-drawn-shapes-trees-birds_574175-61.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 605, name: 'Area Rug', description: 'Soft and stylish area rug', price: 129.99, image: 'https://img.freepik.com/premium-photo/stylish-room-with-beautiful-rug-furniture-view-interior-design_1339860-4610.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 606, name: 'Vase Set', description: 'Set of 3 decorative vases', price: 69.99, image: 'https://img.freepik.com/free-photo/different-vases-with-yellow-purple-light-arrangement_23-2149835482.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 607, name: 'Mirror', description: 'Large framed wall mirror', price: 99.99, image: 'https://img.freepik.com/free-photo/interior-decor-with-mirror-potted-plant_23-2149428032.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 608, name: 'Candle Holders', description: 'Set of 5 metallic candle holders', price: 44.99, image: 'https://img.freepik.com/free-photo/handcrafted-wooden-decorative-candles-support_23-2151003021.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 609, name: 'Artificial Plant', description: 'Lifelike artificial potted plant', price: 29.99, image: 'https://img.freepik.com/free-photo/still-life-with-indoor-plants_23-2151024948.jpg?ga=GA1.1.1464388367.1725458079' },
    { id: 610, name: 'Throw Blanket', description: 'Soft decorative throw blanket', price: 39.99, image: 'https://img.freepik.com/premium-photo/interior-plaid-sofa-texture-table-design-wallpaper_8353-2863.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
  ],
}

// Create CartContext This function from React creates 
//a "context" that allows you to share data between components without passing props down manually at every level.
const CartContext = createContext(null)

// CartProvider component
function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  //This hook is used to perform side effects (like fetching data or modifying the DOM).
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
// This is a custom hook that allows you to easily access the cart's state and functions from any component in your app that is wrapped by the CartProvider.
function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}



function Header({ onSearch }) {
  const currentUser = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [userName, setUserName] = React.useState('');
  
  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
    navigate('/search-results')
  }

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);

  const handleLogout = () => {
    logout(); // Clear the user's session
    navigate('/login'); // Redirect to the login page
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex flex-col w-full">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/login"><User className="text-gray-600 hover:text-gray-800" /></Link>
            <span className="text-lg font-medium uppercase">
              {userName || 'Guest'}
              </span>
              {userName && (
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline ml-4"
              >
                Logout
              </button>
            )}
          </div>
          <nav>
            <ul className="flex space-x-8 uppercase text-sm font-medium">
              <li><Link to="/" className="hover:text-gray-600">Home</Link></li>
              <li><Link to="/cart" className="hover:text-gray-600">Cart ({cartItemsCount})</Link></li>
              <li><Link to="/about" className="hover:text-gray-600">About</Link></li>
              <li><Link to="/contact" className="hover:text-gray-600">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <div className="bg-gradient-to-tr from-[#FFDAB9] to-[#FFB6C1] p-12 rounded-lg shadow-lg">
        <div className="container mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold tracking-tight">STYLE SPACE</h1>
          <h2 className="text-2xl font-medium">ONE STOP SITE FOR FURNITURE AND HOME DECOR</h2>
          <div className="max-w-2xl mx-auto relative">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 rounded-full border-2 border-black pr-12"
              />
              <button 
                type="submit" 
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


// Home Page Component
function Home() {
  const categories = [
    { id: 1, name: 'Sofas and Chairs', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'},
    { id: 2, name: 'Tables', image: 'https://images.unsplash.com/photo-1617104551722-3b2d51366400?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    { id: 3, name: 'Bedding & Bedroom Essentials', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    { id: 4, name: 'Curtains and Mattress', image: 'https://img.freepik.com/free-photo/pillow-bed_74190-2139.jpg?ga=GA1.1.1464388367.1725458079&semt=ais_hybrid' },
    { id: 5, name: 'Storage & Organization', image: 'https://img.freepik.com/free-photo/organized-cabinet-home_23-2148857491.jpg?t=st=1731748655~exp=1731752255~hmac=869f269929667a2dcc7d418ea166868387a5c1b2ad159598fe554a7d7a2144a4&w=360' },
    { id: 6, name: 'Home Decor', image: 'https://img.freepik.com/free-photo/armchair-green-living-room-with-copy-space_43614-910.jpg?t=st=1731748660~exp=1731752260~hmac=8ee7d6cea1b78ad3c9c33696162a927d5c56cad198d131016bd0de55cf35cd71&w=1060' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`} // Corrected this line
            className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <img src={category.image} alt={category.name} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h2 className="text-2xl font-semibold text-white">{category.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}  

// Product Category Page Component
function ProductCategory() {
  const { id } = useParams()
  const products = productData[id] || []
  const { addToCart } = useCart()

  const categories = [
    { id: 1, name: 'Sofas and Chairs' },
    { id: 2, name: 'Tables' },
    { id: 3, name: 'Bedding & Bedroom Essentials' },
    { id: 4, name: 'Curtains and Mattress' },
    { id: 5, name: 'Storage & Organization' },
    { id: 6, name: 'Home Decor' },
  ];
  
  const category = categories.find(cat => cat.id === parseInt(id));
  const categoryName = category ? category.name : 'Unknown Category';
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{categoryName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
            <button 
              onClick={() => addToCart(product)}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [newAddress, setNewAddress] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem('currentOrder'));
    if (savedOrder) {
      setOrder(savedOrder);
    }
  }, []);

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      await cancelOrder(order._id, token);
      alert('Order canceled successfully!');
      setOrder(null);
      localStorage.removeItem('currentOrder');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  const handleUpdateAddress = async () => {
    if (!order || !newAddress.trim()) {
      alert('Please enter a valid address');
      return;
    }

    try {
      const updatedOrder = await updateOrderAddress(order._id, newAddress, token);
      alert('Address updated successfully!');
      setOrder(updatedOrder);
      localStorage.setItem('currentOrder', JSON.stringify(updatedOrder));
      setNewAddress('');
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Failed to update address. Please try again.');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>
      {cartItems.length === 0 && !order ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {order && (
            <>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
              <p><strong>Delivery Address:</strong> {order.address}</p>
              
              <div className="mt-4">
                <textarea
                  placeholder="Enter new address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleUpdateAddress}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Update Address
                </button>
              </div>
            </>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Cart Items</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b py-4">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 px-2 py-1 rounded-l"
                      >
                        -
                      </button>
                      <span className="bg-gray-100 px-4 py-1">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 px-2 py-1 rounded-r"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            {order ? (
              <button
                onClick={handleCancelOrder}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel Order
              </button>
            ) : (
              <Link
                to="/checkout"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Proceed to Checkout
              </Link>
            )}
          </div>
        </div>
      )}
      <Link to="/" className="block mt-4 text-blue-500 hover:text-blue-700">
        Continue Shopping
      </Link>
    </div>
  );
}
function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(''); // State for the delivery address
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = 10.0;
  const platformFee = 5.0;
  const totalPayable = total + deliveryCharge + platformFee;

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert('Please enter a delivery address');
      return;
    }

    const token = localStorage.getItem('token');
    const orderDetails = {
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalPayable,
      address, // Include the address in the order details
    };

  try {
    console.log('Placing Order:', orderDetails);
    const response = await createOrder(orderDetails, token);
    console.log('Order response:', response);
    if (response && response._id) {
      localStorage.setItem('currentOrder', JSON.stringify(response));
      clearCart();
      alert('Order placed successfully!');
      navigate('/cart');
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Failed to place order. Please try again.');
  }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="space-y-6">
        {/* Delivery Address Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Delivery Address</h2>
          <textarea
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Price Details Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Price Details</h2>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span>Price ({cartItems.length} items)</span>
              <span>${total.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Delivery Charges</span>
              <span>${deliveryCharge.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Platform Fee</span>
              <span>${platformFee.toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-bold">
              <span>Total Payable</span>
              <span>${totalPayable.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Payment Options Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Payment Options</h2>
          <p className="text-gray-600">100% Safe and secure payments</p>
          {/* Add payment options here */}
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Style Space</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="mb-4">
          Style Space is your one-stop destination for all your furniture and home decor needs. We believe that everyone deserves to live in a space that reflects their personal style and enhances their daily life.
        </p>
        <p className="mb-4">
          Founded in 2023, Style Space has quickly become a leader in the online furniture retail industry. Our mission is to provide high-quality, stylish, and affordable furniture to customers across the country.
        </p>
        <p className="mb-4">
          We work with talented designers and reliable manufacturers to bring you a wide range of products that cater to various tastes and budgets. From modern minimalist designs to classic traditional pieces, we have something for everyone.
        </p>
        <p>
          At Style Space, we're not just selling furniture; we're helping you create the home of your dreams. Our team of interior design experts is always ready to assist you in making the best choices for your space.
        </p>
      </div>
    </div>
  )
}


// Contact Page Component

function Contact() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_id', 'template_id', form.current, 'public_key')
      .then(
        () => {
          console.log('SUCCESS!');
          alert('Message sent successfully!');
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Failed to send the message. Please try again.');
        }
      );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="mb-6">
          We'd love to hear from you! Whether you have a question about our products, need design advice, or want to share your feedback, our team is here to help.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              <div>
                <label htmlFor="from_name" className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="from_name"
                  id="from_name"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="from_email" className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="from_email"
                  id="from_email"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700">Message</label>
                <textarea
                  name="message"
                  id="message"
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-2"><strong>Email:</strong> info@stylespace.com</p>
            <p className="mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p className="mb-2"><strong>Address:</strong> 123 Furniture Lane, Decor City, ST 12345</p>
            <p className="mb-4"><strong>Hours:</strong> Monday - Friday: 9am - 5pm EST</p>
            <p>Follow us on social media for the latest updates and design inspiration!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResults({ searchResults }) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Search Results</h1>
      {searchResults.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {searchResults.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
              <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



// Main App Component
export default function App() {
  const [searchResults, setSearchResults] = useState([])
  const [user , setUser] = useState(null);
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser?.user || null); // Update user state with stored data
  }, []);
  const handleSearch = (searchTerm) => {
    const allProducts = Object.values(productData).flat()
    const filteredProducts = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setSearchResults(filteredProducts)
  }

  return (
  
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-100">
          <Header onSearch={handleSearch} user={user} setUser={setUser} />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:id" element={<ProductCategory />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/search-results" element={<SearchResults searchResults={searchResults} />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </Router>
  
  );
}