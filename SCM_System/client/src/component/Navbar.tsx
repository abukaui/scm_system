import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isLoggedIn = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const dashboardLink = role === 'admin' ? '/admin' : '/dashboard';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>SCM <span className="text-blue-600">Portal</span></span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
                    <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
                    <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">About</Link>
                    
                    {isLoggedIn ? (
                        <div className="flex items-center space-x-4">
                            <Link to={dashboardLink} className="text-blue-600 font-semibold hover:text-blue-700">Dashboard</Link>
                            <button 
                                onClick={handleLogout}
                                className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Sign In</Link>
                            <Link 
                                to="/register" 
                                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden text-gray-700 focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 space-y-4 shadow-xl">
                    <Link to="/" className="block text-gray-600 hover:text-blue-600 font-medium">Home</Link>
                    <a href="#features" className="block text-gray-600 hover:text-blue-600 font-medium">Features</a>
                    <Link to="/about" className="block text-gray-600 hover:text-blue-600 font-medium">About</Link>
                    <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
                        {isLoggedIn ? (
                            <>
                                <Link to={dashboardLink} className="text-blue-600 font-semibold">Dashboard</Link>
                                <button onClick={handleLogout} className="text-left text-gray-600 font-medium">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-center text-gray-700 font-medium py-2 border border-gray-200 rounded-lg">Sign In</Link>
                                <Link to="/register" className="text-center bg-blue-600 text-white py-2.5 rounded-lg font-semibold">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
