import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../service/api";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [isLoading, setIsLoading] = useState(false);

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
        <div className="flex items-center justify-center min-h-screen bg-gray-50">

            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Email address"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Your password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 w-full rounded transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate("/register")}>Register here</span>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;
