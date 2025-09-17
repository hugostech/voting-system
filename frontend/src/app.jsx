import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import VotePage from './components/VotePage';
import AdminPage from './components/AdminPage';
import Layout from './components/Layout';
import { api } from './services/api';

function App() {
    const [contestants, setContestants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchContestants = async () => {
        try {
            setLoading(true);
            const data = await api.getContestants();
            setContestants(data);
        } catch (err) {
            setError('Failed to load contestants');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContestants();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchContestants}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage contestants={contestants} onUpdate={fetchContestants} />} />
                    <Route path="/vote/:id" element={<VotePage contestants={contestants} onUpdate={fetchContestants} />} />
                    <Route path="/admin" element={<AdminPage onUpdate={fetchContestants} />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;