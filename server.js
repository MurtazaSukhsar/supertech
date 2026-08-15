/**
 * Custom production server.
 *
 * Why this exists: Hostinger's Node.js hosting was sending the app SIGTERM
 * very frequently (visible in runtime logs as repeated `Ready in 0ms`
 * restarts), and the default shutdown path threw `Error: Server is not
 * running` — Node's net.Server.close() called on a server that was already
 * closed, or hadn't finished starting yet. This wraps Next's own request
 * handler (the same one `next start` uses internally — this does NOT
 * bypass proxy.ts/middleware, routing, or anything else) with an explicit,
 * idempotent shutdown handler so a restart exits cleanly instead of
 * crash-logging.
 *
 * This does not, by itself, explain *why* Hostinger restarts the app so
 * often — that's a separate question for their support (idle-timeout policy
 * vs. a memory/resource limit). This just makes each restart well-behaved.
 */
const { createServer } = require('http')
const next = require('next')

const port = parseInt(process.env.PORT || '3000', 10)
const hostname = process.env.HOSTNAME || '0.0.0.0'
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

let server = null

app.prepare().then(() => {
  server = createServer((req, res) => {
    handle(req, res)
  })

  server.listen(port, hostname, () => {
    console.log(
      `> Server listening at http://${hostname}:${port} as ${dev ? 'development' : process.env.NODE_ENV || 'production'}`,
    )
  })

  server.on('error', (err) => {
    console.error('> Server error:', err)
    process.exit(1)
  })
})

function shutdown(signal) {
  console.log(`> Received ${signal}, shutting down...`)

  // Guard against the exact crash we saw: close() on a server that never
  // started (app.prepare() still pending) or already closed.
  if (!server || !server.listening) {
    process.exit(0)
    return
  }

  server.close((err) => {
    if (err) {
      console.error('> Error during shutdown:', err)
      process.exit(1)
      return
    }
    process.exit(0)
  })

  // Don't hang forever waiting for in-flight requests if Hostinger is
  // restarting us aggressively — exit anyway after a short grace period.
  setTimeout(() => {
    console.warn('> Forced shutdown after timeout')
    process.exit(1)
  }, 10_000).unref()
}

process.once('SIGTERM', () => shutdown('SIGTERM'))
process.once('SIGINT', () => shutdown('SIGINT'))
