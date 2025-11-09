import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataSourceAPI } from '../services/api';
import { FaDatabase, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import { SiGooglesheets } from 'react-icons/si';
import './Home.css';

const Home = () => {
    const [activeTab, setActiveTab] = useState('database'); // 'database' or 'file'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    // Database connection string state
    const [connectionString, setConnectionString] = useState('');
    const [connectionName, setConnectionName] = useState('');

    // File upload state
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

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
            const response = await dataSourceAPI.submitDatabase({
                name: connectionName || 'Database Connection',
                connectionString: connectionString
            });
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
        <div className="home-wrapper">
            {/* Fixed Header */}
            <header className="home-header">
                <div className="home-header-content">
                    <div className="home-logo">
                        <SiGooglesheets className="home-logo-icon" />
                        <span className="home-logo-text">AI Data Analytics</span>
                    </div>

                    <div className="home-user-section">
                        <div className="home-user-info">
                            {user?.photoURL && (
                                <img src={user.photoURL} alt="Profile" className="home-user-avatar" />
                            )}
                            <div className="home-user-details">
                                <p className="home-user-name">{user?.displayName || 'User'}</p>
                                <p className="home-user-email">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={signOut}
                            className="home-signout-btn"
                        >
                            <FaSignOutAlt size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - Two Column Layout */}
            <main className="home-main">
                <div className="home-grid">
                    {/* Left Column - Input Methods */}
                    <div className="home-forms-section">
                        <div className="home-intro">
                            <h1 className="home-title">
                                Connect Your Data Source
                            </h1>
                            <p className="home-description">
                                Get AI-powered insights by connecting to your database or uploading a file.
                            </p>
                        </div>

                    <div className="home-card">
                        <div className="home-tabs">
                            <button
                                onClick={() => setActiveTab('database')}
                                className={`home-tab ${activeTab === 'database' ? 'active' : ''}`}
                            >
                                <FaDatabase />
                                Database Connection
                            </button>
                            <button
                                onClick={() => setActiveTab('file')}
                                className={`home-tab ${activeTab === 'file' ? 'active' : ''}`}
                            >
                                <FaFileAlt />
                                File Upload
                            </button>
                        </div>

                        <div className="home-form-content">
                            {error && (
                                <div className="alert alert-error">
                                    {error}
                                </div>
                            )}

                        {activeTab === 'database' && (
                            <form onSubmit={handleDatabaseSubmit} className="home-form">
                                <div className="home-form-group">
                                    <label className="label">
                                        Connection Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={connectionName}
                                        onChange={(e) => setConnectionName(e.target.value)}
                                        placeholder="e.g., My Production DB"
                                        className="input"
                                    />
                                </div>
                                <div className="home-form-group">
                                    <label className="label">
                                        Database Connection String
                                    </label>
                                    <input
                                        type="text"
                                        value={connectionString}
                                        onChange={(e) => setConnectionString(e.target.value)}
                                        required
                                        placeholder="e.g., mysql://username:password@host:port/database"
                                        className="input"
                                    />
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                        Examples:<br/>
                                        • MySQL: mysql://user:pass@localhost:3306/mydb<br/>
                                        • PostgreSQL: postgresql://user:pass@localhost:5432/mydb<br/>
                                        • MongoDB: mongodb://user:pass@localhost:27017/mydb
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="home-submit-btn"
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner"></div>
                                            <span>Connecting...</span>
                                        </>
                                    ) : (
                                        'Connect & Analyze'
                                    )}
                                </button>
                            </form>
                        )}

                        {activeTab === 'file' && (
                            <form onSubmit={handleFileSubmit} className="home-form">
                                <div className="home-form-group">
                                    <label className="label">
                                        File Name
                                    </label>
                                    <input
                                        type="text"
                                        value={fileName}
                                        onChange={(e) => setFileName(e.target.value)}
                                        placeholder="e.g., Quarterly Sales Report"
                                        className="input"
                                    />
                                </div>
                                <div className="home-form-group">
                                    <label className="label">
                                        Upload File
                                    </label>
                                    <div className="file-upload-area">
                                        <div className="file-upload-content">
                                            <svg className="file-upload-icon" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="file-upload-text">
                                                <label htmlFor="file-upload" className="file-upload-link">
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
                                                </label>
                                                <p>&nbsp;or drag and drop</p>
                                            </div>
                                            <p className="file-upload-hint">CSV or XLSX up to 10MB</p>
                                        </div>
                                    </div>
                                    {file && <p className="file-selected">Selected file: {file.name}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !file}
                                    className="home-submit-btn"
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner"></div>
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
                    <div className="home-spline-section">
                        <div className="home-spline-container">
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
