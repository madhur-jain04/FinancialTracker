// frontend/src/components/AuthForm.jsx
import React, { useState } from 'react';
import axios from 'axios'; // Axios for making HTTP requests

// AuthForm component handles both login and registration forms
export default function AuthForm({ API_BASE_URL, onLogin }) {
    // State to toggle between login and registration
    const [isLogin, setIsLogin] = useState(true);

    // Form input states
    const [username, setUsername] = useState('user@test.com'); // default value for testing
    const [password, setPassword] = useState('password123');   // default value for testing

    const [loading, setLoading] = useState(false); // Shows loading state during API call
    const [error, setError] = useState('');        // Stores error messages to display

    // Handle form submission
    const handleSubmit = async (e) => { 
        e.preventDefault(); // Prevent default form submission (page reload)
        setLoading(true);   // Enable loading state
        setError('');       // Clear previous error

        // Determine endpoint based on login/register toggle
        const endpoint = isLogin ? 'login' : 'register';
        const url = `${API_BASE_URL}/api/auth/${endpoint}`; // Full API URL

        try {
            // Make POST request to backend with username and password
            const response = await axios.post(url, {
                username, 
                password
            });

            // Extract user info and JWT token from response
            const user = response.data.user; 
            const token = response.data.token; 

            // Save token to local storage for authenticated requests
            localStorage.setItem('authToken', token);
            
            // Notify parent component that user has logged in
            onLogin(user); 

        } catch (err) {
            console.error("Authentication failed:", err);
            // Display an error message from backend if available, otherwise default message
            const message = err.response?.data?.message || `Authentication failed. Please check your credentials.`;
            setError(message);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
            {/* Form title */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                {isLogin ? 'Sign In' : 'Register'}
            </h2>

            {/* Display error message if any */}
            {error && (
                <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
                    {error}
                </div>
            )}

            {/* Authentication form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username input */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username (or Email)
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update state on change
                        required
                        className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500"
                    />
                </div>

                {/* Password input */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update state on change
                        required
                        className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500"
                    />
                </div>

                {/* Submit button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading} // Disable button while loading
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </div>
            </form>

            {/* Toggle between login and register */}
            <div className="mt-6 text-center">
                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)} // Toggle form mode
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                    {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </button>
            </div>
        </div>
    );
}
