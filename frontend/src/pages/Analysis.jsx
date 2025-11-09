// import { useState, useEffect, useRef } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { analysisAPI } from '../services/api';
// import ForceGraph3D from 'react-force-graph-3d';
// import * as THREE from 'three';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import { FaArrowLeft, FaSignOutAlt, FaPaperPlane, FaSync, FaExclamationTriangle, FaUser, FaRobot } from 'react-icons/fa';
// import { SiGooglesheets } from 'react-icons/si';
// import './AnalysisNew.css';

// const funFacts = [
//     "Did you know? The first database was created in the 1960s!",
//     "AI can analyze years of data in seconds!",
//     "Data visualization helps humans process information 60,000 times faster!",
//     "85% of businesses say AI gives them a competitive advantage!",
//     "The average person generates 1.7 MB of data every second!"
// ];

// const Analysis = () => {
//     const { id } = useParams();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { user, signOut } = useAuth();
    
//     const [analysis, setAnalysis] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [question, setQuestion] = useState('');
//     const [asking, setAsking] = useState(false);
//     const [currentFact, setCurrentFact] = useState(0);
//     const [graphData, setGraphData] = useState({ nodes: [], links: [] });
//     const [selectedNode, setSelectedNode] = useState(null);
//     const [imageUrl, setImageUrl] = useState('');
    
//     const chatEndRef = useRef(null);
//     const fgRef = useRef();

//     useEffect(() => {
//         if (chatEndRef.current) {
//             chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
//         }
//     }, [analysis?.conversations]);

//     // Polling for processing status
//     useEffect(() => {
//         let interval;
        
//         const checkStatus = async () => {
//             try {
//                 const statusData = await analysisAPI.checkStatus(id);
                
//                 if (statusData.data.status === 'completed') {
//                     fetchAnalysis();
//                     clearInterval(interval);
//                 } else if (statusData.data.status === 'failed') {
//                     setError(statusData.data.errorMessage || 'Analysis failed');
//                     setLoading(false);
//                     clearInterval(interval);
//                 }
//             } catch (err) {
//                 console.error('Status check error:', err);
//             }
//         };

//         if (location.state?.processing) {
//             interval = setInterval(checkStatus, 3000); // Check every 3 seconds
            
//             // Rotate fun facts
//             const factInterval = setInterval(() => {
//                 setCurrentFact((prev) => (prev + 1) % funFacts.length);
//             }, 5000);

//             return () => {
//                 clearInterval(interval);
//                 clearInterval(factInterval);
//             };
//         } else {
//             fetchAnalysis();
//         }

//         return () => clearInterval(interval);
//     }, [id, location.state]);

//     const fetchAnalysis = async () => {
//         try {
//             const data = await analysisAPI.getById(id);
//             console.log('Analysis data received:', data.data);
//             setAnalysis(data.data);
            
//             // Extract 3D schema data from external API response
//             console.log('raw3DData:', data.data.raw3DData);
//             console.log('Schema from raw3DData:', data.data.raw3DData?.schema);
            
//             if (data.data.raw3DData?.schema) {
//                 const schema = data.data.raw3DData.schema;
//                 console.log('Setting graph data:', schema);
//                 console.log('Nodes:', schema.nodes);
//                 console.log('Links:', schema.links);
//                 setGraphData(schema);
//             } else {
//                 console.warn('No schema data found in raw3DData');
//             }
            
//             // Extract image URL from external API response
//             const imgUrl = data.data.raw3DData?.imageUrl || data.data.rawUploadData?.imageUrl;
//             console.log('Image URL:', imgUrl);
//             if (imgUrl) {
//                 setImageUrl(imgUrl);
//             }
            
//             setLoading(false);
            
//             // Set up 3D graph camera after data loads
//             setTimeout(() => {
//                 if (fgRef.current && graphData.nodes.length > 0) {
//                     console.log('Setting up 3D camera');
//                     fgRef.current.cameraPosition({ z: 800 });
//                     fgRef.current.d3Force('charge').strength(-1000);
//                     fgRef.current.d3Force('link').distance(200);
//                 } else {
//                     console.warn('3D graph not ready or no nodes');
//                 }
//             }, 500);
//         } catch (err) {
//             console.error('Fetch analysis error:', err);
//             setError(err.message || 'Failed to load analysis');
//             setLoading(false);
//         }
//     };

