import React from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';

interface ChartProps {
    data: any[];
}

// Updated premium color palette
const COLORS = [
    '#f59e0b', // Amber (High Value)
    '#ef4444', // Red (Risk)
    '#3b82f6', // Blue (Potential)
    '#10b981', // Emerald (Safe)
    '#8b5cf6', // Violet
    '#ec4899', // Pink
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-xl">
                <p className="text-slate-300 text-xs mb-1 font-semibold">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-bold text-white">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const ClusterScatterChart: React.FC<ChartProps> = ({ data }) => {
    const incomeKey = Object.keys(data[0] || {}).find(k => k.toLowerCase().includes('income')) || 'x';
    const spendingKey = Object.keys(data[0] || {}).find(k => k.toLowerCase().includes('spending') || k.toLowerCase().includes('score')) || 'y';

    const clusters = Array.from(new Set(data.map(d => d.Cluster))).sort((a: any, b: any) => a - b);

    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis
                        type="number"
                        dataKey={incomeKey}
                        name="Income"
                        unit="k"
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#475569' }}
                    />
                    <YAxis
                        type="number"
                        dataKey={spendingKey}
                        name="Spending"
                        unit=""
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#475569' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1' }} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    {clusters.map((clusterId: any, index) => (
                        <Scatter
                            key={clusterId}
                            name={`Cluster ${clusterId}`}
                            data={data.filter(d => d.Cluster === clusterId)}
                            fill={COLORS[index % COLORS.length]}
                            shape="circle"
                        />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export const ClusterDistributionChart: React.FC<ChartProps> = ({ data }) => {
    const counts: Record<string, number> = {};
    data.forEach(d => {
        const key = `Cluster ${d.Cluster}`;
        counts[key] = (counts[key] || 0) + 1;
    });

    const chartData = Object.entries(counts).map(([name, value]) => ({
        name,
        value,
    })).sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#475569' }}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#475569' }}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    />
                    <Bar dataKey="value" name="Customers" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
