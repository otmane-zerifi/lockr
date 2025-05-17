import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white">
      <div className="w-full max-w-4xl rounded-lg bg-slate-800 p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">AuthX API</h1>
          <p className="text-lg text-slate-300">A Secure Authentication & Authorization System</p>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">API Endpoints</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-left">
                  <th className="p-3 font-medium text-slate-300">Method</th>
                  <th className="p-3 font-medium text-slate-300">Endpoint</th>
                  <th className="p-3 font-medium text-slate-300">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700">
                  <td className="p-3 font-mono text-sm text-emerald-400">POST</td>
                  <td className="p-3 font-mono text-sm">/auth/register</td>
                  <td className="p-3 text-slate-300">Register a new user</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="p-3 font-mono text-sm text-emerald-400">POST</td>
                  <td className="p-3 font-mono text-sm">/auth/login</td>
                  <td className="p-3 text-slate-300">Login and get a token</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="p-3 font-mono text-sm text-emerald-400">GET</td>
                  <td className="p-3 font-mono text-sm">/auth/me</td>
                  <td className="p-3 text-slate-300">Get current user info</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="p-3 font-mono text-sm text-emerald-400">POST</td>
                  <td className="p-3 font-mono text-sm">/auth/refresh</td>
                  <td className="p-3 text-slate-300">Refresh access token</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="p-3 font-mono text-sm text-emerald-400">POST</td>
                  <td className="p-3 font-mono text-sm">/auth/logout</td>
                  <td className="p-3 text-slate-300">Logout (invalidate token)</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="p-3 font-mono text-sm text-emerald-400">GET</td>
                  <td className="p-3 font-mono text-sm">/admin/dashboard</td>
                  <td className="p-3 text-slate-300">Protected admin route</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Features</h2>
          <ul className="grid gap-2 md:grid-cols-2">
            <li className="flex items-center rounded bg-slate-700 p-3">
              <div className="mr-3 rounded-full bg-emerald-500 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              JWT Authentication
            </li>
            <li className="flex items-center rounded bg-slate-700 p-3">
              <div className="mr-3 rounded-full bg-emerald-500 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              Refresh Tokens
            </li>
            <li className="flex items-center rounded bg-slate-700 p-3">
              <div className="mr-3 rounded-full bg-emerald-500 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              Password Hashing
            </li>
            <li className="flex items-center rounded bg-slate-700 p-3">
              <div className="mr-3 rounded-full bg-emerald-500 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              Role-Based Access
            </li>
            <li className="flex items-center rounded bg-slate-700 p-3">
              <div className="mr-3 rounded-full bg-emerald-500 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              Input Validation
            </li>
            <li className="flex items-center rounded bg-slate-700 p-3">
              <div className="mr-3 rounded-full bg-emerald-500 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              Token Invalidation
            </li>
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/api-docs"
            className="inline-block rounded bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
          >
            View API Documentation
          </Link>
        </div>
      </div>
    </div>
  )
}
