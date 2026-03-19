import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../service/api";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await loginUser(formData);

            if (response?.token) {
                localStorage.setItem("token", response.token);
                // Store user data and role
                if (response.user) {
                    localStorage.setItem("user", JSON.stringify(response.user));
                    localStorage.setItem("role", response.user.role || "");

                    // Role-based redirection
                    if (response.user.role === 'admin') {
                        navigate("/admin");
                    } else {
                        navigate("/dashboard");
                    }
                }
                return;
            }

            const message = response?.message ?? "Login failed. Please check your credentials.";
            alert(message);
        } catch (error) {
            console.error(`Login failed: ${error}`);
            alert("Login failed. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 relative">
            <Link 
                to="/" 
                className="absolute top-8 left-8 flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest group"
            >
                <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
            </Link>

            <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-slate-200 w-full max-w-md border border-slate-100">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-6 transition-transform hover:scale-105 active:scale-95 cursor-default">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400 text-sm mt-2 font-medium italic">Please enter your details to sign in</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="bg-slate-50 border border-slate-200 p-3.5 w-full rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                            placeholder="name@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <span className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer uppercase tracking-tight">Forgot?</span>
                        </div>
                        <div className="relative group/pass">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="bg-slate-50 border border-slate-200 p-3.5 w-full rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300 pr-12"
                                placeholder="Your secret password"
                                required
                                value={formData.password}
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`bg-slate-900 hover:bg-slate-800 text-white font-black py-4 w-full rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} tracking-widest uppercase text-xs`}
                    >
                        {isLoading ? 'Authenticating...' : 'Sign In Now'}
                    </button>

                    <div className="pt-6 text-center border-t border-slate-50">
                        <p className="text-xs text-slate-500 font-medium tracking-tight">
                            New here? <span className="text-blue-600 font-black cursor-pointer hover:underline uppercase tracking-widest ml-1" onClick={() => navigate("/register")}>Create Account</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;
