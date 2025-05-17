import React, { useState } from 'react';

export default function VideoUploader() {
  const [urls, setUrls] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    setLoading(true);
    setError('');
    setResults(null);
    const urlList = urls
      .split('\n')
      .map(u => u.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/process-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: urlList }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results);
      }
    } catch (err) {
      setError('An error occurred while uploading videos.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Video Uploader</h2>
      <textarea
        value={urls}
        onChange={e => setUrls(e.target.value)}
        placeholder="Enter one YouTube or Instagram video URL per line"
        rows={5}
        style={{ width: '100%', marginBottom: 12 }}
      />
      <button onClick={handleUpload} disabled={loading || !urls.trim()}>
        {loading ? 'Uploading...' : 'Upload Videos'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      {results && (
        <div style={{ marginTop: 24 }}>
          <h3>Results:</h3>
          <pre style={{ background: '#f6f6f6', padding: 12, borderRadius: 4 }}>
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}