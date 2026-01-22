import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import type { Ping } from '@fullstack/db'

const apiUrl = process.env.API_URL || 'http://localhost:3000'

const fetchPings = createServerFn({ method: 'GET' }).handler(async () => {
  const response = await fetch(`${apiUrl}/pings`)
  if (!response.ok) {
    throw new Error('Failed to fetch pings')
  }
  return response.json() as Promise<Ping[]>
})

const createPing = createServerFn({ method: 'POST' }).handler(async () => {
  const response = await fetch(`${apiUrl}/pings`, { method: 'POST' })
  if (!response.ok) {
    throw new Error('Failed to create ping')
  }
  return response.json() as Promise<Ping>
})

const deletePing = createServerFn({ method: 'POST' })
  .inputValidator((id: number) => id)
  .handler(async ({ data }) => {
    const response = await fetch(`${apiUrl}/pings/${data}`, {
      method: 'DELETE',
    })
    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to delete ping')
    }
    return { success: true }
  })

export const Route = createFileRoute('/ping')({
  loader: async () => {
    const pings = await fetchPings()
    return { pings }
  },
  component: PingPage,
})

function PingPage() {
  const { pings } = Route.useLoaderData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    setIsLoading(true)
    try {
      await createPing()
      await router.invalidate()
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsLoading(true)
    try {
      await deletePing({ data: id })
      await router.invalidate()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md p-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Pings
        </h1>

        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-gray-300">{pings.length} ping(s)</span>
            <button
              onClick={() => {
                void handleCreate()
              }}
              disabled={isLoading}
              className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white transition-colors hover:bg-cyan-700 disabled:opacity-50"
            >
              {isLoading ? '...' : 'Add Ping'}
            </button>
          </div>

          {pings.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No pings yet</p>
          ) : (
            <ul className="space-y-2">
              {pings.map((ping) => (
                <li
                  key={ping.id}
                  className="flex items-center justify-between rounded-lg border border-slate-600 bg-slate-700/50 p-3"
                >
                  <div>
                    <span className="font-mono text-white">#{ping.id}</span>
                    <span className="ml-3 text-sm text-gray-400">
                      {new Date(ping.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      void handleDelete(ping.id)
                    }}
                    disabled={isLoading}
                    className="rounded px-3 py-1 text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 text-center">
          <a href="/" className="text-cyan-400 hover:underline">
            ← Back to Health Check
          </a>
        </div>
      </div>
    </div>
  )
}
