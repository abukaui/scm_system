import React from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            
            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">About the Developer</h1>
                            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 overflow-hidden border border-gray-100">
                            <div className="md:flex">
                                <div className="md:w-1/3 bg-blue-600 p-12 text-center text-white flex flex-col justify-center items-center">
                                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-md border border-white/30">
                                        <span className="text-5xl font-bold">AM</span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Abu Mengistu</h2>
                                    <p className="text-blue-100 font-medium">Full Stack Developer</p>
                                </div>
                                <div className="md:w-2/3 p-8 md:p-12">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                                    
                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Full Name</p>
                                                <p className="text-lg font-bold text-gray-800">Abu Mengistu</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
                                                <a href="mailto:abuy3832@gmail.com" className="text-lg font-bold text-blue-600 hover:underline">abuy3832@gmail.com</a>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Phone Number</p>
                                                <p className="text-lg font-bold text-gray-800">0985852123</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-gray-600 leading-relaxed italic">
                                            "Committed to building innovative solutions that solve real-world problems. The Student Complaint Portal is a step towards a more transparent and efficient academic environment."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
