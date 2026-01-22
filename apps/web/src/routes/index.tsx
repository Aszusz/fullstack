import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const fetchHealthStatus = createServerFn({ method: 'GET' }).handler(
  async () => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/health`)
    if (!response.ok) {
      throw new Error('Health check failed')
    }
    return response.json() as Promise<{ status: string }>
  }
)

export const Route = createFileRoute('/')({
  loader: async () => {
    const health = await fetchHealthStatus()
    return { health }
  },
  component: App,
})

function App() {
  const { health } = Route.useLoaderData()

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <h1 className="mb-8 text-4xl font-bold text-white">
          TanStack Start + Fastify
        </h1>
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm">
          <h2 className="mb-4 text-xl text-gray-300">API Health Status</h2>
          <div
            className={`text-2xl font-semibold ${health.status === 'ok' ? 'text-green-400' : 'text-red-400'}`}
          >
            {health.status === 'ok' ? '✓ Connected' : '✗ Disconnected'}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Response: {JSON.stringify(health)}
          </p>
        </div>
        <div className="mt-6">
          <a href="/ping" className="text-cyan-400 hover:underline">
            Go to Pings →
          </a>
        </div>
      </div>
    </div>
  )
}
