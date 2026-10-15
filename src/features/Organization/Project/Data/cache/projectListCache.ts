import type Params from '@/base/core/params/params'

export interface ProjectListServiceResponse {
  data: unknown
  statusCode: number
}

type ProjectListCacheEntry = {
  expiresAt: number
  savedAt: number
  response: ProjectListServiceResponse
}

type ProjectListCacheBucket = Record<string, ProjectListCacheEntry>

const STORAGE_KEY = 'hse:project-lists:v1'
const CACHE_TTL_MS = 60 * 60 * 1000
const MAX_CACHE_ENTRIES = 30

const memoryCache = new Map<string, ProjectListCacheEntry>()
const pendingRequests = new Map<string, Promise<ProjectListServiceResponse>>()
let cacheGeneration = 0

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(',')}]`
  }

  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`)
      .join(',')}}`
  }

  return JSON.stringify(value) ?? String(value)
}

function hash(value: string): string {
  let result = 5381
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 33) ^ value.charCodeAt(index)
  }
  return (result >>> 0).toString(36)
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function getAuthScope(): string {
  const storage = getStorage()
  if (!storage) return 'anonymous'

  const user = storage.getItem('user') ?? ''
  const token = storage.getItem('token') ?? ''
  return hash(`${user}|${token}`)
}

function getCacheKey(scope: string, params: Params): string {
  return `${getAuthScope()}:${scope}:${stableSerialize(params.toMap())}`
}

function readBucket(): ProjectListCacheBucket {
  const storage = getStorage()
  if (!storage) return {}

  try {
    const stored = storage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as ProjectListCacheBucket) : {}
  } catch {
    try {
      storage.removeItem(STORAGE_KEY)
    } catch {
      // Storage can be readable but not writable in restricted browser modes.
    }
    return {}
  }
}

function writeBucket(bucket: ProjectListCacheBucket): void {
  const storage = getStorage()
  if (!storage) return

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(bucket))
  } catch {
    // The in-memory cache remains available if browser storage is full or disabled.
  }
}

function pruneBucket(bucket: ProjectListCacheBucket): ProjectListCacheBucket {
  const now = Date.now()
  return Object.fromEntries(
    Object.entries(bucket)
      .filter(([, entry]) => entry.expiresAt > now)
      .sort(([, left], [, right]) => right.savedAt - left.savedAt)
      .slice(0, MAX_CACHE_ENTRIES),
  )
}

function readEntry(key: string): ProjectListServiceResponse | null {
  const now = Date.now()
  const memoryEntry = memoryCache.get(key)

  if (memoryEntry) {
    if (memoryEntry.expiresAt > now) return memoryEntry.response
    memoryCache.delete(key)
  }

  const bucket = readBucket()
  const storedEntry = bucket[key]
  if (!storedEntry) return null

  if (storedEntry.expiresAt <= now) {
    delete bucket[key]
    writeBucket(pruneBucket(bucket))
    return null
  }

  memoryCache.set(key, storedEntry)
  return storedEntry.response
}

function writeEntry(key: string, response: ProjectListServiceResponse): void {
  const now = Date.now()
  const entry: ProjectListCacheEntry = {
    expiresAt: now + CACHE_TTL_MS,
    savedAt: now,
    response,
  }

  memoryCache.set(key, entry)
  writeBucket(pruneBucket({ ...readBucket(), [key]: entry }))
}

function isSuccessful(response: ProjectListServiceResponse): boolean {
  const requestSucceeded = response.statusCode >= 200 && response.statusCode < 300
  const apiSucceeded = (response.data as { status?: boolean } | null)?.status !== false
  return requestSucceeded && apiSucceeded
}

export async function getCachedProjectList(
  scope: string,
  params: Params,
  request: () => Promise<ProjectListServiceResponse>,
): Promise<ProjectListServiceResponse> {
  const key = getCacheKey(scope, params)
  const cachedResponse = readEntry(key)
  if (cachedResponse) return cachedResponse

  const pendingRequest = pendingRequests.get(key)
  if (pendingRequest) return pendingRequest

  const requestGeneration = cacheGeneration
  const nextRequest = request()
    .then((response) => {
      if (requestGeneration === cacheGeneration && isSuccessful(response)) {
        writeEntry(key, response)
      }
      return response
    })
    .finally(() => pendingRequests.delete(key))

  pendingRequests.set(key, nextRequest)
  return nextRequest
}

export function invalidateProjectListCache(): void {
  cacheGeneration += 1
  memoryCache.clear()
  pendingRequests.clear()
  try {
    getStorage()?.removeItem(STORAGE_KEY)
  } catch {
    // The memory cache is still invalidated when browser storage is unavailable.
  }
}

export function invalidateProjectListCacheAfter(
  request: Promise<ProjectListServiceResponse>,
): Promise<ProjectListServiceResponse> {
  return request.then((response) => {
    if (isSuccessful(response)) invalidateProjectListCache()
    return response
  })
}
