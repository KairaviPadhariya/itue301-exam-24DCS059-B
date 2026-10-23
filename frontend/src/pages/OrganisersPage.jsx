import { useCallback, useEffect, useState } from "react";

const URL = "https://jsonplaceholder.typicode.com/users?_limit=10";

export default function OrganisersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(URL, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (signal && signal.aborted) return;
      setData(json);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(true);
    } finally {
      if (!(signal && signal.aborted)) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  if (loading) return <main><p>Loading organisers…</p></main>;

  if (error) {
    return (
      <main>
        <p className="error">Could not load organisers</p>
        <button className="primary" onClick={() => load()}>Retry</button>
      </main>
    );
  }

  const sorted = [...data].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  return (
    <main>
      <h2>Organisers</h2>
      <p className="sub">{sorted.length} organisers</p>
      <ul className="people">
        {sorted.map((o) => (
          <li key={o.id}><strong>{o.name}</strong> — {o.company.name} ({o.email})</li>
        ))}
      </ul>
    </main>
  );
}
