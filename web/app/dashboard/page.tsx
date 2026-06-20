'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { processBgRemoval, getImageHistory } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ processedUrl: string; remainingCredits: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState(user?.credits || 0);
  const [history, setHistory] = useState<ProcessedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadHistory = async () => {
      try {
        const data = await getImageHistory();
        if (data.history) {
          setHistory(data.history);
        }
      } catch (err) {
        console.log('Could not load history');
      }
    };

    loadHistory();
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload PNG, JPG, or WEBP image');
      return;
    }

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleProcess = async () => {
    if (!file || !accessToken) return;

    setLoading(true);
    setError(null);
    try {
      const data = await processBgRemoval(file, accessToken);
      setResult({
        processedUrl: data.image.processedUrl,
        remainingCredits: data.remainingCredits,
      });
      setCredits(data.remainingCredits);
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.processedUrl;
    link.download = 'sparkcut-bg-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[#0f1115] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="mt-2 text-slate-400">Welcome back, {user.name}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-[#12151c] px-6 py-4">
            <p className="text-sm text-slate-400">Remaining Credits</p>
            <p className="text-3xl font-bold text-orange-500">{credits}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <div className="rounded-3xl border border-slate-800 bg-[#12151c] p-8">
            <h2 className="mb-6 text-2xl font-semibold">Remove Background</h2>

            {error && (
              <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500/50 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-700 p-12 text-center transition hover:border-orange-500"
              >
                <div className="text-5xl mb-4">📸</div>
                <p className="mb-2 font-semibold text-slate-300">Drop your image here</p>
                <p className="text-sm text-slate-400">PNG, JPG, JPEG, WEBP up to 10MB</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#0f1115] p-4">
                  <img src={preview} alt="Preview" className="max-h-96 w-full rounded-lg object-contain" />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border border-slate-700 bg-[#0f1115] py-2.5 text-white transition hover:border-orange-500"
                >
                  Change Image
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              onClick={handleProcess}
              disabled={!preview || loading || credits < 1}
              className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold text-[#0f1115] transition hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : credits < 1 ? 'No Credits Available' : 'Remove Background'}
            </button>

            {credits < 5 && (
              <div className="mt-4 rounded-lg bg-orange-500/20 border border-orange-500/50 px-4 py-3 text-sm text-orange-200">
                Running low on credits. Upgrade your plan to get more.
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="rounded-3xl border border-slate-800 bg-[#12151c] p-8">
            <h2 className="mb-6 text-2xl font-semibold">Result</h2>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#0f1115] p-4">
                  <img src={result.processedUrl} alt="Result" className="max-h-96 w-full rounded-lg object-contain" />
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleDownload}
                    className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-500"
                  >
                    ⬇️ Download PNG
                  </button>
                  <button
                    onClick={() => {
                      setPreview(null);
                      setResult(null);
                      setFile(null);
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-[#0f1115] py-3 font-semibold text-white transition hover:border-orange-500"
                  >
                    Process Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 text-center">
                <div>
                  <p className="text-5xl mb-4">✨</p>
                  <p className="text-slate-400">Upload and process an image to see the result</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent History */}
        {history.length > 0 && (
          <div className="mt-12 rounded-3xl border border-slate-800 bg-[#12151c] p-8">
            <h2 className="mb-6 text-2xl font-semibold">Recent Processed Images</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {history.slice(0, 8).map((img) => (
                <a
                  key={img.id}
                  href={img.processedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl border border-slate-700 transition hover:border-orange-500"
                >
                  <img
                    src={img.processedUrl}
                    alt="Processed"
                    className="h-40 w-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <p className="text-sm">View Full</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
