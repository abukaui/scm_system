import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../service/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await requestPasswordReset(email);
            setIsSubmitted(true);
        } catch (error: any) {
            console.error("Failed to request password reset:", error);
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 relative">
            <Link 
                to="/login" 
                className="absolute top-8 left-8 flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest group"
            >
                <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Login</span>
            </Link>

            <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-slate-200 w-full max-w-md border border-slate-100">
                {!isSubmitted ? (
                    <>
                        <div className="flex flex-col items-center mb-10 text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-6 transition-transform hover:scale-105 active:scale-95 cursor-default">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Forgot Password?</h2>
                            <p className="text-slate-400 text-sm mt-2 font-medium italic">No worries, it happens! Enter your email and we'll send you a recovery link.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    className="bg-slate-50 border border-slate-200 p-3.5 w-full rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                                    placeholder="name@university.edu"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`bg-slate-900 hover:bg-slate-800 text-white font-black py-4 w-full rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} tracking-widest uppercase text-xs`}
                            >
                                {isLoading ? 'Sending Link...' : 'Send Recovery Link'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 mb-6 transition-transform hover:scale-105 active:scale-95 cursor-default">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Check Your Inbox</h2>
                        <p className="text-slate-400 text-sm mt-4 font-medium italic">We've sent a recovery link to <span className="text-slate-900 font-bold not-italic">{email}</span>. Click the link in the email to reset your password.</p>
                        <button 
                            onClick={() => setIsSubmitted(false)} 
                            className="mt-8 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
                        >
                            Didn't receive it? Try again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