//     const handleAskQuestion = async (e) => {
//         e.preventDefault();
//         if (!question.trim()) return;

//         setAsking(true);
//         try {
//             const response = await analysisAPI.askQuestion(id, question);
            
//             setAnalysis({
//                 ...analysis,
//                 conversations: [
//                     ...analysis.conversations,
//                     {
//                         question,
//                         answer: response.data.answer,
//                         timestamp: new Date()
//                     }
//                 ]
//             });
            
//             setQuestion('');
//         } catch (err) {
//             console.error('Question error:', err);
//         } finally {
//             setAsking(false);
//         }
//     };

//     const handleNodeClick = (node) => {
//         setSelectedNode(node);
//     };

//     // Custom node rendering for 3D graph
//     const nodeThreeObject = (node) => {
//         const group = new THREE.Group();
        
//         const geometry = new THREE.BoxGeometry(80, 50, 20);
//         const material = new THREE.MeshLambertMaterial({
//             color: node.id === selectedNode?.id ? '#3b82f6' : '#1e293b',
//             transparent: true,
//             opacity: 0.9
//         });
//         const mesh = new THREE.Mesh(geometry, material);
//         group.add(mesh);
        
//         const edges = new THREE.EdgesGeometry(geometry);
//         const line = new THREE.LineSegments(
//             edges,
//             new THREE.LineBasicMaterial({ color: '#60a5fa' })
//         );
//         group.add(line);
        
//         const canvas = document.createElement('canvas');
//         const context = canvas.getContext('2d');
//         canvas.width = 256;
//         canvas.height = 128;
        
//         context.fillStyle = '#ffffff';
//         context.font = 'Bold 24px Arial';
//         context.textAlign = 'center';
//         context.fillText(node.name, 128, 64);
        
//         const texture = new THREE.CanvasTexture(canvas);
//         const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
//         const sprite = new THREE.Sprite(spriteMaterial);
//         sprite.scale.set(80, 40, 1);
//         sprite.position.set(0, 0, 11);
//         group.add(sprite);
        
//         return group;
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
//                     <FaSync className="animate-spin text-blue-600 text-5xl mx-auto mb-6" />
//                     <h2 className="text-3xl font-bold text-gray-800 mb-2">
//                         Analyzing Your Data...
//                     </h2>
//                     <p className="text-gray-600 mb-6">
//                         This may take a few moments. Please don't close this page.
//                     </p>
//                     <div className="bg-blue-50 rounded-lg p-4 transition-all duration-500">
//                         <p className="text-sm text-blue-800 italic">
//                             {funFacts[currentFact]}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//                 <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
//                     <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <FaExclamationTriangle className="text-red-600 text-4xl" />
//                     </div>
//                     <h2 className="text-3xl font-bold text-gray-800 mb-2">Analysis Failed</h2>
//                     <p className="text-gray-600 mb-6">{error}</p>
//                     <button
//                         onClick={() => navigate('/')}
//                         className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
//                     >
//                         Return to Home
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-900 flex flex-col">
//             {/* Header */}
//             <header className="bg-gray-800 shadow-lg z-20 border-b border-gray-700">
//                 <div className="px-6 py-4 flex justify-between items-center">
//                     <div className="flex items-center gap-4">
//                         <button 
//                             onClick={() => navigate('/')} 
//                             className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
//                         >
//                             <FaArrowLeft className="w-5 h-5" />
//                         </button>
//                         <div className="flex items-center gap-2">
//                             <SiGooglesheets className="text-blue-500 h-7 w-7" />
//                             <h1 className="text-xl font-bold text-white">Database Analysis Dashboard</h1>
//                         </div>
//                     </div>
//                     <button 
//                         onClick={signOut} 
//                         className="flex items-center gap-2 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
//                     >
//                         <FaSignOutAlt className="w-5 h-5" />
//                     </button>
//                 </div>
//             </header>

