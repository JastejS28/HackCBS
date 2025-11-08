import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analysisAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FaArrowLeft, FaFilePdf, FaSignOutAlt, FaLightbulb, FaPaperPlane, FaRobot, FaUser, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import { SiGooglesheets } from 'react-icons/si';


const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const funFacts = [
    "Did you know? The first database was created in the 1960s!",
    "AI can analyze years of data in seconds!",
    "Data visualization helps humans process information 60,000 times faster!",
    "85% of businesses say AI gives them a competitive advantage!",
    "The average person generates 1.7 MB of data every second!"
];

const Analysis = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [question, setQuestion] = useState('');
    const [asking, setAsking] = useState(false);
    const [currentFact, setCurrentFact] = useState(0);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [analysis?.conversations]);

    // Polling for processing status
    useEffect(() => {
        let interval;
        
        const checkStatus = async () => {
            try {
                const statusData = await analysisAPI.checkStatus(id);
                
                if (statusData.data.status === 'completed') {
                    fetchAnalysis();
                    clearInterval(interval);
                } else if (statusData.data.status === 'failed') {
                    setError(statusData.data.errorMessage || 'Analysis failed');
                    setLoading(false);
                    clearInterval(interval);
                }
            } catch (err) {
                console.error('Status check error:', err);
            }
        };

        if (location.state?.processing) {
            interval = setInterval(checkStatus, 3000); // Check every 3 seconds
            
            // Rotate fun facts
            const factInterval = setInterval(() => {
                setCurrentFact((prev) => (prev + 1) % funFacts.length);
            }, 5000);

            return () => {
                clearInterval(interval);
                clearInterval(factInterval);
            };
        } else {
            fetchAnalysis();
        }

        return () => clearInterval(interval);
    }, [id, location.state]);

    const fetchAnalysis = async () => {
        try {
            const data = await analysisAPI.getById(id);
            setAnalysis(data.data);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to load analysis');
            setLoading(false);
        }
    };

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setAsking(true);
        try {
            const response = await analysisAPI.askQuestion(id, question);
            
            // Add to local conversations
            setAnalysis({
                ...analysis,
                conversations: [
                    ...analysis.conversations,
                    {
                        question,
                        answer: response.data.answer,
                        timestamp: new Date()
                    }
                ]
            });
            
            setQuestion('');
        } catch (err) {
            console.error('Question error:', err);
        } finally {
            setAsking(false);
        }
    };

    const handleExportPDF = async () => {
        try {
            const blob = await analysisAPI.exportReport(id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `analysis-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export error:', err);
        }
    };

    const renderChart = (viz) => {
        const chartData = viz.data?.slice(0, 10) || [];
        if (chartData.length === 0) return <div className="text-gray-500 text-center p-8">No data available for this chart.</div>;

        const keys = Object.keys(chartData[0] || {});
        const dataKeyX = keys[0];
        const dataKeyY = keys[1];

        switch (viz.chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey={dataKeyX} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
                            <Legend wrapperStyle={{ fontSize: '14px' }} />
                            <Bar dataKey={dataKeyY} fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey={dataKeyX} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
                            <Legend wrapperStyle={{ fontSize: '14px' }} />
                            <Line type="monotone" dataKey={dataKeyY} stroke={COLORS[1]} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey={dataKeyY}
                                nameKey={dataKeyX}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                    return (
                                        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
                            <Legend wrapperStyle={{ fontSize: '14px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                );
            
            default:
                return <div className="text-gray-500 text-center p-8">Unsupported chart type: {viz.chartType}</div>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <FaSync className="animate-spin text-blue-600 text-5xl mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Analyzing Your Data...
                    </h2>
                    <p className="text-gray-600 mb-6">
                        This may take a few moments. Please don't close this page.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4 transition-all duration-500">
                        <p className="text-sm text-blue-800 italic">
                            {funFacts[currentFact]}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamationTriangle className="text-red-600 text-4xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Analysis Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="max-w-screen-xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <SiGooglesheets className="text-blue-600 h-7 w-7" />
                            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Analysis Results</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
                        >
                            <FaFilePdf className="w-4 h-4" />
                            <span className="hidden sm:inline">Export PDF</span>
                        </button>
                        <button onClick={signOut} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <FaSignOutAlt className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Executive Summary</h2>
                            <p className="text-gray-600 leading-relaxed">{analysis?.summary}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3"><FaLightbulb className="text-yellow-400" />Key Insights</h2>
                            <ul className="space-y-4">
                                {analysis?.keyInsights?.map((insight, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-700 pt-0.5">{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {analysis?.visualizations?.map((viz, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{viz.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">{viz.description}</p>
                                {renderChart(viz)}
                            </div>
                        ))}
                    </div>

                    {/* Sticky Chat Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg sticky top-24 flex flex-col" style={{ height: 'calc(100vh - 7rem)' }}>
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800">Ask Follow-up Questions</h2>
                            </div>
                            
                            <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50">
                                {analysis?.conversations?.map((conv, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="flex justify-end">
                                            <div className="bg-blue-500 text-white rounded-lg rounded-br-none p-3 max-w-xs">
                                                <p className="text-sm">{conv.question}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-start">
                                            <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none p-3 max-w-xs">
                                                <p className="text-sm">{conv.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-4 border-t border-gray-200 bg-white">
                                <form onSubmit={handleAskQuestion} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="Ask about your data..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                    <button
                                        type="submit"
                                        disabled={asking || !question.trim()}
                                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-110"
                                    >
                                        {asking ? (
                                            <FaSync className="animate-spin w-5 h-5" />
                                        ) : (
                                            <FaPaperPlane className="w-5 h-5" />
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analysis;
