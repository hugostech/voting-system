import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Vote, Shield } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
                            🗳️ VoteSystem
                        </Link>

                        <div className="flex items-center gap-6">
                            <Link
                                to="/"
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                    location.pathname === '/'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <Home className="w-4 h-4" />
                                Home
                            </Link>

                            <Link
                                to="/admin"
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                    location.pathname === '/admin'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <Shield className="w-4 h-4" />
                                Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-white border-t mt-auto">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-gray-600">
                        <p>&copy; 2025 VoteSystem. Built with React & Node.js</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;