//             {/* Main Content - 3 Panel Layout */}
//             <main className="flex-1 flex overflow-hidden">
//                 {/* Left Panel - Chat Interface */}
//                 <div className="w-1/3 bg-gray-800 border-r border-gray-700 flex flex-col">
//                     <div className="p-6 border-b border-gray-700">
//                         <h2 className="text-2xl font-bold text-white">Chat Interface</h2>
//                         <p className="text-gray-400 text-sm mt-1">Ask questions about your data</p>
//                     </div>
                    
//                     <div className="flex-1 p-6 overflow-y-auto space-y-4">
//                         {analysis?.conversations?.length === 0 && (
//                             <div className="text-center text-gray-500 mt-20">
//                                 <FaRobot className="text-6xl mx-auto mb-4 opacity-50" />
//                                 <p className="text-lg">No messages yet</p>
//                                 <p className="text-sm mt-2">Ask a question about your database schema to get started</p>
//                             </div>
//                         )}
//                         {analysis?.conversations?.map((conv, index) => (
//                             <div key={index} className="space-y-3">
//                                 {/* User Question */}
//                                 <div className="flex justify-end chat-message-user">
//                                     <div className="bg-blue-600 text-white rounded-lg rounded-br-none p-4 max-w-[85%] shadow-lg">
//                                         <div className="flex items-start gap-2">
//                                             <FaUser className="mt-1 flex-shrink-0" />
//                                             <p className="text-sm">{conv.question}</p>
//                                         </div>
//                                     </div>
//                                 </div>
                                
//                                 {/* AI Answer with Markdown */}
//                                 <div className="flex justify-start chat-message-ai">
//                                     <div className="bg-gray-700 text-white rounded-lg rounded-bl-none p-4 max-w-[85%] shadow-lg">
//                                         <div className="flex items-start gap-2">
//                                             <FaRobot className="mt-1 flex-shrink-0 text-green-400" />
//                                             <div className="text-sm markdown-content">
//                                                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                                                     {conv.answer}
//                                                 </ReactMarkdown>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                         <div ref={chatEndRef} />
//                     </div>

//                     {/* Chat Input */}
//                     <div className="p-4 border-t border-gray-700 bg-gray-800">
//                         <form onSubmit={handleAskQuestion} className="flex items-center gap-3">
//                             <input
//                                 type="text"
//                                 value={question}
//                                 onChange={(e) => setQuestion(e.target.value)}
//                                 placeholder="Ask about your database schema..."
//                                 className="flex-1 px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400"
//                             />
//                             <button
//                                 type="submit"
//                                 disabled={asking || !question.trim()}
//                                 className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-110"
//                             >
//                                 {asking ? (
//                                     <FaSync className="animate-spin w-5 h-5" />
//                                 ) : (
//                                     <FaPaperPlane className="w-5 h-5" />
//                                 )}
//                             </button>
//                         </form>
//                     </div>
//                 </div>

//                 {/* Right Panel - Split into Top (3D) and Bottom (Image) */}
//                 <div className="flex-1 flex flex-col">
//                     {/* Top Right - 3D Schema Visualization */}
//                     <div className="h-2/3 bg-gray-900 relative border-b border-gray-700">
//                         <div className="absolute top-4 left-4 z-10 info-card p-4 rounded-lg shadow-lg border border-gray-700">
//                             <h3 className="text-lg font-bold text-white mb-2">3D Database Schema</h3>
//                             <p className="text-gray-400 text-sm mb-3">Interactive Entity-Relationship Diagram</p>
//                             <div className="space-y-2 text-sm">
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-4 h-4 bg-gray-700 border-2 border-blue-400 rounded"></div>
//                                     <span className="text-gray-300">Tables</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-12 h-0.5 bg-blue-500"></div>
//                                     <span className="text-gray-300">Relationships</span>
//                                 </div>
//                             </div>
//                             <div className="mt-4 text-xs text-gray-400 space-y-1">
//                                 <p>🖱️ Click & drag to rotate</p>
//                                 <p>🔍 Scroll to zoom</p>
//                                 <p>👆 Click nodes for details</p>
//                             </div>
//                         </div>

