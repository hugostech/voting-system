import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, BarChart3, Users, Settings, Trash2, Edit,
    Eye, EyeOff, ArrowLeft, AlertTriangle, CheckCircle,
    Plus, Upload, X, Camera
} from 'lucide-react';
import { api } from '../services/api';

const AdminPage = ({ onUpdate }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');

    // Dashboard data
    const [dashboardData, setDashboardData] = useState({
        contestants: [],
        statistics: { totalVotes: 0, totalVoters: 0, totalContestants: 0 },
        recentVotes: []
    });

    // Modal states
    const [editingContestant, setEditingContestant] = useState(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showAddContestant, setShowAddContestant] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsLoggedIn(true);
            fetchDashboard();
        }
    }, []);

    const showMessage = (text, type = 'info') => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(''), 5000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.adminLogin(loginForm.email, loginForm.password);
            localStorage.setItem('adminToken', response.token);
            setIsLoggedIn(true);
            showMessage('Login successful!', 'success');
            fetchDashboard();
        } catch (error) {
            showMessage(error.message || 'Login failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
        setLoginForm({ email: '', password: '' });
        navigate('/');
    };

    const fetchDashboard = async () => {
        try {
            const data = await api.getAdminDashboard();
            setDashboardData(data);
        } catch (error) {
            showMessage('Failed to load dashboard data', 'error');
        }
    };

    const handleResetVotes = async () => {
        setLoading(true);
        try {
            await api.resetVotes();
            showMessage('All votes have been reset successfully!', 'success');
            setShowResetConfirm(false);
            fetchDashboard();
            onUpdate();
        } catch (error) {
            showMessage('Failed to reset votes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddContestant = async (formData) => {
        setLoading(true);
        try {
            await api.createContestant(formData);
            showMessage('Contestant added successfully!', 'success');
            setShowAddContestant(false);
            fetchDashboard();
            onUpdate();
        } catch (error) {
            showMessage('Failed to add contestant: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateContestant = async (formData) => {
        setLoading(true);
        try {
            await api.updateContestant(editingContestant._id, formData);
            showMessage('Contestant updated successfully!', 'success');
            setEditingContestant(null);
            fetchDashboard();
            onUpdate();
        } catch (error) {
            showMessage('Failed to update contestant: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContestant = async (id) => {
        setLoading(true);
        try {
            await api.deleteContestant(id);
            showMessage('Contestant deleted successfully!', 'success');
            setShowDeleteConfirm(null);
            fetchDashboard();
            onUpdate();
        } catch (error) {
            showMessage('Failed to delete contestant: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Login Form Component
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="max-w-md w-full mx-4">
                    <button
                        onClick={() => navigate('/')}
                        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </button>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-center mb-6">
                            <Shield className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
                            <p className="text-gray-600">Access the admin dashboard</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={loginForm.email}
                                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="admin@example.com"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={loginForm.password}
                                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                                        placeholder="Enter password"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                            <div className="text-xs text-gray-500 text-center">
                                Default: admin@example.com / admin123
                            </div>
                        </form>

                        {message && (
                            <div className={`mt-4 p-3 rounded-lg text-center ${
                                messageType === 'success' ? 'bg-green-100 text-green-800' :
                                    messageType === 'error' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                            }`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Admin Dashboard
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <Shield className="w-8 h-8 text-blue-600" />
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600">Manage contestants and monitor voting</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Home
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Total Votes</p>
                                <p className="text-3xl font-bold text-blue-600">{dashboardData.statistics.totalVotes}</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Total Voters</p>
                                <p className="text-3xl font-bold text-green-600">{dashboardData.statistics.totalVoters}</p>
                            </div>
                            <Users className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Contestants</p>
                                <p className="text-3xl font-bold text-purple-600">{dashboardData.statistics.totalContestants}</p>
                            </div>
                            <Users className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Contestants Management */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Contestants Management
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowAddContestant(true)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Contestant
                                </button>
                                <button
                                    onClick={() => setShowResetConfirm(true)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Reset Votes
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {dashboardData.contestants.map((contestant, index) => (
                                <div key={contestant._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={contestant.avatar.startsWith('/uploads/')
                                                    ? `http://localhost:5000${contestant.avatar}`
                                                    : contestant.avatar}
                                                alt={contestant.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
                                                }}
                                            />
                                            {index < 3 && (
                                                <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                                                }`}>
                                                    {index + 1}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{contestant.name}</h3>
                                            <p className="text-sm text-gray-600 truncate">{contestant.description}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm">
                                                <span className="text-blue-600 font-medium">{contestant.votes} votes</span>
                                                <span className="text-gray-500">{contestant.voters.length} voters</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingContestant(contestant)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
                                            >
                                                <Edit className="w-3 h-3" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(contestant)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* Voter details */}
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <details className="text-sm">
                                            <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                                                View voter details ({contestant.voters.length} voters)
                                            </summary>
                                            <div className="mt-2 space-y-1 max-h-20 overflow-y-auto">
                                                {contestant.voters.length > 0 ? (
                                                    contestant.voters.map((voter, vIndex) => (
                                                        <div key={vIndex} className="text-xs text-gray-500 flex justify-between">
                                                            <span>{voter.email}</span>
                                                            {voter.isAdmin && <span className="text-yellow-600 font-medium">Admin</span>}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-xs text-gray-400">No votes yet</div>
                                                )}
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Recent Voting Activity
                        </h2>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {dashboardData.recentVotes.length > 0 ? (
                                dashboardData.recentVotes.map((vote, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {vote.contestantId?.name || 'Unknown Contestant'}
                                                </p>
                                                <p className="text-sm text-gray-600">{vote.voterEmail}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(vote.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            vote.isAdmin
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                          {vote.voteWeight} vote{vote.voteWeight > 1 ? 's' : ''}
                            {vote.isAdmin && ' (Admin)'}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No voting activity yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                        messageType === 'success' ? 'bg-green-500 text-white' :
                            messageType === 'error' ? 'bg-red-500 text-white' :
                                'bg-blue-500 text-white'
                    }`}>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            {message}
                        </div>
                    </div>
                )}

                {/* Add Contestant Modal */}
                {showAddContestant && (
                    <ContestantModal
                        title="Add New Contestant"
                        onSave={handleAddContestant}
                        onCancel={() => setShowAddContestant(false)}
                        loading={loading}
                    />
                )}

                {/* Edit Contestant Modal */}
                {editingContestant && (
                    <ContestantModal
                        title="Edit Contestant"
                        contestant={editingContestant}
                        onSave={handleUpdateContestant}
                        onCancel={() => setEditingContestant(null)}
                        loading={loading}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                            <div className="text-center">
                                <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete Contestant</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete <strong>{showDeleteConfirm.name}</strong>?
                                    This action cannot be undone and will remove all votes for this contestant.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(null)}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDeleteContestant(showDeleteConfirm._id)}
                                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        {loading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reset Confirmation Modal */}
                {showResetConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                            <div className="text-center">
                                <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Reset All Votes</h3>
                                <p className="text-gray-600 mb-6">
                                    This action will permanently delete all votes and voting records. This cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowResetConfirm(false)}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleResetVotes}
                                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        {loading ? 'Resetting...' : 'Reset All Votes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Contestant Modal Component
const ContestantModal = ({ title, contestant, onSave, onCancel, loading }) => {
    const [formData, setFormData] = useState({
        name: contestant?.name || '',
        description: contestant?.description || '',
        avatar: contestant?.avatar || ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(
        contestant?.avatar
            ? (contestant.avatar.startsWith('/uploads/')
                ? `http://localhost:5000${contestant.avatar}`
                : contestant.avatar)
            : ''
    );
    const [useUrl, setUseUrl] = useState(!contestant || !contestant.avatar.startsWith('/uploads/'));

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setAvatarPreview(e.target.result);
            reader.readAsDataURL(file);
            setUseUrl(false);
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, avatar: url }));
        setAvatarPreview(url);
        setAvatarFile(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = new FormData();
        submitData.append('name', formData.name.trim());
        submitData.append('description', formData.description.trim());

        if (avatarFile) {
            submitData.append('avatar', avatarFile);
        } else if (formData.avatar && useUrl) {
            submitData.append('avatar', formData.avatar);
        }

        onSave(submitData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <button
                            onClick={onCancel}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            disabled={loading}
                            maxLength={100}
                        />
                    </div>

                    {/* Avatar Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Avatar *
                        </label>

                        {/* Toggle between URL and File Upload */}
                        <div className="flex gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setUseUrl(true)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                    useUrl
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Use URL
                            </button>
                            <button
                                type="button"
                                onClick={() => setUseUrl(false)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                    !useUrl
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Upload File
                            </button>
                        </div>

                        {useUrl ? (
                            <input
                                type="url"
                                value={formData.avatar}
                                onChange={handleUrlChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/image.jpg"
                                disabled={loading}
                            />
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-400">PNG, JPG, GIF, WEBP (max 5MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={loading}
                                        />
                                    </label>
                                </div>
                                {avatarFile && (
                                    <p className="text-sm text-gray-600">
                                        Selected: {avatarFile.name} ({(avatarFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Avatar Preview */}
                        {avatarPreview && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <img
                                    src={avatarPreview}
                                    alt="Avatar preview"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                            required
                            disabled={loading}
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.description.length}/500 characters
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !formData.name.trim() || !formData.description.trim() || (!formData.avatar && !avatarFile)}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminPage;