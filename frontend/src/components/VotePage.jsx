import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Send, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const VotePage = ({ contestants, onUpdate }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contestant, setContestant] = useState(null);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [step, setStep] = useState('email'); // email, verify, success
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info'); // info, success, error
    const [isAdmin, setIsAdmin] = useState(false);
    const [voteWeight, setVoteWeight] = useState(1);

    useEffect(() => {
        const foundContestant = contestants.find(c => c._id === id);
        if (foundContestant) {
            setContestant(foundContestant);
        } else {
            navigate('/');
        }
    }, [id, contestants, navigate]);

    const showMessage = (text, type = 'info') => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(''), 5000);
    };

    const sendVerification = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await api.sendVerificationCode(email, id);
            setVerificationCode(response.verificationCode || '123456'); // For demo
            setIsAdmin(response.isAdmin);
            setVoteWeight(response.voteWeight);
            setStep('verify');
            showMessage(`Verification code sent to ${email}${response.isAdmin ? ' (Admin Account - 20x weight)' : ''}`, 'success');
        } catch (error) {
            showMessage(error.message || 'Failed to send verification code', 'error');
        } finally {
            setLoading(false);
        }
    };

    const verifyAndVote = async (e) => {
        e.preventDefault();
        if (!inputCode || inputCode.length !== 6) {
            showMessage('Please enter the 6-digit verification code', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await api.verifyAndVote(email, id, inputCode);
            setStep('success');
            showMessage(`Vote submitted successfully! ${response.isAdmin ? '(Admin vote - 20x weight)' : ''}`, 'success');
            setTimeout(() => {
                onUpdate();
                navigate('/');
            }, 3000);
        } catch (error) {
            showMessage(error.message || 'Invalid verification code', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!contestant) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #f5f1eb 0%, #e8ddd4 25%, #d4c4b0 50%, #c4b299 75%, #b5a082 100%)'
            }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#8B4513' }}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{
            background: 'linear-gradient(135deg, #f5f1eb 0%, #e8ddd4 25%, #d4c4b0 50%, #c4b299 75%, #b5a082 100%)'
        }}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-32 left-16 w-24 h-24 rounded-full border-2 border-amber-800"></div>
                <div className="absolute top-64 right-24 w-16 h-16 rounded-full border border-amber-700"></div>
                <div className="absolute bottom-32 left-1/3 w-20 h-20 rounded-full border border-amber-600"></div>
            </div>

            <div className="relative container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 flex items-center gap-2 transition-colors hover:opacity-80"
                    style={{ color: '#8B4513' }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium">Back to Home</span>
                </button>

                <div className="max-w-md mx-auto">
                    {/* Contestant Info */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-amber-200">
                        <div className="text-center">
                            <div className="relative inline-block mb-4">
                                <img
                                    src={contestant.avatar}
                                    alt={contestant.name}
                                    className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face';
                                    }}
                                />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                                     style={{ backgroundColor: '#D4AF37' }}>
                                    <span className="text-white text-sm font-bold">★</span>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mb-2" style={{ color: '#8B4513', fontFamily: 'serif' }}>
                                {contestant.name}
                            </h2>
                            <p className="mb-4 leading-relaxed" style={{ color: '#A0522D' }}>
                                {contestant.description}
                            </p>

                            <div className="flex justify-center gap-8 text-sm">
                                <div className="text-center">
                                    <div className="text-2xl font-bold" style={{ color: '#B8860B' }}>{contestant.votes}</div>
                                    <div className="text-xs" style={{ color: '#A0522D' }}>Current Votes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold" style={{ color: '#B8860B' }}>{contestant.voters.length}</div>
                                    <div className="text-xs" style={{ color: '#A0522D' }}>Total Voters</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Voting Form */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-200">
                        <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: '#8B4513', fontFamily: 'serif' }}>
                            Cast Your Vote
                        </h3>
                        <div className="w-16 h-0.5 mx-auto mb-6" style={{ backgroundColor: '#D4AF37' }}></div>

                        {step === 'email' && (
                            <form onSubmit={sendVerification} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-3" style={{ color: '#8B4513' }}>
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#A0522D' }} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                                            style={{
                                                borderColor: '#D4AF37',
                                                backgroundColor: '#FEFEFE',
                                                color: '#8B4513'
                                            }}
                                            placeholder="Enter your email address"
                                            required
                                            disabled={loading}
                                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)'}
                                            onBlur={(e) => e.target.style.boxShadow = 'none'}
                                        />
                                    </div>
                                    <p className="text-xs mt-2" style={{ color: '#B8860B' }}>
                                        You'll receive a verification code to confirm your vote
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    style={{
                                        background: loading ? '#A0522D' : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 50%, #8B4513 100%)'
                                    }}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Sending...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <Send className="w-5 h-5" />
                                            <span>Send Verification Code</span>
                                        </div>
                                    )}
                                </button>
                            </form>
                        )}

                        {step === 'verify' && (
                            <form onSubmit={verifyAndVote} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-3" style={{ color: '#8B4513' }}>
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        value={inputCode}
                                        onChange={(e) => setInputCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full py-4 px-4 border-2 rounded-xl text-center text-3xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 transition-all duration-300"
                                        style={{
                                            borderColor: '#D4AF37',
                                            backgroundColor: '#FEFEFE',
                                            color: '#8B4513'
                                        }}
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                        disabled={loading}
                                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)'}
                                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                                    />
                                    <p className="text-xs mt-2" style={{ color: '#B8860B' }}>
                                        Enter the 6-digit code sent to {email}
                                    </p>

                                    {isAdmin && (
                                        <div className="mt-4 p-4 rounded-xl border-2" style={{ backgroundColor: '#FFF8DC', borderColor: '#DAA520' }}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">⭐</span>
                                                <div>
                                                    <p className="text-sm font-semibold" style={{ color: '#B8860B' }}>
                                                        Admin Account Detected
                                                    </p>
                                                    <p className="text-xs" style={{ color: '#A0522D' }}>
                                                        Your vote counts as {voteWeight} votes
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep('email')}
                                        className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 border-2"
                                        style={{
                                            borderColor: '#D4AF37',
                                            color: '#8B4513',
                                            backgroundColor: 'transparent'
                                        }}
                                        disabled={loading}
                                    >
                                        Change Email
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || inputCode.length !== 6}
                                        className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        style={{
                                            background: (loading || inputCode.length !== 6) ? '#A0522D' : 'linear-gradient(135deg, #228B22 0%, #32CD32 50%, #00FF00 100%)'
                                        }}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Voting...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Submit Vote</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 'success' && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                                     style={{ backgroundColor: '#F0F8E8', border: '3px solid #32CD32' }}>
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </div>

                                <h3 className="text-2xl font-bold mb-3" style={{ color: '#228B22', fontFamily: 'serif' }}>
                                    Vote Submitted!
                                </h3>

                                <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: '#D4AF37' }}></div>

                                <p className="mb-2" style={{ color: '#8B4513' }}>
                                    Thank you for voting for <span className="font-semibold">{contestant.name}</span>
                                </p>

                                {isAdmin && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-2"
                                         style={{ backgroundColor: '#FFF8DC', border: '1px solid #DAA520' }}>
                                        <span>⭐</span>
                                        <span className="text-sm font-medium" style={{ color: '#B8860B' }}>
                      Admin vote: {voteWeight}x weight applied
                    </span>
                                    </div>
                                )}

                                <div className="mt-6 animate-pulse">
                                    <div className="flex items-center justify-center gap-2" style={{ color: '#A0522D' }}>
                                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#D4AF37', animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#D4AF37', animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#D4AF37', animationDelay: '300ms' }}></div>
                                    </div>
                                    <p className="text-sm mt-2" style={{ color: '#A0522D' }}>
                                        Redirecting to homepage...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Message Display */}
                        {message && (
                            <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 border-l-4 ${
                                messageType === 'success' ? 'bg-green-50 border-green-400' :
                                    messageType === 'error' ? 'bg-red-50 border-red-400' :
                                        'bg-blue-50 border-blue-400'
                            }`}>
                                <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                    messageType === 'success' ? 'text-green-600' :
                                        messageType === 'error' ? 'text-red-600' :
                                            'text-blue-600'
                                }`} />
                                <div className={`text-sm font-medium ${
                                    messageType === 'success' ? 'text-green-800' :
                                        messageType === 'error' ? 'text-red-800' :
                                            'text-blue-800'
                                }`}>
                                    {message}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VotePage;