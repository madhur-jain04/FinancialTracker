// // // frontend/src/components/AuthForm.jsx
// // import React, { useState } from 'react';
// // // axios will be used here to talk to POST /api/auth/login or /register

// // export default function AuthForm({ API_BASE_URL, onLogin }) {
// //     const [isLogin, setIsLogin] = useState(true);
// //     const [username, setUsername] = useState('user@test.com'); // Pre-fill for quick testing
// //     const [password, setPassword] = useState('password123');
// //     const [loading, setLoading] = useState(false);

// //     const handleSubmit = (e) => {
// //         e.preventDefault();
// //         setLoading(true);

// //         // --- MOCK LOGIN FOR NOW ---
// //         // REPLACE THIS WITH ACTUAL AXIOS CALLS TO YOUR BACKEND API/auth/login
// //         setTimeout(() => {
// //             console.log(`Attempting ${isLogin ? 'Login' : 'Register'} for ${username}`);
// //             // On successful auth, call onLogin and pass the user object
// //             onLogin({ id: 'mock-user-123', username: username }); 
// //             setLoading(false);
// //         }, 1500);
// //         // --- END MOCK ---
// //     };

// //     return (
// //         <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-indigo-200">
// //             <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
// //                 {isLogin ? 'Sign In' : 'Register'}
// //             </h2>
// //             <form onSubmit={handleSubmit} className="space-y-4">
// //                 <div>
// //                     <label className="block text-sm font-medium text-gray-700">Username (or Email)</label>
// //                     <input
// //                         type="text"
// //                         value={username}
// //                         onChange={(e) => setUsername(e.target.value)}
// //                         required
// //                         className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500"
// //                     />
// //                 </div>
// //                 <div>
// //                     <label className="block text-sm font-medium text-gray-700">Password</label>
// //                     <input
// //                         type="password"
// //                         value={password}
// //                         onChange={(e) => setPassword(e.target.value)}
// //                         required
// //                         className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500"
// //                     />
// //                 </div>
// //                 <button
// //                     type="submit"
// //                     disabled={loading}
// //                     className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition shadow-lg"
// //                 >
// //                     {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
// //                 </button>
// //             </form>
// //             <div className="mt-6 text-center">
// //                 <button
// //                     onClick={() => setIsLogin(!isLogin)}
// //                     className="text-sm text-indigo-600 hover:text-indigo-800"
// //                 >
// //                     {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // }

// // frontend/src/components/AuthForm.jsx
// import React, { useState } from 'react';
// import axios from 'axios'; // ⬅️ NEW: Import axios

// export default function AuthForm({ API_BASE_URL, onLogin }) {
//     const [isLogin, setIsLogin] = useState(true);
//     const [username, setUsername] = useState('user@test.com'); // Pre-fill for quick testing
//     const [password, setPassword] = useState('password123');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(''); // ⬅️ NEW: State for error messages

//     const handleSubmit = async (e) => { // ⬅️ UPDATED: Made function async
//         e.preventDefault();
//         setLoading(true);
//         setError(''); // Clear previous errors

//         const endpoint = isLogin ? 'login' : 'register';
//         const url = `${API_BASE_URL}/api/auth/${endpoint}`;

//         try {
//             // ⬅️ CRITICAL CHANGE: Replacing mock with actual API call
//             const response = await axios.post(url, {
//                 username, // Send username and password to the backend
//                 password
//             });

//             // Assuming a successful response returns user data and a token
//             const user = response.data.user; 
//             const token = response.data.token; // The JWT

//             // Store the token (usually in localStorage or cookie)
//             localStorage.setItem('authToken', token);
            
//             // Call the parent handler to update the application state
//             onLogin(user); 

//         } catch (err) {
//             console.error("Authentication failed:", err);
//             // Display an error message from the backend or a default one
//             const message = err.response?.data?.message || `Authentication failed. Please check your credentials.`;
//             setError(message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
//             <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//                 {isLogin ? 'Sign In' : 'Register'}
//             </h2>

//             {/* ⬅️ NEW: Display Error Message */}
//             {error && (
//                 <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
//                     {error}
//                 </div>
//             )}
//             {/* ⬅️ END NEW */}

//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                     <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//                         Username (or Email)
//                     </label>
//                     <input
//                         id="username"
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                         className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500"
//                     />
//                 </div>

//                 <div>
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                         Password
//                     </label>
//                     <input
//                         id="password"
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500"
//                     />
//                 </div>

//                 <div>
//                     <button
//                         type="submit"
//                         disabled={loading} // Disable button while loading
//                         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//                     >
//                         {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
//                     </button>
//                 </div>
//             </form>

//             <div className="mt-6 text-center">
//                 <button
//                     type="button"
//                     onClick={() => setIsLogin(!isLogin)}
//                     className="text-sm text-indigo-600 hover:text-indigo-800"
//                 >
//                     {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
//                 </button>
//             </div>
//         </div>
//     );
// }


// frontend/src/components/AuthForm.jsx
import React, { useState } from 'react';
import axios from 'axios'; 

export default function AuthForm({ API_BASE_URL, onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('user@test.com'); 
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); 

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setLoading(true);
        setError(''); 

        const endpoint = isLogin ? 'login' : 'register';
        const url = `${API_BASE_URL}/api/auth/${endpoint}`;

        try {
            const response = await axios.post(url, {
                username, 
                password
            });

            const user = response.data.user; 
            const token = response.data.token; 

            localStorage.setItem('authToken', token);
            
            onLogin(user); 

        } catch (err) {
            console.error("Authentication failed:", err);
            // Display an error message from the backend or a default one
            const message = err.response?.data?.message || `Authentication failed. Please check your credentials.`;
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                {isLogin ? 'Sign In' : 'Register'}
            </h2>

            {error && (
                <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username (or Email)
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading} 
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                    {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </button>
            </div>
        </div>
    );
}