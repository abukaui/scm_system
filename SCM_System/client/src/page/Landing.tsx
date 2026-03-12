import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 select-none pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-50 select-none pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 text-center lg:text-left">
                            <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-blue-600 font-bold text-sm mb-6 tracking-wide uppercase">
                                New: Version 2.0 is live!
                            </span>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                                The Best Way to <br />
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Resolve Issues.</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                SCM Portal empowers students to raise voices and get their complaints resolved quickly and transparently. Join thousands of students making campus life better.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link 
                                    to="/register" 
                                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 text-center"
                                >
                                    Get Started Free
                                </Link>
                                <a 
                                    href="#features" 
                                    className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all text-center"
                                >
                                    Explore Features
                                </a>
                            </div>
                            <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-gray-500 text-sm font-medium">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                            <div className="w-full h-full bg-blue-200"></div>
                                        </div>
                                    ))}
                                </div>
                                <span>Joined by 5000+ Students</span>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-2 transform hover:rotate-1 transition-transform duration-500">
                                <div className="bg-gray-50 rounded-2xl p-6 aspect-[4/3] flex flex-col justify-center items-center">
                                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Dashboard</h3>
                                    <p className="text-gray-500 text-center text-sm">Real-time tracking of all your academic concerns.</p>
                                </div>
                            </div>
                            {/* Floating decorative elements */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full flex items-center justify-center shadow-xl animate-bounce duration-[3000ms]">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Built for Student Success</h2>
                        <p className="text-lg text-gray-600">Our platform is packed with everything you need to manage and resolve your academic complaints efficiently.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="group p-8 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Filing</h3>
                            <p className="text-gray-600 leading-relaxed">Submit your complaints with just a few clicks. Attach evidence and details securely.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-8 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300">
                            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Status Tracking</h3>
                            <p className="text-gray-600 leading-relaxed">Stay updated on the progress of your complaints with real-time status updates from officials.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-8 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Private</h3>
                            <p className="text-gray-600 leading-relaxed">Your data and identity are protected with industry-standard encryption and security protocols.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-blue-600">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Ready to Make a Difference?</h2>
                    <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                        Join the portal today and start experiencing a more transparent academic environment.
                    </p>
                    <Link 
                        to="/register" 
                        className="inline-block px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all active:scale-95 shadow-xl"
                    >
                        Sign Up Now — It's Free
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;