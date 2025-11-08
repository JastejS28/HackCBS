import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataSourceAPI } from '../services/api';
import { FaDatabase, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import { SiGooglesheets } from 'react-icons/si';

const Home = () => {
    const [activeTab, setActiveTab] = useState('database'); // 'database' or 'file'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    // Database form state
    const [dbForm, setDbForm] = useState({
        name: '',
        dbType: 'mysql',
        host: '',
        port: '',
        username: '',
        password: '',
        databaseName: ''
    });

    // File upload state
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleDbChange = (e) => {
        setDbForm({ ...dbForm, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (!validTypes.includes(selectedFile.type)) {
                setError('Please upload only CSV or XLSX files');
                return;
            }
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setError('');
        }
    };

    const handleDatabaseSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await dataSourceAPI.submitDatabase(dbForm);
            navigate(`/analysis/${response.data.analysisId}`, { 
                state: { processing: true } 
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to connect to database');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', fileName || file.name);

            const response = await dataSourceAPI.submitFile(formData);
            navigate(`/analysis/${response.data.analysisId}`, { 
                state: { processing: true } 
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Fixed Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <SiGooglesheets className="text-blue-600 h-8 w-8" />
                            <span className="text-xl font-bold text-gray-800">AI Data Analytics</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                {user?.photoURL && (
                                    <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full" />
                                )}
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium text-gray-800">{user?.displayName || 'User'}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={signOut}
                                className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <FaSignOutAlt className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Two Column Layout */}
            <main className="flex-1 px-6 py-12 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column - Input Methods */}
                    <div className="w-full">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                Connect Your Data Source
                            </h1>
                            <p className="text-gray-600">
                                Get AI-powered insights by connecting to your database or uploading a file.
                            </p>
                        </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('database')}
                                className={`flex-1 py-4 text-center font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                    activeTab === 'database'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                            >
                                <FaDatabase />
                                Database Connection
                            </button>
                            <button
                                onClick={() => setActiveTab('file')}
                                className={`flex-1 py-4 text-center font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                    activeTab === 'file'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                            >
                                <FaFileAlt />
                                File Upload
                            </button>
                        </div>

                        <div className="p-8">
                            {error && (
                                <div className="mb-6 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                        {activeTab === 'database' && (
                            <form onSubmit={handleDatabaseSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Connection Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={dbForm.name}
                                        onChange={handleDbChange}
                                        required
                                        placeholder="e.g., My Production DB"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Database Type
                                    </label>
                                    <select
                                        name="dbType"
                                        value={dbForm.dbType}
                                        onChange={handleDbChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                    >
                                        <option value="mysql">MySQL</option>
                                        <option value="postgres">PostgreSQL</option>
                                        <option value="mongodb">MongoDB</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Host</label>
                                        <input type="text" name="host" value={dbForm.host} onChange={handleDbChange} required placeholder="localhost" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Port</label>
                                        <input type="number" name="port" value={dbForm.port} onChange={handleDbChange} required placeholder="3306" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                                        <input type="text" name="username" value={dbForm.username} onChange={handleDbChange} required placeholder="root" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                        <input type="password" name="password" value={dbForm.password} onChange={handleDbChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Database Name</label>
                                    <input type="text" name="databaseName" value={dbForm.databaseName} onChange={handleDbChange} required placeholder="mydatabase" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Connecting...</span>
                                        </>
                                    ) : (
                                        'Connect & Analyze'
                                    )}
                                </button>
                            </form>
                        )}

                        {activeTab === 'file' && (
                            <form onSubmit={handleFileSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        File Name
                                    </label>
                                    <input
                                        type="text"
                                        value={fileName}
                                        onChange={(e) => setFileName(e.target.value)}
                                        placeholder="e.g., Quarterly Sales Report"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Upload File
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv, .xlsx" />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">CSV or XLSX up to 10MB</p>
                                        </div>
                                    </div>
                                    {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !file}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        'Upload & Analyze'
                                    )}
                                </button>
                            </form>
                        )}
                        </div>
                    </div>
                    </div>

                    {/* Right Column - Spline 3D Model */}
                    <div className="w-full h-[700px] flex items-center justify-center">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-100">
                            <spline-viewer 
                                url="https://prod.spline.design/1msw0B9s8wG3O1t6/scene.splinecode"
                                style={{ width: '100%', height: '100%' }}
                            ></spline-viewer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
