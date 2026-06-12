import { useRouter } from "next/router";
import { useState } from "react";
import { SiteShell } from "../../../components/SiteShell";
import { ENABLE_VERIFIER_WORKSPACE } from "../../../lib/env";

export default function TaskReviewPage() {
  const router = useRouter();
  const { task_id } = router.query;

  const [verdict, setVerdict] = useState("supports");
  const [notes, setNotes] = useState("");
  const [actorId, setActorId] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!ENABLE_VERIFIER_WORKSPACE) {
    return (
      <SiteShell title="Internal Reviewer Workspace | Records Watch" path={task_id ? `/verify/task/${task_id}` : "/verify"}>
        <main className="content-page">
          <a className="back-link" href="/verify">Back to verification desk</a>
          <h1>Internal reviewer workspace</h1>
          <p className="lede">
            Review submission is disabled in public builds. Enable it only in an authenticated internal deployment.
          </p>
        </main>
      </SiteShell>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const r = await fetch(`/v1/tasks/${task_id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actor_id: actorId,
          verdict,
          notes,
          evidence_edges: []
        })
      });

      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.message ?? `HTTP ${r.status}`);
      }

      setResult("Review submitted successfully.");
    } catch (err: any) {
      setError(String(err?.message ?? err));
    }
  }

  return (
    <SiteShell title="Review Task | Records Watch" path={task_id ? `/verify/task/${task_id}` : "/verify"}>
      <main className="content-page">
        <a className="back-link" href="/verify">Back to queue</a>
        <h1>Review task</h1>
        <p>Task ID: <code>{task_id}</code></p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Actor ID</span>
            <input className="input" type="text" value={actorId} onChange={(e) => setActorId(e.target.value)} required />
          </label>

          <label className="field">
            <span>Verdict</span>
            <select className="input" value={verdict} onChange={(e) => setVerdict(e.target.value)}>
              <option value="supports">Supports</option>
              <option value="contradicts">Contradicts</option>
              <option value="context_only">Context Only</option>
              <option value="cannot_determine">Cannot Determine</option>
            </select>
          </label>

          <label className="field">
            <span>Notes</span>
            <textarea className="input" value={notes} onChange={(e) => setNotes(e.target.value)} required rows={4} />
          </label>

          <button className="button button--solid" type="submit">Submit review</button>
        </form>

        {result && <p className="status-pill">{result}</p>}
        {error && <p className="error-state">Error: {error}</p>}
      </main>
    </SiteShell>
  );
}
