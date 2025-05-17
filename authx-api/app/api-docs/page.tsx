import Link from "next/link"
import { ArrowLeft, Copy } from "lucide-react"

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-8">
          <Link href="/" className="mb-6 inline-flex items-center text-slate-300 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">AuthX API Documentation</h1>
          <p className="mt-2 text-slate-300">Complete guide to using the AuthX authentication API</p>
        </div>

        <div className="mb-12 rounded-lg border border-slate-700 bg-slate-800 p-6">
          <h2 className="mb-4 text-xl font-semibold">Getting Started</h2>
          <p className="mb-4">To use this API, you'll need to:</p>
          <ol className="ml-6 list-decimal space-y-2 text-slate-300">
            <li>Clone the repository</li>
            <li>
              Install dependencies with <code className="rounded bg-slate-700 px-2 py-1">npm install</code>
            </li>
            <li>
              Set up your environment variables in a <code className="rounded bg-slate-700 px-2 py-1">.env</code> file
            </li>
            <li>
              Start the server with <code className="rounded bg-slate-700 px-2 py-1">npm start</code>
            </li>
          </ol>

          <div className="mt-6">
            <h3 className="mb-2 font-semibold">Environment Variables</h3>
            <div className="relative rounded bg-slate-900 p-4">
              <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                <Copy className="h-4 w-4" />
              </button>
              <pre className="text-sm text-slate-300">
                {`PORT=5000
MONGODB_URI=mongodb://localhost:27017/authx
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d`}
              </pre>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section id="auth-register" className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Register a New User</h2>
            <div className="mb-4 flex items-center rounded bg-slate-700 px-3 py-1 text-sm">
              <span className="mr-2 font-medium text-emerald-400">POST</span>
              <span className="font-mono">/auth/register</span>
            </div>

            <h3 className="mb-2 font-medium">Request Body</h3>
            <div className="relative mb-4 rounded bg-slate-900 p-4">
              <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                <Copy className="h-4 w-4" />
              </button>
              <pre className="text-sm text-slate-300">
                {`{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"  // Optional, defaults to "user"
}`}
              </pre>
            </div>

            <h3 className="mb-2 font-medium">Response (200 OK)</h3>
            <div className="relative rounded bg-slate-900 p-4">
              <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                <Copy className="h-4 w-4" />
              </button>
              <pre className="text-sm text-slate-300">
                {`{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}`}
              </pre>
            </div>
          </section>

          <section id="auth-login" className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Login</h2>
            <div className="mb-4 flex items-center rounded bg-slate-700 px-3 py-1 text-sm">
              <span className="mr-2 font-medium text-emerald-400">POST</span>
              <span className="font-mono">/auth/login</span>
            </div>

            <h3 className="mb-2 font-medium">Request Body</h3>
            <div className="relative mb-4 rounded bg-slate-900 p-4">
              <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                <Copy className="h-4 w-4" />
              </button>
              <pre className="text-sm text-slate-300">
                {`{
  "email": "john@example.com",
  "password": "securePassword123"
}`}
              </pre>
            </div>

            <h3 className="mb-2 font-medium">Response (200 OK)</h3>
            <div className="relative rounded bg-slate-900 p-4">
              <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                <Copy className="h-4 w-4" />
              </button>
              <pre className="text-sm text-slate-300">
                {`{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}`}
              </pre>
            </div>
          </section>

          <section id="auth-me" className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 text-xl font-semibold">Get Current User</h2>
            <div className="mb-4 flex items-center rounded bg-slate-700 px-3 py-1 text-sm">
              <span className="mr-2 font-medium text-emerald-400">GET</span>
              <span className="font-mono">/auth/me</span>
            </div>

            <h3 className="mb-2 font-medium">Headers</h3>
            <div className="relative mb-4 rounded bg-slate-900 p-4">
              <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                <Copy className="h-4 w-4" />
              </button>
              <pre className="text-sm text-slate-300">
                {`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
              </pre>
            </div>

            <h3 className="mb-2 font-medium">Response (200 OK)</h3>
            <div className="relative rounded bg-slate-900 p-4">
              <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                <Copy className="h-4 w-4" />
              </button>
              <pre className="text-sm text-slate-300">
                {`{
  "success": true,
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}`}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
