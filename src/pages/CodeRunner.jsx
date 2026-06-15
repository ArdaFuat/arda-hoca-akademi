import { useEffect, useState } from 'react';
import { Code2, Play } from 'lucide-react';
import { CodeEditor } from '../components/CodeBlock';
import { runPythonCode } from '../lib/pythonRunner';

const defaultCode = `isim = "Arda Hoca Akademi"
print("Merhaba", isim)

for i in range(1, 6):
    print("Sayı:", i)`;

export default function CodeRunner() {
  const [code, setCode] = useState(defaultCode);

  useEffect(() => {
    const sharedCode = localStorage.getItem('academy_runner_code');
    if (sharedCode) {
      localStorage.removeItem('academy_runner_code');
      setCode(sharedCode);
    }
  }, []);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function runCode() {
    setLoading(true);
    setOutput('Python hazırlanıyor...');

    try {
      const result = await runPythonCode(code);
      setOutput(result || 'Kod çalıştı, çıktı üretmedi.');
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
