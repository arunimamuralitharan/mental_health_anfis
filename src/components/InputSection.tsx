import React, { useState } from "react";
import {
  Upload,
  FileText,
  Send,
  AlertCircle,
  FileLineChart,
} from "lucide-react";
import { cn } from "../lib/utils";
import { AssessmentState } from "./Dashboard";

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  status: AssessmentState;
}

export default function InputSection({ onAnalyze, status }: InputSectionProps) {
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const charCount = text.length;
  const isAnalyzing = status === "analyzing";

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target?.result as string);
        setUploadedFile(file.name);
      };
      reader.readAsText(file);
    } else {
      // Simulate PDF parsing
      setUploadedFile(file.name);
      setText(
        "Simulated transcript from PDF upload. Patient discusses extreme anxiety related to social situations and overwhelming sadness...",
      );
    }
  };

  return (
    <div className="bento-card">
      <h2 className="bento-title">Patient Text Analysis</h2>

      <div
        className={cn(
          "relative transition-all duration-200 mt-2",
          isDragging ? "bg-primary-50/50" : "",
          isAnalyzing && "opacity-60 pointer-events-none",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste patient narrative, therapy transcript, or social media text here..."
          className="w-full h-[180px] p-3 bg-[#F1F5F9] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[8px] resize-none outline-none text-[13px] text-slate-900 dark:text-slate-100 font-sans leading-relaxed placeholder:text-slate-500 dark:placeholder:text-slate-600"
          spellCheck="false"
        />

        {isDragging && (
          <div className="absolute inset-0 bg-primary-500/10 backdrop-blur-[2px] flex items-center justify-center border-dashed border-2 border-primary-500 rounded-[8px]">
            <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-md shadow-sm flex items-center gap-2 text-primary-700 dark:text-primary-400 font-medium text-[13px]">
              <Upload className="w-5 h-5" />
              Drop file to parse
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 mb-1">
        <div className="text-[11px] text-slate-500">
          {charCount.toLocaleString()} characters
        </div>
        <div>
          <input
            type="file"
            id="file-upload"
            accept=".txt,.pdf"
            className="hidden"
            onChange={handleFileInput}
          />
          <label
            htmlFor="file-upload"
            className="text-[11px] text-primary-600 font-semibold cursor-pointer hover:underline"
          >
            {uploadedFile ? uploadedFile : "Upload .PDF / .TXT"}
          </label>
        </div>
      </div>

      <button
        onClick={() => onAnalyze(text)}
        disabled={charCount === 0 || isAnalyzing}
        className={cn(
          "w-full mt-[12px] flex items-center justify-center py-[10px] rounded-[8px] font-semibold text-[13px] text-white transition-all cursor-pointer border-none",
          charCount === 0 || isAnalyzing
            ? "bg-slate-300 cursor-not-allowed"
            : "bg-primary-600 hover:bg-primary-700",
        )}
      >
        {isAnalyzing ? "Analyzing Data..." : "Analyze Risk Profile"}
      </button>
    </div>
  );
}