//                         {selectedNode && (
//                             <div className="absolute top-4 right-4 z-10 node-detail-card info-card p-4 rounded-lg shadow-lg max-w-md border border-gray-700">
//                                 <div className="flex justify-between items-start mb-3">
//                                     <h3 className="text-lg font-bold text-white">{selectedNode.name}</h3>
//                                     <button
//                                         onClick={() => setSelectedNode(null)}
//                                         className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
//                                     >
//                                         ✕
//                                     </button>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-sm text-gray-400 font-semibold">Attributes:</p>
//                                     {selectedNode.attributes?.map((attr, idx) => (
//                                         <div key={idx} className="text-sm text-white flex justify-between items-center bg-gray-700 px-3 py-2 rounded transition-colors hover:bg-gray-600">
//                                             <span className="font-medium">{attr.name}</span>
//                                             <div className="flex gap-2 items-center">
//                                                 <span className="text-gray-400">{attr.type}</span>
//                                                 {attr.isPrimaryKey && (
//                                                     <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">PK</span>
//                                                 )}
//                                                 {attr.isForeignKey && (
//                                                     <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded">FK</span>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         <div className="absolute bottom-4 left-4 z-10 info-card px-4 py-2 rounded-lg shadow-lg border border-gray-700">
//                             <p className="text-sm text-gray-300">
//                                 <span className="font-semibold text-white">{graphData.nodes.length}</span> Tables • 
//                                 <span className="font-semibold text-white ml-2">{graphData.links.length}</span> Relations
//                             </p>
//                         </div>

//                         {graphData.nodes.length > 0 ? (
//                             <div className="graph-container">
//                                 <ForceGraph3D
//                                     ref={fgRef}
//                                     graphData={graphData}
//                                     nodeLabel="name"
//                                     nodeAutoColorBy="type"
//                                     nodeThreeObject={nodeThreeObject}
//                                     linkDirectionalParticles={2}
//                                     linkDirectionalParticleSpeed={0.005}
//                                     linkDirectionalParticleWidth={2}
//                                     linkColor={() => '#60a5fa'}
//                                     linkWidth={2}
//                                     linkOpacity={0.6}
//                                     onNodeClick={handleNodeClick}
//                                     backgroundColor="#111827"
//                                     showNavInfo={false}
//                                     enableNodeDrag={true}
//                                     enableNavigationControls={true}
//                                     d3AlphaDecay={0.02}
//                                     d3VelocityDecay={0.3}
//                                 />
//                             </div>
//                         ) : (
//                             <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 graph-loading">
//                                 <FaSync className="text-5xl mb-4 opacity-30 graph-loading-spinner" />
//                                 <p className="text-lg">Loading schema data...</p>
//                                 <p className="text-sm mt-2">Waiting for 3D visualization from external API</p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Bottom Right - Image from External API */}
//                     <div className="h-1/3 bg-gray-800 p-6 overflow-auto">
//                         <h3 className="text-xl font-bold text-white mb-4">Generated Visualization</h3>
//                         {imageUrl ? (
//                             <div className="image-container w-full h-[calc(100%-3rem)] flex items-center justify-center p-4">
//                                 <img 
//                                     src={imageUrl} 
//                                     alt="Database Visualization" 
//                                     className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
//                                 />
//                             </div>
//                         ) : (
//                             <div className="w-full h-[calc(100%-3rem)] flex flex-col items-center justify-center text-gray-500">
//                                 <svg className="w-20 h-20 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                 </svg>
//                                 <p className="text-lg">No visualization image available</p>
//                                 <p className="text-sm mt-2">Image will appear here when generated by the external API</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default Analysis;




