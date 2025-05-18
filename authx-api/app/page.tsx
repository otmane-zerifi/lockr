import Link from "next/link"
import { Shield, RefreshCw, Lock, UserCheck, AlertTriangle, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      <header className="border-b border-slate-700 bg-slate-800/50 py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">AuthX API</span>
          </div>
          <nav>
            <Link
              href="/api-docs"
              className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-600"
            >
              API Docs
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight">Advanced Authentication & Authorization</h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-300">
              A secure, production-ready authentication system with advanced security features and comprehensive access
              control.
            </p>
          </div>

          <div className="mb-16 overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-xl">
            <div className="border-b border-slate-700 bg-slate-800/80 p-6">
              <h2 className="text-2xl font-bold">API Endpoints</h2>
              <p className="mt-2 text-slate-300">Complete authentication and authorization flow</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-left">
                    <th className="p-4 font-medium text-slate-300">Method</th>
                    <th className="p-4 font-medium text-slate-300">Endpoint</th>
                    <th className="p-4 font-medium text-slate-300">Description</th>
                    <th className="p-4 font-medium text-slate-300">Access</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700">
                    <td className="p-4 font-mono text-sm text-emerald-400">POST</td>
                    <td className="p-4 font-mono text-sm">/auth/register</td>
                    <td className="p-4 text-slate-300">Register a new user</td>
                    <td className="p-4 text-slate-300">Public</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-4 font-mono text-sm text-emerald-400">POST</td>
                    <td className="p-4 font-mono text-sm">/auth/verify-email/:token</td>
                    <td className="p-4 text-slate-300">Verify email address</td>
                    <td className="p-4 text-slate-300">Public</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-4 font-mono text-sm text-emerald-400">POST</td>
                    <td className="p-4 font-mono text-sm">/auth/login</td>
                    <td className="p-4 text-slate-300">Login and get tokens</td>
                    <td className="p-4 text-slate-300">Public</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-4 font-mono text-sm text-emerald-400">GET</td>
                    <td className="p-4 font-mono text-sm">/auth/me</td>
                    <td className="p-4 text-slate-300">Get current user info</td>
                    <td className="p-4 text-slate-300">Protected</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-4 font-mono text-sm text-emerald-400">POST</td>
                    <td className="p-4 font-mono text-sm">/auth/refresh</td>
                    <td className="p-4 text-slate-300">Refresh access token</td>
                    <td className="p-4 text-slate-300">Public</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-4 font-mono text-sm text-emerald-400">POST</td>
                    <td className="p-4 font-mono text-sm">/auth/logout</td>
                    <td className="p-4 text-slate-300">Logout (invalidate token)</td>
                    <td className="p-4 text-slate-300">Protected</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-4 font-mono text-sm text-emerald-400">POST</td>
                    <td className="p-4 font-mono text-sm">/auth/forgot-password</td>
                    <td className="p-4 text-slate-300">Request password reset</td>
                    <td className="p-4 text-slate-300">Public</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-4 font-mono text-sm text-emerald-400">POST</td>
                    <td className="p-4 font-mono text-sm">/auth/reset-password/:token</td>
                    <td className="p-4 text-slate-300">Reset password with token</td>
                    <td className="p-4 text-slate-300">Public</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-4 font-mono text-sm text-emerald-400">PUT</td>
                    <td className="p-4 font-mono text-sm">/auth/update-password</td>
                    <td className="p-4 text-slate-300">Update current password</td>
                    <td className="p-4 text-slate-300">Protected</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-4 font-mono text-sm text-emerald-400">GET</td>
                    <td className="p-4 font-mono text-sm">/admin/dashboard</td>
                    <td className="p-4 text-slate-300">Admin dashboard data</td>
                    <td className="p-4 text-slate-300">Admin</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="p-4 font-mono text-sm text-emerald-400">GET</td>
                    <td className="p-4 font-mono text-sm">/admin/users</td>
                    <td className="p-4 text-slate-300">Get all users</td>
                    <td className="p-4 text-slate-300">Admin</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm text-emerald-400">PUT</td>
                    <td className="p-4 font-mono text-sm">/admin/users/:id</td>
                    <td className="p-4 text-slate-300">Update user (role, status)</td>
                    <td className="p-4 text-slate-300">Admin</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="mb-8 text-3xl font-bold">Advanced Security Features</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg transition hover:border-emerald-500/30 hover:shadow-emerald-500/5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Advanced JWT Security</h3>
                <p className="text-slate-300">
                  Short-lived access tokens with secure refresh token rotation and blacklisting for immediate
                  revocation.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg transition hover:border-emerald-500/30 hover:shadow-emerald-500/5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Rate Limiting</h3>
                <p className="text-slate-300">
                  Protection against brute force attacks with IP-based and user-based rate limiting on sensitive
                  endpoints.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg transition hover:border-emerald-500/30 hover:shadow-emerald-500/5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Password Security</h3>
                <p className="text-slate-300">
                  Strong password policies with zxcvbn strength estimation and account lockout after failed attempts.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg transition hover:border-emerald-500/30 hover:shadow-emerald-500/5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Email Verification</h3>
                <p className="text-slate-300">
                  Secure email verification flow with time-limited tokens and re-verification for email changes.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg transition hover:border-emerald-500/30 hover:shadow-emerald-500/5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">CSRF Protection</h3>
                <p className="text-slate-300">
                  Cross-Site Request Forgery protection with double submit cookie pattern for sensitive operations.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg transition hover:border-emerald-500/30 hover:shadow-emerald-500/5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Granular Permissions</h3>
                <p className="text-slate-300">
                  Fine-grained permission system beyond basic roles for precise access control to resources.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/api-docs"
              className="inline-block rounded-lg bg-emerald-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition hover:bg-emerald-700"
            >
              View API Documentation
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-700 bg-slate-800/50 py-8">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>AuthX API - Advanced Authentication & Authorization System</p>
        </div>
      </footer>
    </div>
  )
}
