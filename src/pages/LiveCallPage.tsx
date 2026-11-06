/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { sanitizeImageUrl, handleImageError } from '../utils/imageUtils';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  FileQuestion,
  PenTool,
  Eraser,
  RotateCcw,
  Star,
  CheckCircle,
  Download,
  Shield,
  MessageSquare,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export const LiveCallPage: React.FC = () => {
  const { activeDoubtSession, completeDoubtSession, setCurrentPage, pricingConfig } = useApp();

  // If no active session, redirect to doubt solver
  useEffect(() => {
    if (!activeDoubtSession) {
      setCurrentPage('doubt-solver');
    }
  }, [activeDoubtSession, setCurrentPage]);

  // Live Timer
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isQuestionPanelOpen, setIsQuestionPanelOpen] = useState(true);

  // Call End / Invoice State
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [finalRating, setFinalRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [studentNotes, setStudentNotes] = useState(
    'Key formula: x = (-b ± √(b² - 4ac)) / (2a)\nRemember: If discriminant (b² - 4ac) < 0, roots are complex.'
  );

  // Digital Whiteboard Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState('#2563EB'); // default electric blue
  const [lineWidth, setLineWidth] = useState(3);

  // Timer effect
  useEffect(() => {
    if (isCallEnded) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCallEnded]);

  const perMinuteRate = activeDoubtSession?.perMinuteRate || pricingConfig.baseDoubtPerMinute;
  // Billing formula: Minimum 1 minute, then ceil of minutes
  const billableMinutes = Math.max(1, Math.ceil(seconds / 60));
  const currentRunningCost = billableMinutes * perMinuteRate;

  // Format MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 24;
    } else if (activeTool === 'highlighter') {
      ctx.strokeStyle = '#FEF08A88';
      ctx.lineWidth = 18;
    } else {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // End Call trigger
  const handleEndCall = () => {
    setIsCallEnded(true);
  };

  const handleSaveAndExit = () => {
    if (activeDoubtSession) {
      completeDoubtSession(
        activeDoubtSession.id,
        seconds,
        currentRunningCost,
        finalRating,
        feedbackText,
        studentNotes
      );
    }
    setCurrentPage('parent-portal');
  };

  if (!activeDoubtSession) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white flex flex-col">
      {/* Top Session Ribbon */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Tutor info & status */}
        <div className="flex items-center gap-3">
          <img
            src={sanitizeImageUrl(activeDoubtSession.tutorPhoto, activeDoubtSession.tutorName)}
            alt={activeDoubtSession.tutorName}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, activeDoubtSession.tutorName)}
            className="w-10 h-10 rounded-full object-cover border border-slate-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100">
                {activeDoubtSession.tutorName}
              </span>
              <span className="text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                Live Now
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {activeDoubtSession.subject} · {activeDoubtSession.grade} ({activeDoubtSession.board})
            </div>
          </div>
        </div>

        {/* Center: Live Running Timer & Per-Minute Meter */}
        <div className="flex items-center gap-6 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Call Duration</div>
            <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
              {formatTime(seconds)}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800"></div>

          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Rate / Min</div>
            <div className="text-sm font-mono font-bold text-slate-200 tabular-nums">
              ₹{perMinuteRate}/min
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800"></div>

          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Running Bill</div>
            <div className="text-lg font-mono font-bold text-blue-400 tabular-nums">
              ₹{currentRunningCost}
            </div>
          </div>
        </div>

        {/* Right: Security & Quick controls */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Monitored Session · Minor Safeguard</span>
          </div>

          <button
            onClick={() => setIsQuestionPanelOpen(!isQuestionPanelOpen)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isQuestionPanelOpen
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <FileQuestion className="w-4 h-4" />
            <span className="hidden sm:inline">Doubt Panel</span>
          </button>
        </div>
      </div>

      {/* Main Stage: Split between Digital Whiteboard Stage & Video Feed */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left/Center: Digital Whiteboard & Interactive Workspace */}
        <div className="flex-1 flex flex-col bg-slate-900/60 p-4 relative">
          {/* Whiteboard Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 mb-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTool('pen')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTool === 'pen' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Pen</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool('highlighter')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTool === 'highlighter' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Highlighter</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool('eraser')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTool === 'eraser' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Eraser</span>
              </button>

              <button
                type="button"
                onClick={clearCanvas}
                className="px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                title="Clear whiteboard"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>

            {/* Color palette */}
            <div className="flex items-center gap-1.5">
              {['#2563EB', '#DC2626', '#16A34A', '#9333EA', '#0F172A'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setPenColor(c);
                    setActiveTool('pen');
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    penColor === c && activeTool === 'pen'
                      ? 'scale-110 border-white ring-2 ring-blue-500'
                      : 'border-slate-700'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Canvas Board Area */}
          <div className="flex-1 bg-white rounded-xl shadow-inner overflow-hidden relative border border-slate-800">
            <canvas
              ref={canvasRef}
              width={900}
              height={550}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair touch-none"
            />

            {/* Instruction watermark */}
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-[11px] text-slate-300 px-3 py-1.5 rounded-md pointer-events-none border border-slate-700">
              Interactive Whiteboard: Click and drag to solve equations together in real time.
            </div>
          </div>
        </div>

        {/* Right Drawer: Video Feeds & Question details */}
        <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between p-4 space-y-4">
          {/* Video Frames */}
          <div className="space-y-3">
            {/* Tutor Video */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 border border-slate-800">
              <img
                src={sanitizeImageUrl(activeDoubtSession.tutorPhoto, activeDoubtSession.tutorName)}
                alt="Tutor video feed"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, activeDoubtSession.tutorName)}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded text-[11px] font-semibold text-white">
                {activeDoubtSession.tutorName} (Faculty)
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-950/80 border border-emerald-700 px-2 py-0.5 rounded text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>HD Audio</span>
              </div>
            </div>

            {/* Student Video / Avatar */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800 border border-slate-700 flex items-center justify-center">
              {isVideoOff ? (
                <div className="text-center text-xs text-slate-400">
                  <VideoOff className="w-6 h-6 mx-auto mb-1 text-slate-500" />
                  <span>Camera Disabled</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-1">
                    {activeDoubtSession.studentName.slice(0, 1)}
                  </div>
                  <span className="text-xs text-slate-300">{activeDoubtSession.studentName}</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded text-[11px] font-semibold text-white">
                You (Student)
              </div>
            </div>
          </div>

          {/* Question Details Panel */}
          {isQuestionPanelOpen && (
            <div className="flex-1 bg-slate-950 rounded-xl p-3 border border-slate-800 overflow-y-auto space-y-2 text-xs">
              <div className="font-semibold text-slate-300 pb-1 border-b border-slate-800 flex justify-between">
                <span>Submitted Doubt</span>
                <span className="text-slate-500 font-normal">{activeDoubtSession.subject}</span>
              </div>

              {activeDoubtSession.doubtText && (
                <p className="text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap bg-slate-900 p-2 rounded">
                  {activeDoubtSession.doubtText}
                </p>
              )}

              {activeDoubtSession.doubtImageUrl && (
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Attached Image:</span>
                  <img
                    src={activeDoubtSession.doubtImageUrl}
                    alt="Doubt reference"
                    className="rounded border border-slate-800 max-h-36 object-contain mx-auto"
                  />
                </div>
              )}
            </div>
          )}

          {/* Call Action Bar */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full cursor-pointer transition-colors ${
                isMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-full cursor-pointer transition-colors ${
                isVideoOff ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
            </button>

            <button
              onClick={handleEndCall}
              className="px-5 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* FINAL INVOICE & RATING MODAL (Appears after End Call) */}
      {isCallEnded && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Session Completed</h2>
              <p className="text-xs text-slate-500">
                Billing terminated automatically upon call conclusion.
              </p>
            </div>

            {/* Itemized Bill */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Tutor:</span>
                <span className="font-semibold text-slate-900">{activeDoubtSession.tutorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Duration:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatTime(seconds)} ({billableMinutes} Billable Min)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rate:</span>
                <span className="font-mono text-slate-900">₹{perMinuteRate}/minute</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Final Session Charge:</span>
                <span className="font-mono text-emerald-700 text-base">₹{currentRunningCost}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2 text-center">
              <label className="block text-xs font-semibold text-slate-700">
                Rate your doubt clarity with {activeDoubtSession.tutorName}
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFinalRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= finalRating
                          ? 'fill-amber-400 stroke-amber-500'
                          : 'stroke-slate-300 fill-transparent'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Notes & Feedback */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Saved Explanation / Personal Revision Notes
                </label>
                <textarea
                  rows={3}
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Feedback for Faculty (Optional)
                </label>
                <input
                  type="text"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g. Excellent visual explanation, cleared my doubt in 5 minutes!"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  alert('Session summary and whiteboard notes saved to student account.');
                  handleSaveAndExit();
                }}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save Notes & Download Summary</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAndExit}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
