import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

export default function Login(){

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const shownToast = useRef(false);

    useEffect(() => {
        
        if( location.state?.fromSignup && !shownToast.current ){
            toast.success("Signup successful! Now login to continue");
            shownToast.current = true;

            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate, location.pathname]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value});
        if( error ) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await api.post("/auth/login", form);
            const token = res.data.data.session.access_token;
            localStorage.setItem("token", token);
            navigate("/dashboard");
        }   catch(error){
            setError(error.response?.data?.error || "Invalid credentials");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <Toaster position="top-right" />
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Log In</h2>

                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

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
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold">
                        Log In
                    </button>
                    <p className="text-sm text-gray-400 text-center mt-4">
                        First time here?{" "}
                        <Link
                            to="/signup"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Create an account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}