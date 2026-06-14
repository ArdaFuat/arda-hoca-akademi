import { useState } from 'react';
import { Code2, Play } from 'lucide-react';
import { CodeEditor } from '../components/CodeBlock';

const defaultCode = `isim = "Arda Hoca Akademi"
print("Merhaba", isim)

for i in range(1, 6):
    print("Sayı:", i)`;

let pyodidePromise = null;

function loadPyodideRuntime() {
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = new Promise((resolve, reject) => {
    if (window.loadPyodide) {
      window.loadPyodide().then(resolve).catch(reject);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
    script.onload = async () => {
      try {
        const pyodide = await window.loadPyodide();
        resolve(pyodide);
      } catch (err) {
        reject(err);
      }
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return pyodidePromise;
}

export default function CodeRunner() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function runCode() {
    setLoading(true);
    setOutput('Python hazırlanıyor...');

    try {
      const pyodide = await loadPyodideRuntime();
      pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);
      await pyodide.runPythonAsync(code);
      const stdout = pyodide.runPython('sys.stdout.getvalue()');
      const stderr = pyodide.runPython('sys.stderr.getvalue()');
      setOutput((stdout || '') + (stderr ? `\nHATA:\n${stderr}` : ''));
    } catch (err) {
      setOutput(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="pill"><Code2 size={16} /> Python Runner</div>
          <h2>Tarayıcı içinde Python çalıştır</h2>
          <p>Bu alan Pyodide kullanır. Kod öğrencinin tarayıcısında çalışır, ayrı server gerekmez.</p>
        </div>
        <button className="primary-button" onClick={runCode} disabled={loading}><Play size={16} /> {loading ? 'Çalışıyor...' : 'Çalıştır'}</button>
      </div>

      <section className="runner-grid">
        <div className="panel editor-panel">
          <h3>Kod</h3>
          <CodeEditor rows={18} value={code} onChange={setCode} title="runner.py" placeholder="Çalıştırmak istediğin Python kodunu yaz..." />
        </div>
        <div className="panel output-panel">
          <h3>Çıktı</h3>
          <pre>{output || 'Çıktı burada görünecek.'}</pre>
        </div>
      </section>
    </div>
  );
}
