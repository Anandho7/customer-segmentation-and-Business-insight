import React, { useState } from 'react';
import { uploadFile } from '../api';
import { Upload as UploadIcon, FileUp, Loader2, FileType, CheckCircle } from 'lucide-react';

interface UploadProps {
    onUploadSuccess: (data: any) => void;
}

const Upload: React.FC<UploadProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "text/csv" || droppedFile.name.endsWith('.csv')) {
                setFile(droppedFile);
                setError(null);
            } else {
                setError("Please upload a valid CSV file.");
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await uploadFile(file);
            onUploadSuccess(response);
        } catch (err) {
            setError("Upload failed. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FileUp className="w-5 h-5 text-secondary" />
                Upload Dataset
            </h2>

            <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer group
                    ${isDragging
                        ? 'border-primary bg-primary/10 scale-[1.02]'
                        : 'border-slate-700 hover:border-primary/50 hover:bg-slate-800/50'
                    }
                    ${file ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type='file'
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".csv"
                    onChange={handleFileChange}
                />

                {file ? (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <p className="text-white font-medium text-lg truncate max-w-[200px]">{file.name}</p>
                        <p className="text-emerald-400 text-sm mt-1">Ready to analyze</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                            <UploadIcon className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                            <p className="text-slate-300 font-medium">Click to upload or drag & drop</p>
                            <p className="text-slate-500 text-sm mt-1">CSV files only (max 10MB)</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className={`w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg
                        ${loading || !file
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                            : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processing Data...</span>
                        </>
                    ) : (
                        <>
                            <FileType className="w-5 h-5" />
                            <span>Generate Segments</span>
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 animate-fade-in">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default Upload;
