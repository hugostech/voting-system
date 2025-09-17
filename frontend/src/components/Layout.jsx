import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Vote, Shield } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-white border-t mt-auto">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-gray-600">
                        <p>&copy; 2025 VoteSystem. Built with Backbone Studios</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;