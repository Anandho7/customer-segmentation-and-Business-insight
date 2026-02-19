import React from 'react';
import { Lightbulb, DollarSign, Users, TrendingUp, Target, AlertCircle, Award, Briefcase } from 'lucide-react';

interface InsightsProps {
    insights: any; // Using any for flexibility with stats keys
}

const getSegmentStyle = (label: string) => {
    if (label.includes('High Value')) return 'from-amber-500/20 to-orange-600/20 border-amber-500/50 text-amber-500';
    if (label.includes('Risk') || label.includes('Low')) return 'from-red-500/20 to-pink-600/20 border-red-500/50 text-red-400';
    if (label.includes('Potential') || label.includes('Saver')) return 'from-blue-500/20 to-cyan-600/20 border-blue-500/50 text-blue-400';
    return 'from-slate-700/50 to-slate-800/50 border-slate-600 text-slate-300';
};

const getSegmentIcon = (label: string) => {
    if (label.includes('High Value')) return <Award className="w-6 h-6 text-amber-500" />;
    if (label.includes('Risk')) return <AlertCircle className="w-6 h-6 text-red-400" />;
    if (label.includes('Potential')) return <Target className="w-6 h-6 text-blue-400" />;
    return <Users className="w-6 h-6 text-slate-400" />;
};

const getRecommendation = (label: string) => {
    if (label.includes('High Value')) return "Offer VIP perks, exclusive early access, and loyalty rewards to retain.";
    if (label.includes('Risk')) return "Re-engage with discounts, win-back campaigns, and surveys to understand churn.";
    if (label.includes('Potential') || label.includes('Saver')) return "Upsell premium products and offer bundle deals to increase wallet share.";
    if (label.includes('Low')) return "Monitor for changes, automate low-cost engagement.";
    return "Standard engagement strategies.";
};

const Insights: React.FC<InsightsProps> = ({ insights }) => {
    if (!insights || Object.keys(insights).length === 0) return null;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Lightbulb className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                    AI Business Insights
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(insights).map(([clusterId, data]: [string, any]) => {
                    const style = getSegmentStyle(data.label);
                    const icon = getSegmentIcon(data.label);

                    // Safe access to stats with fallbacks
                    const income = Math.round(data.stats['Annual Income (k$)'] || data.stats['Income'] || 0);
                    const spend = Math.round(data.stats['Total Spending'] || data.stats['Spending Score (1-100)'] || 0);
                    const freq = Math.round(data.stats['Purchase Frequency'] || 0);

                    return (
                        <div
                            key={clusterId}
                            className={`relative bg-gradient-to-br ${style} bg-opacity-10 backdrop-blur-md p-6 rounded-3xl border shadow-xl hover:-translate-y-1 transition-transform duration-300 group overflow-hidden`}
                        >
                            {/* Glow Effect */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/10 transition-colors"></div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-black/20 rounded-xl backdrop-blur-sm shadow-inner">
                                        {icon}
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider opacity-70 font-semibold">Cluster {clusterId}</p>
                                        <h3 className="font-bold text-lg leading-tight">{data.label}</h3>
                                    </div>
                                </div>
                            </div>

                            <p className="text-slate-300 text-sm mb-6 min-h-[40px] leading-relaxed">
                                {data.description.replace(`Cluster ${clusterId} contains`, 'Contains')}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 py-4 border-t border-white/10 bg-black/5 rounded-xl px-2 mb-4">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Income</p>
                                    <p className="text-white font-bold text-sm bg-slate-800/50 rounded py-1">${income}k</p>
                                </div>
                                <div className="text-center border-l border-white/10">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Spend</p>
                                    <p className="text-white font-bold text-sm bg-slate-800/50 rounded py-1">{spend}</p>
                                </div>
                                <div className="text-center border-l border-white/10">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Freq</p>
                                    <p className="text-white font-bold text-sm bg-slate-800/50 rounded py-1">{freq}/yr</p>
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="flex items-start gap-2 bg-black/20 p-3 rounded-lg border border-white/5">
                                <Briefcase className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-slate-300 italic">
                                    "{getRecommendation(data.label)}"
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Insights;
