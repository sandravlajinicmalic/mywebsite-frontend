# 🚀 Frontend-Backend Povezivanje

Ovaj vodič objašnjava kako je frontend povezan sa backend-om i kako da testiraš funkcionalnost.

## ✅ Šta je urađeno

1. **API Servis** (`src/services/api.ts`)
   - Axios instance sa base URL konfiguracijom
   - Automatsko dodavanje auth tokena u headers
   - Automatsko redirectovanje na login ako token istekne

2. **Auth Servis** (`src/services/auth.ts`)
   - `login()` - Kreira korisnika ili se loguje
   - `verifyToken()` - Proverava validnost tokena
   - `getCurrentUser()` - Vraća trenutnog korisnika
   - `logout()` - Odjavljuje korisnika
   - `isAuthenticated()` - Proverava da li je korisnik ulogovan

3. **Login Stranica** (`src/pages/Login.tsx`)
   - Forma za email i nickname
   - Poziva backend API za kreiranje korisnika
   - Prikazuje greške ako nešto ne uspe
   - Loading state tokom slanja zahteva

4. **Protected Routes** (`src/components/ProtectedRoute.tsx`)
   - Zaštita ruta koje zahtevaju autentifikaciju
   - Automatsko redirectovanje na login ako korisnik nije ulogovan

5. **Header** (`src/components/molecules/Header.tsx`)
   - Prikazuje korisničko ime i avatar
   - Logout dugme

## 🔧 Konfiguracija

### Backend URL

Frontend koristi environment varijablu `VITE_API_URL` za backend URL.

**Default vrednost:** `http://localhost:3000/api`

### Kreiranje .env fajla (opcionalno)

Ako želiš da promeniš backend URL, kreiraj `.env` fajl:

```bash
cd mywebsite-frontend
cp .env.example .env
```

Zatim edituj `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

**Napomena:** Ako backend radi na drugom portu, promeni URL u `.env` fajlu.

## 🧪 Testiranje

### 1. Pokreni Backend

```bash
cd mywebsite-backend
npm run dev
```

Backend treba da radi na `http://localhost:3000`

### 2. Pokreni Frontend

```bash
cd mywebsite-frontend
npm run dev
```

Frontend treba da radi na `http://localhost:5173` (ili drugom portu koji Vite koristi)

### 3. Testiraj Kreiranje Korisnika

1. Otvori browser i idi na `http://localhost:5173`
2. Trebalo bi da vidiš Login stranicu
3. Unesi:
   - **Nickname:** TestUser
   - **Email:** test@example.com
4. Klikni **Next**
5. Trebalo bi da te prebaci na Home stranicu
6. U header-u trebalo bi da vidiš tvoj nickname i avatar

### 4. Testiraj Logout

1. Klikni na logout dugme (ikonica izlaza) u header-u
2. Trebalo bi da te prebaci na Login stranicu
3. Token i korisnički podaci su obrisani iz localStorage

### 5. Testiraj Zaštitu Ruta

1. Bez logovanja, pokušaj da direktno otvoriš `http://localhost:5173/home`
2. Trebalo bi da te automatski prebaci na Login stranicu

## 📁 Struktura Fajlova

```
mywebsite-frontend/
├── src/
│   ├── services/
│   │   ├── api.ts          # Axios instance i interceptors
│   │   ├── auth.ts         # Auth service funkcije
│   │   └── index.ts        # Export svih servisa
│   ├── components/
│   │   └── ProtectedRoute.tsx  # Zaštita ruta
│   ├── pages/
│   │   └── Login.tsx       # Login stranica sa API pozivom
│   ├── constants/
│   │   └── index.ts        # API_URL i STORAGE_KEYS
│   └── App.tsx             # Router sa zaštitom ruta
└── .env.example            # Template za environment varijable
```

## 🔍 Debugging

### Proveri da li backend radi

```bash
curl http://localhost:3000/health
```

Trebalo bi da vidiš: `{"status":"ok","message":"Server is running"}`

### Proveri localStorage

U browser DevTools (F12) → Application → Local Storage:
- `auth_token` - JWT token
- `user` - Korisnički podaci (JSON)

### Proveri Network zahteve

U browser DevTools → Network tab:
- Trebalo bi da vidiš POST zahtev na `/api/auth/login`
- Response treba da ima `success: true`, `user` i `token`

### Česte greške

**"Network Error" ili "CORS Error"**
- Proveri da li backend radi
- Proveri da li je `FRONTEND_URL` u backend `.env` fajlu postavljen na `http://localhost:5173`

**"Missing Supabase environment variables"**
- Proveri backend `.env` fajl
- Proveri da li su `SUPABASE_URL` i `SUPABASE_ANON_KEY` postavljeni

**"relation does not exist"**
- Proveri da li su tabele kreirane u Supabase
- Izvrši SQL iz `database/schema.sql` u Supabase SQL Editor-u

## 🎯 Sledeći Koraci

- [ ] Dodati refresh token funkcionalnost
- [ ] Dodati email validaciju
- [ ] Dodati password zahtev (ako želiš)
- [ ] Dodati "Zapamti me" opciju
- [ ] Dodati error boundary za bolje error handling

