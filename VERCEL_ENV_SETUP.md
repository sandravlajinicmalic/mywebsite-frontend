# Vercel Environment Variables Setup

## Environment Variables za Frontend

U Vercel Dashboard-u, dodaj sledeće environment variables:

### 1. API URL (za REST API pozive)
```
Name: VITE_API_URL
Value: https://mywebsite-backend.onrender.com/api
```

### 2. Socket URL (za WebSocket konekcije)
```
Name: VITE_SOCKET_URL
Value: https://mywebsite-backend.onrender.com
```

## Kako da dodaš u Vercel:

1. Idi na [Vercel Dashboard](https://vercel.com/dashboard)
2. Izaberi svoj projekat
3. Idi na **Settings** → **Environment Variables**
4. Klikni **"Add New"**
5. Dodaj obe varijable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://tvoj-render-backend-url.onrender.com/api`
   - **Environment**: Production, Preview, Development (ili samo Production)
6. Klikni **"Save"**
7. Ponovi za `VITE_SOCKET_URL` (bez `/api` na kraju)

## Važno:

⚠️ **Zameni URL**: Zameni `mywebsite-backend.onrender.com` sa stvarnim Render URL-om kada dobiješ backend URL.

⚠️ **Redeploy**: Nakon dodavanja environment variables, moraš da redeploy-uješ projekat:
   - Idi na **Deployments** tab
   - Klikni na tri tačke (⋯) pored najnovijeg deployment-a
   - Izaberi **"Redeploy"**

⚠️ **Format URL-a**:
   - `VITE_API_URL` mora imati `/api` na kraju (npr. `https://backend.onrender.com/api`)
   - `VITE_SOCKET_URL` ne sme imati `/api` (npr. `https://backend.onrender.com`)

## Provera:

Nakon redeploy-a, proveri u browser konzoli da li su environment variables ispravno učitane:
```javascript
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_SOCKET_URL)
```

## Za Development (lokalno):

Kreiraj `.env` fajl u `mywebsite-frontend` folderu:
```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

**Napomena**: `.env` fajl ne treba da se commit-uje u git (već je u `.gitignore`).

