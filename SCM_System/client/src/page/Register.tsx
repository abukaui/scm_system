import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent, type UserData } from "../service/api";
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<UserData>({
        name: "",
        email: "",
        password: "",
        department: "",
        studentID: ""
    })
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const result = await registerStudent(formData);
            console.log('Registration result:', result);
            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error("Registration failed. Please try again.");
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 font-sans relative">
            <Link 
                to="/" 
                className="absolute top-8 left-8 flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest group"
            >
                <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
            </Link>
            <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-slate-200 w-full max-w-md border border-slate-100 my-8">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-6 transition-transform hover:scale-105 active:scale-95 cursor-default">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Join Us</h2>
                    <p className="text-slate-400 text-sm mt-2 font-medium italic">Create your student account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                className="bg-slate-50 border border-slate-200 p-3.5 w-full rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                                placeholder="Your full name"
                                required
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Email</label>
                            <input
                                className="bg-slate-50 border border-slate-200 p-3.5 w-full rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                                placeholder="name@college.edu"
                                type="email"
                                required
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                                <input
                                    className="bg-slate-50 border border-slate-200 p-3.5 w-full rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300 text-xs"
                                    placeholder="e.g. CS"
                                    required
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student ID</label>
                                <input
                                    className="bg-slate-50 border border-slate-200 p-3.5 w-full rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300 text-xs"
                                    placeholder="ID Number"
                                    required
                                    onChange={(e) => setFormData({ ...formData, studentID: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group/pass">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="bg-slate-50 border border-slate-200 p-3.5 w-full rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300 pr-12"
                                    placeholder="Min. 8 characters"
                                    required
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.076m1.333-2.964A9.964 9.964 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-4.29 5.29M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9l.01-.01M3 3l18 18" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative group/pass">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="bg-slate-50 border border-slate-200 p-3.5 w-full rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300 pr-12"
                                    placeholder="Repeat your password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors focus:outline-none"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.076m1.333-2.964A9.964 9.964 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-4.29 5.29M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9l.01-.01M3 3l18 18" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button className="bg-slate-900 hover:bg-slate-800 text-white font-black py-4 w-full rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] tracking-widest uppercase text-xs mt-4">
                        Register Account
                    </button>
                    
                    <div className="pt-6 text-center border-t border-slate-50">
                        <p className="text-xs text-slate-500 font-medium tracking-tight">
                            Already a member? <span className="text-blue-600 font-black cursor-pointer hover:underline uppercase tracking-widest ml-1" onClick={() => navigate("/login")}>Login</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;