// /lib/postgres.js
import { neon } from '@neondatabase/serverless'

if (typeof window !== 'undefined') {
  throw new Error('🚫 Database module should never be imported client-side.')
}

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL

if (!connectionString) {
  throw new Error('❌ Missing database connection string.')
}

async function withRetry(fn, retries = 3, delay = 400) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      const msg = err?.message || ''
      const transient =
        msg.includes('Control plane request failed') ||
        msg.includes('Server error') ||
        msg.includes('connection') ||
        msg.includes('timeout')

      if (!transient || attempt === retries) throw err

      console.warn(
        `🔁 Neon transient error (${attempt}/${retries}) – retrying in ${delay}ms`
      )
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

const baseSql = neon(connectionString, {
  fetchOptions: { cache: 'no-store' },
})

function sqlTag(strings, ...values) {
  return withRetry(() => baseSql(strings, ...values))
}

// Preserve transaction support from Neon client
sqlTag.transaction = (...args) => baseSql.transaction(...args)

export const sql = sqlTag

export const pool = {
  query: async (text, params = []) => {
    if (typeof text !== 'string') {
      throw new Error('pool.query() expects SQL text')
    }

    const queryText =
      params.length > 0
        ? params.reduce(
            (acc, p, i) => acc.replace(`$${i + 1}`, `'${p}'`),
            text
          )
        : text

    const rows = await sql([queryText])
    return { rows }
  },
}

if (process.env.NODE_ENV !== 'production') {
  console.log(
    `🟢 Connected to Neon (${
      connectionString.includes('pooler') ? 'pooled ⚙️' : 'unpooled 🌐'
    }) with automatic retry`
  )
}