import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analysisAPI } from '../services/api';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaArrowLeft, FaSignOutAlt, FaPaperPlane, FaSync, FaExclamationTriangle, FaUser, FaRobot, FaDatabase } from 'react-icons/fa';
import { SiGooglesheets } from 'react-icons/si';
import './AnalysisImproved.css';

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
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [selectedNode, setSelectedNode] = useState(null);
    const [graphReady, setGraphReady] = useState(false);
    
    const chatEndRef = useRef(null);
    const fgRef = useRef();

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [analysis?.conversations]);

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
            interval = setInterval(checkStatus, 3000);
            
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
            console.log('📊 === FULL ANALYSIS RESPONSE ===');
            console.log(JSON.stringify(data.data, null, 2));
            
            setAnalysis(data.data);
            
            // CRITICAL: Check if schema exists directly in raw3DData
            if (data.data.raw3DData) {
                console.log('🔍 raw3DData exists:', data.data.raw3DData);
                
                let schema = null;
                
                // Check if schema is nested
                if (data.data.raw3DData.schema) {
                    schema = data.data.raw3DData.schema;
                    console.log('✅ Schema found at raw3DData.schema');
                } 
                // Check if nodes are at root level of raw3DData
                else if (data.data.raw3DData.nodes) {
                    schema = {
                        nodes: data.data.raw3DData.nodes,
                        links: data.data.raw3DData.links || []
                    };
                    console.log('✅ Schema found at raw3DData root level');
                }
                
                if (schema && schema.nodes && schema.nodes.length > 0) {
                    console.log('📈 Setting graph data:', schema);
                    console.log('📊 Nodes:', schema.nodes.length);
                    console.log('🔗 Links:', schema.links.length);
                    setGraphData(schema);
                    setGraphReady(true);
                } else {
                    console.error('❌ No valid schema found');
                    console.log('Available keys in raw3DData:', Object.keys(data.data.raw3DData));
                }
            } else {
                console.error('❌ raw3DData is missing from response');
            }
            
            setLoading(false);
        } catch (err) {
            console.error('❌ Fetch error:', err);
            setError(err.message || 'Failed to load analysis');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (graphReady && graphData.nodes.length > 0 && fgRef.current) {
            console.log('🎨 Initializing 3D graph');
            
            setTimeout(() => {
                if (fgRef.current) {
                    fgRef.current.cameraPosition({ z: 800 });
                    fgRef.current.d3Force('charge').strength(-1000);
                    fgRef.current.d3Force('link').distance(200);
                }
            }, 500);
        }
    }, [graphReady, graphData]);

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setAsking(true);
        try {
            const response = await analysisAPI.askQuestion(id, question);
            
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

    const handleNodeClick = (node) => {
        setSelectedNode(node);
    };

    const nodeThreeObject = (node) => {
        const group = new THREE.Group();
        
        const shape = new THREE.Shape();
        const width = 80;
        const height = 50;
        const radius = 8;
        
        shape.moveTo(-width/2 + radius, -height/2);
        shape.lineTo(width/2 - radius, -height/2);
        shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius);
        shape.lineTo(width/2, height/2 - radius);
        shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2);
        shape.lineTo(-width/2 + radius, height/2);
        shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius);
        shape.lineTo(-width/2, -height/2 + radius);
        shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2);
        
        const extrudeSettings = {
            depth: 20,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 1,
            bevelSegments: 3
        };
        
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshLambertMaterial({
            color: node.id === selectedNode?.id ? '#3b82f6' : '#1e293b',
            transparent: true,
            opacity: 0.9
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = -10;
        group.add(mesh);
        
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: '#60a5fa', linewidth: 2 })
        );
        line.position.z = -10;
        group.add(line);
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.fillStyle = '#ffffff';
        context.font = 'Bold 24px Arial';
        context.textAlign = 'center';
        context.fillText(node.name, 128, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(80, 40, 1);
        sprite.position.set(0, 0, 11);
        group.add(sprite);
        
        return group;
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
        <div className="analysis-main-container">
            <header className="analysis-header">
                <div className="analysis-header-content">
                    <div className="analysis-logo-section">
                        <button onClick={() => navigate('/')} className="back-button">
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="logo-section">
                            <SiGooglesheets className="logo-icon" />
                            <span className="logo-text">Database Analysis</span>
                        </div>
                    </div>
                    <div className="user-section">
                        {user?.photoURL && (
                            <img src={user.photoURL} alt="Profile" className="user-avatar" />
                        )}
                        <button onClick={signOut} className="signout-button">
                            <FaSignOutAlt className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="analysis-content">
                <div className="visualization-panel">
                    <div className="info-card" style={{ top: '2rem', left: '2rem' }}>
                        <div className="info-card-header">
                            <div>
                                <div className="info-card-title">
                                    <FaDatabase style={{ color: '#3b82f6' }} />
                                    Schema Overview
                                </div>
                                <p className="info-card-subtitle">Interactive 3D Entity-Relationship Diagram</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="info-item">
                                <div className="info-badge"></div>
                                <span className="info-text">{graphData.nodes.length} Tables</span>
                            </div>
                            <div className="info-item">
                                <div className="info-link-line"></div>
                                <span className="info-text">{graphData.links.length} Relationships</span>
                            </div>
                        </div>
                        <div className="info-controls">
                            <div>🖱️ Click & drag to rotate</div>
                            <div>🔍 Scroll to zoom</div>
                            <div>👆 Click nodes for details</div>
                        </div>
                    </div>

                    {selectedNode && (
                        <div className="info-card node-detail-card">
                            <div className="node-header">
                                <h3 className="node-title">{selectedNode.name}</h3>
                                <button onClick={() => setSelectedNode(null)} className="close-button">
                                    ✕
                                </button>
                            </div>
                            <div className="attributes-section">
                                <p className="attributes-label">Attributes</p>
                                {selectedNode.attributes?.length > 0 ? (
                                    selectedNode.attributes.map((attr, idx) => (
                                        <div key={idx} className="attribute-item">
                                            <span className="attribute-name">{attr.name}</span>
                                            <div className="attribute-details">
                                                <span className="attribute-type">{attr.type}</span>
                                                {attr.isPrimaryKey && (
                                                    <span className="badge badge-pk">PK</span>
                                                )}
                                                {attr.isForeignKey && (
                                                    <span className="badge badge-fk">FK</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                                        No attributes available
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="stats-card">
                        <p className="stats-text">
                            <span className="stats-number">{graphData.nodes.length}</span> Tables • 
                            <span className="stats-number" style={{ marginLeft: '0.5rem' }}>{graphData.links.length}</span> Relations
                        </p>
                    </div>

                    {graphData.nodes.length > 0 ? (
                        <div className="graph-container">
                            <ForceGraph3D
                                ref={fgRef}
                                graphData={graphData}
                                nodeLabel="name"
                                nodeAutoColorBy="type"
                                nodeThreeObject={nodeThreeObject}
                                linkDirectionalParticles={2}
                                linkDirectionalParticleSpeed={0.005}
                                linkDirectionalParticleWidth={2}
                                linkColor={() => '#60a5fa'}
                                linkWidth={2}
                                linkOpacity={0.6}
                                onNodeClick={handleNodeClick}
                                backgroundColor="#0f172a"
                                showNavInfo={false}
                                enableNodeDrag={true}
                                enableNavigationControls={true}
                                d3AlphaDecay={0.02}
                                d3VelocityDecay={0.3}
                                warmupTicks={100}
                                cooldownTicks={200}
                            />
                        </div>
                    ) : (
                        <div className="loading-container">
                            <FaSync className="loading-spinner" />
                            <p className="loading-text">Loading schema data...</p>
                            <p className="loading-subtext">Waiting for 3D visualization from external API</p>
                        </div>
                    )}
                </div>

                <div className="chat-panel">
                    <div className="chat-header">
                        <div className="chat-title">
                            <FaRobot style={{ color: '#10b981' }} />
                            AI Assistant
                        </div>
                        <p className="chat-subtitle">Ask questions about your database</p>
                    </div>
                    
                    <div className="chat-messages">
                        {analysis?.conversations?.length === 0 && (
                            <div className="empty-chat">
                                <FaRobot className="empty-icon" />
                                <p className="empty-title">No messages yet</p>
                                <p className="empty-subtitle">Ask a question about your database schema to get started</p>
                            </div>
                        )}
                        {analysis?.conversations?.map((conv, index) => (
                            <div key={index} className="message-group">
                                <div className="message-user">
                                    <div className="message-bubble">
                                        <div className="message-content">
                                            <FaUser className="message-icon" />
                                            <p className="message-text">{conv.question}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="message-ai">
                                    <div className="message-bubble">
                                        <div className="message-content">
                                            <FaRobot className="message-icon" style={{ color: '#10b981' }} />
                                            <div className="message-text markdown-content">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {conv.answer}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <form onSubmit={handleAskQuestion} className="chat-input-form">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Ask about your database..."
                                className="chat-input"
                            />
                            <button
                                type="submit"
                                disabled={asking || !question.trim()}
                                className="send-button"
                            >
                                {asking ? (
                                    <FaSync className="animate-spin" />
                                ) : (
                                    <FaPaperPlane />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analysis;