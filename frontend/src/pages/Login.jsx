// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { FaGoogle } from 'react-icons/fa';
// import { SiGooglesheets } from "react-icons/si";

// const Login = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const { signInWithGoogle } = useAuth();
//     const navigate = useNavigate();

//     const handleGoogleSignIn = async () => {
//         try {
//             setLoading(true);
//             setError('');
//             await signInWithGoogle();
//             navigate('/');
//         } catch (err) {
//             console.error('Login error:', err);
//             setError('Failed to sign in. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
//             <div className="max-w-md w-full mx-auto">
//                 <div className="text-center mb-8">
//                     <div className="inline-block p-4 bg-blue-600 text-white rounded-full shadow-lg mb-4">
//                         <SiGooglesheets size={48} />
//                     </div>
//                     <h1 className="text-4xl font-bold text-gray-800">
//                         AI-Driven DB RAG & Analytics
//                     </h1>
//                     <p className="text-gray-600 mt-2">
//                         Sign in to unlock the power of your data.
//                     </p>
//                 </div>

//                 <div className="bg-white rounded-2xl shadow-xl p-8">
//                     <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
//                         Welcome Back
//                     </h2>

//                     {error && (
//                         <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
//                             {error}
//                         </div>
//                     )}

//                     <button
//                         onClick={handleGoogleSignIn}
//                         disabled={loading}
//                         className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
//                     >
//                         {loading ? (
//                             <>
//                                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                                 <span>Signing in...</span>
//                             </>
//                         ) : (
//                             <>
//                                 <FaGoogle className="w-5 h-5" />
//                                 <span>Sign in with Google</span>
//                             </>
//                         )}
//                     </button>

//                     <div className="mt-6 text-center text-xs text-gray-500">
//                         By signing in, you agree to our Terms of Service.
//                     </div>
//                 </div>

//                 <div className="mt-8 text-center">
//                     <p className="text-sm text-gray-500">A secure and intuitive platform for modern data analysis.</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;




// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { FaGoogle } from 'react-icons/fa';
// import { SiGooglesheets } from "react-icons/si";
// import './Login.css';

// const Login = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const { signInWithGoogle } = useAuth();
//     const navigate = useNavigate();

//     const handleGoogleSignIn = async () => {
//         try {
//             setLoading(true);
//             setError('');
//             await signInWithGoogle();
//             navigate('/');
//         } catch (err) {
//             console.error('Login error:', err);
//             setError('Failed to sign in. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="login-content">
//                 {/* Left Section - Login Form */}
//                 <div className="login-left-section">
//                     <div className="login-header">
//                         {/* <div className="login-icon">
//                             <SiGooglesheets size={48} />
//                         </div> */}
//                         <h1 className="login-title">
//                             Prism
//                         </h1>
//                         <p className="login-subtitle">
//                             Sign in to unlock the power of your data.
//                         </p>
//                     </div>

//                     <div className="login-card">
//                         <h2 className="login-card-title">
//                             Welcome Back
//                         </h2>

//                         {error && (
//                             <div className="alert alert-error">
//                                 {error}
//                             </div>
//                         )}

//                         <button
//                             onClick={handleGoogleSignIn}
//                             disabled={loading}
//                             className="google-sign-in-btn"
//                         >
//                             {loading ? (
//                                 <>
//                                     <div className="spinner"></div>
//                                     <span>Signing in...</span>
//                                 </>
//                             ) : (
//                                 <>
//                                     <FaGoogle size={20} />
//                                     <span>Sign in with Google</span>
//                                 </>
//                             )}
//                         </button>

//                         <div className="login-footer">
//                             By signing in, you agree to our Terms of Service.
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Section - Spline 3D Model */}
//                 <div className="login-spline-section">
//                     <div className="login-spline-container">
//                         <spline-viewer 
//                             url="https://prod.spline.design/qlbKQI-L3LSJLRQN/scene.splinecode"
//                             style={{ width: '100%', height: '100%' }}
//                         ></spline-viewer>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;




import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGoogle } from 'react-icons/fa';
import { SiGooglesheets } from "react-icons/si";
import './Login.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError('');
            await signInWithGoogle();
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to sign in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                {/* Left Section - Login Form */}
                <div className="login-left-section">
                    <div className="login-header">
                        {/* <div className="login-icon">
                            <SiGooglesheets size={48} />
                        </div> */}
                        <h1 className="login-title">
                            Prism
                        </h1>
                        <p className="login-subtitle">
                            Sign in to unlock the power of your data.
                        </p>
                    </div>

                    <div className="login-card">
                        <h2 className="login-card-title">
                            Welcome Back
                        </h2>

                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="google-sign-in-btn"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <FaGoogle size={20} />
                                    <span>Sign in with Google</span>
                                </>
                            )}
                        </button>

                        <div className="login-footer">
                            By signing in, you agree to our Terms of Service.
                        </div>
                    </div>
                </div>

                {/* Right Section - Spline 3D Model */}
                <div className="login-spline-section">
                    <div className="login-spline-container">
                        <spline-viewer 
                            url="https://prod.spline.design/qlbKQI-L3LSJLRQN/scene.splinecode"
                            style={{ width: '100%', height: '100%' }}
                        ></spline-viewer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;