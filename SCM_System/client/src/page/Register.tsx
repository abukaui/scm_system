import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerStudent, type studentData } from "../service/api";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<studentData>({
        name: "",
        email: "",
        password: "",
        department: "",
        studentID: ""
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const result = await registerStudent(formData);
            console.log('Registration result:', result);
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (error) {
            console.error('Registration failed:', error);
            alert("Registration failed. Please try again.");
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Register</h2>

                <input
                    className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Full Name"
                    required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <input
                    className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Email"
                    type="email"
                    required
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <input
                    className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Department"
                    required
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />

                <input
                    className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Student ID"
                    required
                    onChange={(e) => setFormData({ ...formData, studentID: e.target.value })}
                />

                <input
                    type="password"
                    className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Password"
                    required
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 w-full rounded transition duration-200">
                    Register
                </button>
                
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate("/login")}>Login here</span>
                </p>
            </form>
        </div>
    )
}

export default Register;