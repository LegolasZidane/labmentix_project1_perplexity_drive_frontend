import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

export default function Signup(){

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await api.post("/auth/signup", form);
            navigate("/login");
        }   catch(error){
            setError(error.response?.data?.error || "Something went wrong in Signup.jsx")
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h2>

                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                    <input 
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none"   
                    />
                    <input 
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none" 
                    />
                    <input 
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none" 
                    />
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold">
                        Sign Up
                    </button>
                    <p className="text-sm text-gray-400 text-center mt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}