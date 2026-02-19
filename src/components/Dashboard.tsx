import React, { useState, useEffect } from 'react';
import Upload from './Upload';
import { ClusterScatterChart, ClusterDistributionChart } from './Charts';
import Insights from './Insights';
import { getClusters, getInsights, downloadResults } from '../api';
import { Download, LayoutDashboard, Database, PieChart, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [insights, setInsights] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [isDataReady, setIsDataReady] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const clusterData = await getClusters();
            const insightsData = await getInsights();
            if (clusterData && clusterData.length > 0) {
                setData(clusterData);
                setInsights(insightsData);
                setIsDataReady(true);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = async () => {
        await fetchData();
    };

    const handleDownload = async () => {
        try {
            await downloadResults();
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download results.");
        }
    };

    return (
        <div className="min-h-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-cover text-slate-100 font-sans selection:bg-primary selection:text-white">
            <div className="backdrop-blur-3xl min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* Header */}
                    <header className="flex flex-col md:flex-row justify-between items-center bg-surface/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl animate-fade-in relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="flex items-center gap-4 z-10">
                            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20">
                                <LayoutDashboard className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                                    Customer Segmentation AI
                                </h1>
                                <p className="text-slate-400 mt-1 font-medium">
                                    Transform raw data into actionable business intelligence
                                </p>
                            </div>
                        </div>

                        {isDataReady && (
                            <button
                                onClick={handleDownload}
                                className="mt-4 md:mt-0 z-10 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/25 hover:scale-105 active:scale-95"
                            >
                                <Download className="w-5 h-5" />
                                <span>Export Report</span>
                            </button>
                        )}
                    </header>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left Column: Upload & Stats */}
                        <div className="lg:col-span-4 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <Upload onUploadSuccess={handleUploadSuccess} />

                            {isDataReady && (
                                <div className="bg-surface/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl">
                                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                        <Database className="w-5 h-5 text-accent" />
                                        Data Overview
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-background/50 p-4 rounded-2xl border border-white/5">
                                            <p className="text-slate-400 text-sm">Total Customers</p>
                                            <p className="text-3xl font-bold text-white mt-1">{data.length}</p>
                                        </div>
                                        <div className="bg-background/50 p-4 rounded-2xl border border-white/5">
                                            <p className="text-slate-400 text-sm">Segments Found</p>
                                            <p className="text-3xl font-bold text-accent mt-1">{Object.keys(insights).length}</p>
                                        </div>
                                        <div className="col-span-2 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <p className="text-emerald-400 font-medium text-sm">Analysis Complete</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Visualizations & Insights */}
                        <div className="lg:col-span-8 space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            {loading ? (
                                <div className="h-[600px] flex flex-col items-center justify-center bg-surface/30 backdrop-blur-md rounded-3xl border border-white/5 animate-pulse">
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Activity className="w-8 h-8 text-primary animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="text-slate-300 mt-6 font-medium text-lg">Analyzing Patterns...</p>
                                    <p className="text-slate-500 text-sm mt-2">Running K-Means Clustering on your data</p>
                                </div>
                            ) : isDataReady ? (
                                <>
                                    {/* Charts Section */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <div className="bg-surface/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl hover:border-primary/20 transition-colors duration-300">
                                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                                <Activity className="w-5 h-5 text-secondary" />
                                                Income vs Spending
                                            </h3>
                                            <ClusterScatterChart data={data} />
                                        </div>
                                        <div className="bg-surface/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl hover:border-primary/20 transition-colors duration-300">
                                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                                <PieChart className="w-5 h-5 text-pink-500" />
                                                Segment Distribution
                                            </h3>
                                            <ClusterDistributionChart data={data} />
                                        </div>
                                    </div>

                                    {/* Insights Section */}
                                    <div className="bg-surface/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl">
                                        <Insights insights={insights} />
                                    </div>
                                </>
                            ) : (
                                <div className="h-[600px] flex flex-col items-center justify-center bg-surface/30 backdrop-blur-md rounded-3xl border border-dashed border-slate-700/50 group hover:border-primary/30 transition-all duration-300">
                                    <div className="p-6 bg-surface rounded-full shadow-2xl shadow-black/50 mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <PieChart className="w-16 h-16 text-slate-600 group-hover:text-primary transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Ready to Analyze</h3>
                                    <p className="text-slate-400 max-w-md text-center">
                                        Upload your customer CSV file to generate detailed segments and actionable business insights instantly.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
