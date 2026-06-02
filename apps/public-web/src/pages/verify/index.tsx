import { useEffect, useState } from "react";
import { SiteShell } from "../../components/SiteShell";
import { ENABLE_VERIFIER_WORKSPACE } from "../../lib/env";

type VerificationTask = {
  task_id: string;
  story_id: string;
  claim_id: string;
  task_type: string;
  status: string;
  created_at: string;
};

export default function VerifyQueuePage() {
  const [tasks, setTasks] = useState<VerificationTask[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ENABLE_VERIFIER_WORKSPACE) return;
    fetch("/v1/tasks?status=open")
      .then((r) => r.json())
      .then((data) => setTasks(data.items ?? []))
      .catch((e) => setError(String(e)));
  }, []);

  if (!ENABLE_VERIFIER_WORKSPACE) {
    return (
      <SiteShell title="Verification Desk | The Actual News" path="/verify">
        <main className="content-page">
          <a className="back-link" href="/">Back to public site</a>
          <h1>Verification desk</h1>
          <p className="lede">
            The public site exposes story evidence and correction history. The reviewer queue is an internal
            workspace and is disabled in this public container unless explicitly enabled.
          </p>
          <section className="panel">
            <h2>Public boundary</h2>
            <p>
              Keep reviewer identities, task assignment, evidence ingestion, model gateways, and service credentials
              behind the internal network. Publish only reader-safe ledger data through the public gateway.
            </p>
          </section>
        </main>
      </SiteShell>
    );
  }

  return (
    <SiteShell title="Verification Queue | The Actual News" path="/verify">
      <main className="content-page">
        <h1>Verification queue</h1>
        <p className="lede">Open internal tasks awaiting review.</p>
        {error && <p className="error-state">Error: {error}</p>}
        {tasks.length === 0 && !error && <p className="empty-state">No open tasks.</p>}
        <div className="feed-list">
          {tasks.map((t) => (
            <a className="story-card" href={`/verify/task/${t.task_id}`} key={t.task_id}>
              <span>
                <h3>
                  {t.task_type}: {t.claim_id}
                </h3>
                <span className="story-meta">
                  Story: {t.story_id} - {new Date(t.created_at).toLocaleDateString()}
                </span>
              </span>
              <span className="status-pill status-pill--review">{t.status}</span>
            </a>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
