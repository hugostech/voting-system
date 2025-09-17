import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Vote, Trophy, Star, Crown, Award } from 'lucide-react';

const HomePage = ({ contestants, onUpdate }) => {
    const navigate = useNavigate();

    const sortedContestants = [...contestants].sort((a, b) => b.votes - a.votes);

    return (
        <div className="min-h-screen" style={{
            background: 'linear-gradient(135deg, #f5f1eb 0%, #e8ddd4 25%, #d4c4b0 50%, #c4b299 75%, #b5a082 100%)'
        }}>
            {/* Header Section */}
            <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-2 border-amber-800"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 rounded-full border border-amber-700"></div>
                    <div className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full border border-amber-600"></div>
                </div>

                <div className="relative container mx-auto px-4 py-16">
                    {/* Title Section */}
                    <div className="text-center mb-16">
                        <div className="mb-8">
                            <h1 className="text-6xl md:text-8xl font-bold mb-4" style={{ color: '#8B4513', fontFamily: 'serif' }}>
                                才艺大赛
                            </h1>
                            <div className="w-32 h-0.5 mx-auto mb-6" style={{ backgroundColor: '#D4AF37' }}></div>
                            <h2 className="text-2xl md:text-3xl font-medium" style={{ color: '#A0522D', fontFamily: 'serif' }}>
                                校园
                            </h2>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <p className="text-lg md:text-xl mb-4" style={{ color: '#8B4513', lineHeight: '1.8' }}>
                                告别常规比赛，这是一场多元才艺的狂欢派对！
                            </p>
                            <p className="text-base md:text-lg" style={{ color: '#A0522D', lineHeight: '1.6' }}>
                                见证12强选手最终舞台，避避魔术，B-Box与中国舞的惊喜中场秀。
                            </p>
                        </div>
                    </div>

                    {/* Event Info */}
                    <div className="max-w-2xl mx-auto mb-16">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-amber-200">
                            <div className="text-center space-y-4">
                                <h3 className="text-2xl font-semibold" style={{ color: '#8B4513' }}>Competition Details</h3>
                                <div className="space-y-2">
                                    <p className="text-lg" style={{ color: '#A0522D' }}>
                                        <span className="font-medium">Time:</span> September 19th 18:00 - 21:00
                                    </p>
                                    <p className="text-lg" style={{ color: '#A0522D' }}>
                                        <span className="font-medium">Venue:</span> UoA Student Quad
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-amber-200">
                                    <p className="text-sm" style={{ color: '#B8860B' }}>
                                        每位演唱会门票，拍立得相机......三重抽奖环节贯穿全场！
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*/!* Statistics Section *!/*/}
            {/*<div className="container mx-auto px-4 mb-16">*/}
            {/*    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">*/}
            {/*        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-amber-200">*/}
            {/*            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5DEB3' }}>*/}
            {/*                <Users className="w-8 h-8" style={{ color: '#8B4513' }} />*/}
            {/*            </div>*/}
            {/*            <div className="text-3xl font-bold mb-2" style={{ color: '#8B4513' }}>{contestants.length}</div>*/}
            {/*            <div className="text-lg" style={{ color: '#A0522D' }}>Contestants</div>*/}
            {/*        </div>*/}

            {/*        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-amber-200">*/}
            {/*            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5DEB3' }}>*/}
            {/*                <Vote className="w-8 h-8" style={{ color: '#8B4513' }} />*/}
            {/*            </div>*/}
            {/*            <div className="text-3xl font-bold mb-2" style={{ color: '#8B4513' }}>*/}
            {/*                {contestants.reduce((sum, c) => sum + c.votes, 0)}*/}
            {/*            </div>*/}
            {/*            <div className="text-lg" style={{ color: '#A0522D' }}>Total Votes</div>*/}
            {/*        </div>*/}

            {/*        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-amber-200">*/}
            {/*            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5DEB3' }}>*/}
            {/*                <Trophy className="w-8 h-8" style={{ color: '#8B4513' }} />*/}
            {/*            </div>*/}
            {/*            <div className="text-3xl font-bold mb-2" style={{ color: '#8B4513' }}>*/}
            {/*                {contestants.reduce((sum, c) => sum + c.voters.length, 0)}*/}
            {/*            </div>*/}
            {/*            <div className="text-lg" style={{ color: '#A0522D' }}>Total Voters</div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Contestants Section */}
            <div className="container mx-auto px-4 mb-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#8B4513', fontFamily: 'serif' }}>
                        参赛选手
                    </h2>
                    <div className="w-24 h-0.5 mx-auto" style={{ backgroundColor: '#D4AF37' }}></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedContestants.map((contestant, index) => (
                        <div
                            key={contestant._id}
                            className="group relative bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-amber-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                        >
                            {/* Ranking Badge */}
                            {index < 3 && (
                                <div className="absolute top-4 left-4 z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                                'bg-gradient-to-br from-amber-500 to-amber-700'
                                    }`}>
                                        {index === 0 ? <Crown className="w-6 h-6" /> :
                                            index === 1 ? <Star className="w-6 h-6" /> :
                                                <Award className="w-6 h-6" />}
                                    </div>
                                </div>
                            )}

                            {/* Image Section */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={contestant.avatar}
                                    alt={contestant.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                {/* Vote Count Overlay */}
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                                    <div className="text-lg font-bold" style={{ color: '#8B4513' }}>{contestant.votes}</div>
                                    <div className="text-xs" style={{ color: '#A0522D' }}>votes</div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3" style={{ color: '#8B4513', fontFamily: 'serif' }}>
                                    {contestant.name}
                                </h3>
                                <p className="mb-6 leading-relaxed" style={{ color: '#A0522D' }}>
                                    {contestant.description}
                                </p>

                                {/* Stats */}
                                <div className="flex justify-between items-center mb-6 py-3 border-t border-amber-200">
                                    <div className="text-center">
                                        <div className="text-xl font-bold" style={{ color: '#B8860B' }}>{contestant.votes}</div>
                                        <div className="text-sm" style={{ color: '#A0522D' }}>Votes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold" style={{ color: '#B8860B' }}>{contestant.voters.length}</div>
                                        <div className="text-sm" style={{ color: '#A0522D' }}>Supporters</div>
                                    </div>
                                </div>

                                {/* Vote Button */}
                                <button
                                    onClick={() => navigate(`/vote/${contestant._id}`)}
                                    className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 50%, #8B4513 100%)'
                                    }}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Vote className="w-5 h-5" />
                                        Vote for {contestant.name}
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Admin Access */}
            {/*<div className="container mx-auto px-4 pb-16">*/}
            {/*    <div className="text-center">*/}
            {/*        <button*/}
            {/*            onClick={() => navigate('/admin')}*/}
            {/*            className="px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2"*/}
            {/*            style={{*/}
            {/*                backgroundColor: 'transparent',*/}
            {/*                borderColor: '#8B4513',*/}
            {/*                color: '#8B4513'*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <div className="flex items-center gap-2">*/}
            {/*                <Users className="w-5 h-5" />*/}
            {/*                Admin Panel*/}
            {/*            </div>*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Decorative Footer */}
            <div className="relative py-8">
                <div className="text-center">
                    <div className="w-32 h-0.5 mx-auto" style={{ backgroundColor: '#D4AF37' }}></div>
                    <p className="mt-4 text-sm" style={{ color: '#A0522D' }}>
                        New Zealand Chinese Students Association
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;