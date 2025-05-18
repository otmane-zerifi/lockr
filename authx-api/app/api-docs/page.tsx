import Link from "next/link"
import { ArrowLeft, Copy, ChevronDown } from "lucide-react"

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
JWT_REFRESH_EXPIRES_IN=7d
EMAIL_FROM=noreply@yourdomain.com
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
FRONTEND_URL=http://localhost:3000
NODE_ENV=development`}
              </pre>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-lg border border-slate-700 bg-slate-800">
            <div className="flex cursor-pointer items-center justify-between border-b border-slate-700 p-4">
              <h2 className="text-xl font-semibold">Authentication Endpoints</h2>
              <ChevronDown className="h-5 w-5 text-slate-400" />
            </div>
            <div className="p-4">
              <div className="space-y-6">
                <section id="auth-register" className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                  <h3 className="mb-4 text-lg font-semibold">Register a New User</h3>
                  <div className="mb-4 flex items-center rounded bg-slate-700 px-3 py-1 text-sm">
                    <span className="mr-2 font-medium text-emerald-400">POST</span>
                    <span className="font-mono">/auth/register</span>
                  </div>

                  <h4 className="mb-2 font-medium">Request Body</h4>
                  <div className="relative mb-4 rounded bg-slate-900 p-4">
                    <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                    <pre className="text-sm text-slate-300">
                      {`{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecureP@ssw0rd123",
  "role": "user"  // Optional, defaults to "user"
}`}
                    </pre>
                  </div>

                  <h4 className="mb-2 font-medium">Response (201 Created)</h4>
                  <div className="relative rounded bg-slate-900 p-4">
                    <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                    <pre className="text-sm text-slate-300">
                      {`{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isEmailVerified": false
  }
}`}
                    </pre>
                  </div>
                </section>

                <section id="auth-login" className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                  <h3 className="mb-4 text-lg font-semibold">Login</h3>
                  <div className="mb-4 flex items-center rounded bg-slate-700 px-3 py-1 text-sm">
                    <span className="mr-2 font-medium text-emerald-400">POST</span>
                    <span className="font-mono">/auth/login</span>
                  </div>

                  <h4 className="mb-2 font-medium">Request Body</h4>
                  <div className="relative mb-4 rounded bg-slate-900 p-4">
                    <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                    <pre className="text-sm text-slate-300">
                      {`{
  "email": "john@example.com",
  "password": "SecureP@ssw0rd123"
}`}
                    </pre>
                  </div>

                  <h4 className="mb-2 font-medium">Response (200 OK)</h4>
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
    "role": "user",
    "isEmailVerified": true
  },
  "expiresIn": 900 // seconds
}`}
                    </pre>
                  </div>
                </section>

                <section id="auth-refresh" className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                  <h3 className="mb-4 text-lg font-semibold">Refresh Token</h3>
                  <div className="mb-4 flex items-center rounded bg-slate-700 px-3 py-1 text-sm">
                    <span className="mr-2 font-medium text-emerald-400">POST</span>
                    <span className="font-mono">/auth/refresh</span>
                  </div>

                  <h4 className="mb-2 font-medium">Request Body</h4>
                  <div className="relative mb-4 rounded bg-slate-900 p-4">
                    <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                    <pre className="text-sm text-slate-300">
                      {`{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
                    </pre>
                  </div>

                  <h4 className="mb-2 font-medium">Response (200 OK)</h4>
                  <div className="relative rounded bg-slate-900 p-4">
                    <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                    <pre className="text-sm text-slate-300">
                      {`{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // New refresh token (rotation)
  "expiresIn": 900 // seconds
}`}
                    </pre>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800">
            <div className="flex cursor-pointer items-center justify-between border-b border-slate-700 p-4">
              <h2 className="text-xl font-semibold">Password Management</h2>
              <ChevronDown className="h-5 w-5 text-slate-400" />
            </div>
            <div className="p-4">
              <div className="space-y-6">
                <section id="forgot-password" className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                  <h3 className="mb-4 text-lg font-semibold">Forgot Password</h3>
                  <div className="mb-4 flex items-center rounded bg-slate-700 px-3 py-1 text-sm">
                    <span className="mr-2 font-medium text-emerald-400">POST</span>
                    <span className="font-mono">/auth/forgot-password</span>
                  </div>

                  <h4 className="mb-2 font-medium">Request Body</h4>
                  <div className="relative mb-4 rounded bg-slate-900 p-4">
                    <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                    <pre className="text-sm text-slate-300">
                      {`{
  "email": "john@example.com"
}`}
                    </pre>
                  </div>

                  <h4 className="mb-2 font-medium">Response (200 OK)</h4>
                  <div className="relative rounded bg-slate-900 p-4">
                    <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                    <pre className="text-sm text-slate-300">
                      {`{
  "success": true,
  "message": "Password reset email sent"
}`}
                    </pre>
                  </div>
                </section>

                <section id="reset-password" className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                  <h3 className="mb-4 text-lg font-semibold">Reset Password</h3>
                  <div className="mb-4 flex items-center rounded bg-slate-700 px-3 py-1 text-sm">
                    <span className="mr-2 font-medium text-emerald-400">POST</span>
                    <span className="font-mono">/auth/reset-password/:token</span>
                  </div>

                  <h4 className="mb-2 font-medium">Request Body</h4>
                  <div className="relative mb-4 rounded bg-slate-900 p-4">
                    <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                    <pre className="text-sm text-slate-300">
                      {`{
  "password": "NewSecureP@ssw0rd123",
  "passwordConfirm": "NewSecureP@ssw0rd123"
}`}
                    </pre>
                  </div>

                  <h4 className="mb-2 font-medium">Response (200 OK)</h4>
                  <div className="relative rounded bg-slate-900 p-4">
                    <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                    <pre className="text-sm text-slate-300">
                      {`{
  "success": true,
  "message": "Password reset successful"
}`}
                    </pre>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800">
            <div className="flex cursor-pointer items-center justify-between border-b border-slate-700 p-4">
              <h2 className="text-xl font-semibold">Admin Endpoints</h2>
              <ChevronDown className="h-5 w-5 text-slate-400" />
            </div>
            <div className="p-4">
              <div className="space-y-6">
                <section id="admin-dashboard" className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                  <h3 className="mb-4 text-lg font-semibold">Admin Dashboard</h3>
                  <div className="mb-4 flex items-center rounded bg-slate-700 px-3 py-1 text-sm">
                    <span className="mr-2 font-medium text-emerald-400">GET</span>
                    <span className="font-mono">/admin/dashboard</span>
                  </div>

                  <h4 className="mb-2 font-medium">Headers</h4>
                  <div className="relative mb-4 rounded bg-slate-900 p-4">
                    <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                    <pre className="text-sm text-slate-300">
                      {`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                    </pre>
                  </div>

                  <h4 className="mb-2 font-medium">Response (200 OK)</h4>
                  <div className="relative rounded bg-slate-900 p-4">
                    <button className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                    <pre className="text-sm text-slate-300">
                      {`{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 125,
      "users": 120,
      "admins": 5,
      "verifiedUsers": 110,
      "unverifiedUsers": 15,
      "activeUsers": 118,
      "inactiveUsers": 7
    },
    "recentUsers": [
      {
        "id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isEmailVerified": true,
        "createdAt": "2023-05-18T14:10:30.000Z"
      },
      // More users...
    ],
    "loginActivity": {
      "today": 45,
      "week": 320,
      "month": 1250
    }
  }
}`}
                    </pre>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
