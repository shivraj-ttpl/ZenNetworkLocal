# Cookie & CORS Strategy — ZenNetwork

## The Problem

Backend (NestJS) sets a refresh token as `HttpOnly; SameSite=Strict` cookie. Browser blocks it because:

1. **ngrok/IP testing**: Frontend (`localhost:5173`) and backend (`ngrok` or `192.168.0.x:5000`) are different origins → cross-site → browser rejects `SameSite=Strict` cookies
2. **Production plan**: Frontend and backend will be on different domains → same problem

---

## Root Cause

| Scenario | Frontend | Backend | Same Origin? | Cookie Blocked? |
|---|---|---|---|---|
| Local IP | `localhost:5173` | `192.168.0.144:5000` | No | Yes |
| ngrok | `localhost:5173` | `*.ngrok-free.app` | No | Yes |
| Production | `app.example.com` | `api.example.com` | No (different subdomain) | Depends on config |

`SameSite=Strict` means: cookie is ONLY sent when the request originates from the exact same site. Cross-origin requests (even same parent domain, different subdomain) are blocked.

---

## Solution Options

### Option A: Proxy in Frontend (Development Only)

**How it works:** Vite dev server proxies `/api` requests to the backend. Browser thinks it's talking to `localhost:5173` for everything — same origin, no CORS, no cookie issues.

**Frontend (vite.config.js):**
```js
server: {
  proxy: {
    '/api': {
      target: 'http://192.168.0.144:5000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

**Frontend (.env):**
```
VITE_API_URL="/api/v1"   # Relative URL — goes through proxy
```

| Pros | Cons |
|---|---|
| Zero backend changes | Only works in dev (Vite dev server) |
| No CORS issues at all | Production still needs a real solution |
| Cookies work perfectly | ngrok not needed for local testing |

**Verdict:** Good for development. Does NOT solve production.

---

### Option B: Backend Changes — `SameSite=None; Secure` (Cross-Domain Production)

**When to use:** Frontend and backend are on completely different domains (e.g., `app.zane.com` and `api.zane.com`).

**Backend (NestJS) cookie settings:**
```typescript
response.cookie('refreshToken', token, {
  httpOnly: true,
  secure: true,              // REQUIRED for SameSite=None
  sameSite: 'none',          // Allow cross-origin
  domain: undefined,         // Don't set domain — let browser handle
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

**Backend CORS config (NestJS):**
```typescript
app.enableCors({
  origin: ['https://app.zane.com', 'http://localhost:5173'],
  credentials: true,         // REQUIRED for cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN'],
});
```

**Frontend axios:**
```js
axios.defaults.withCredentials = true;  // Already done
```

| Pros | Cons |
|---|---|
| Works across any domains | Requires HTTPS (Secure flag) |
| Standard approach for SPAs | `SameSite=None` is less restrictive than `Strict` |
| Works in production + dev | Must whitelist frontend origins in CORS |

**Verdict:** Standard production solution for cross-domain SPA + API.

---

### Option C: Same Domain with Subdomain Cookie (Best Security)

**When to use:** You control DNS and can put frontend and backend under the same parent domain.

**Setup:**
```
Frontend: app.zanenetwork.com
Backend:  api.zanenetwork.com
```

**Backend cookie settings:**
```typescript
response.cookie('refreshToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',           // Lax is fine for same-site subdomains
  domain: '.zanenetwork.com', // Shared across subdomains
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

| Pros | Cons |
|---|---|
| `SameSite=Lax` (more secure than None) | Requires same parent domain |
| Cookie shared across subdomains | DNS/infra setup needed |
| Best security posture | |

**Verdict:** Best option if you can use subdomains. Recommended for production.

---

## Recommended Strategy

### Development (Local)

Use **Option A (Vite Proxy)** — already partially set up:

```
Frontend: localhost:5173
Proxy:    /api → http://192.168.0.144:5000/api
.env:     VITE_API_URL="/api/v1"
```

No CORS, no cookie issues, no ngrok needed for local testing.

### Production

Use **Option C (Subdomain)** if possible:

```
Frontend: app.zanenetwork.com
Backend:  api.zanenetwork.com
Cookie:   domain=.zanenetwork.com, SameSite=Lax, Secure, HttpOnly
```

If subdomains are NOT possible (different domains entirely), use **Option B**:

```
Cookie:   SameSite=None, Secure, HttpOnly
CORS:     credentials=true, origin=[frontend-url]
```

---

## Backend Checklist (What to Tell Backend Team)

### For Development
No changes needed if frontend uses Vite proxy. Backend can keep `SameSite=Strict` since proxy makes it same-origin.

### For Production (ask backend to implement)

1. **Cookie settings** — change based on deployment:
   - Same parent domain → `SameSite=Lax; Secure; HttpOnly; Domain=.zanenetwork.com`
   - Different domains → `SameSite=None; Secure; HttpOnly`

2. **CORS config:**
   ```
   origin: [frontend-production-url, 'http://localhost:5173']
   credentials: true
   methods: GET, POST, PUT, PATCH, DELETE
   allowedHeaders: Content-Type, Authorization, X-XSRF-TOKEN
   ```

3. **Environment-based cookie config** (recommended):
   ```typescript
   const isProduction = process.env.NODE_ENV === 'production';
   const cookieOptions = {
     httpOnly: true,
     secure: isProduction,
     sameSite: isProduction ? 'lax' : 'strict',  // or 'none' if cross-domain
     domain: isProduction ? '.zanenetwork.com' : undefined,
     path: '/',
   };
   ```

---

## Frontend Checklist

| Item | Status | Notes |
|---|---|---|
| `axios.defaults.withCredentials = true` | DONE | Already in DataService.js |
| `axios.defaults.xsrfCookieName` | DONE | Ready for backend CSRF cookie |
| Vite proxy config | DONE | In vite.config.js (reads from .env) |
| `.env` for local dev | TODO | Set `VITE_API_URL="/api/v1"` to use proxy |
| Remove localStorage token code | TODO | After backend confirms cookie auth works |

---

## Quick Fix for Right Now

To unblock local development with ngrok immediately:

**Tell backend to temporarily change cookie to:**
```typescript
sameSite: 'none',
secure: true,
```

This allows cross-origin cookies over HTTPS (ngrok provides HTTPS).

**OR** just use the Vite proxy (no backend changes):
```
# .env
VITE_API_URL="/api/v1"
```
Then restart dev server. All requests go through `localhost:5173` proxy → no cross-origin, cookies work with `SameSite=Strict`.
