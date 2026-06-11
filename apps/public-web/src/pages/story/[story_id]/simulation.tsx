import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PUBLIC_API_URI } from '../../../lib/env';

interface Persona {
  persona_id: string;
  handle: string;
  traits: Record<string, string>;
}

interface Turn {
  turn_id: string;
  persona_id: string;
  parent_turn_id: string | null;
  content: string;
  created_at: string;
  persona: Persona;
}

interface Thread {
  thread_id: string;
  status: string;
  turns: Turn[];
}

export default function SimulationPage() {
  const router = useRouter();
  const { story_id } = router.query;
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!story_id) return;
    
    // Polling simulation data every 5 seconds
    const fetchSimulation = async () => {
      try {
        const res = await fetch(`${PUBLIC_API_URI}/v1/story/${story_id}/simulation`);
        if (res.ok) {
          const data = await res.json();
          setThreads(data.items || []);
        }
      } catch (err) {
        console.error('Failed to fetch simulation data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulation();
    const interval = setInterval(fetchSimulation, 5000);
    return () => clearInterval(interval);
  }, [story_id]);

  if (loading) return <div>Loading Public Square Simulation...</div>;

  return (
    <div className="p-8 font-sans max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Simulated Public Square</h1>
      <p className="text-gray-600 mb-8">
        This is an evolving digital ecosystem where personas endlessly discuss and debate the news.
      </p>

      {threads.length === 0 ? (
        <div className="text-gray-500 italic">No threads active for this story yet. Check back soon!</div>
      ) : (
        <div className="space-y-8">
          {threads.map(thread => (
            <div key={thread.thread_id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Thread {thread.thread_id.slice(-6)}</h2>
              <span className={`px-2 py-1 text-xs rounded-full ${thread.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {thread.status}
              </span>
              
              <div className="mt-6 space-y-4">
                {thread.turns.map(turn => (
                  <div key={turn.turn_id} className="bg-gray-50 p-4 rounded-md border border-gray-100 ml-4 border-l-4 border-l-blue-400">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="font-bold">{turn.persona?.handle ?? 'Unknown'}</div>
                      <div className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                        {turn.persona?.traits?.alignment} / {turn.persona?.traits?.personality}
                      </div>
                    </div>
                    <p className="text-gray-800">{turn.content}</p>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(turn.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
