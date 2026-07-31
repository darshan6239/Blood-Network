# Blood & Platelet Emergency Network

A full-stack scaffold for the EPICS in IEEE project: an AI-powered platform that finds
nearby eligible blood donors, verifies availability, notifies only matching donors, and
tracks emergency requests — with three panels (User/Donor, Distributor/Blood Bank, NGO/Admin).

## Architecture

```
blood-network/
├── backend/              Node.js + Express API
│   ├── server.js
│   ├── routes/
│   │   ├── donors.js         (User panel - register, availability, AI eligibility screen)
│   │   ├── requests.js       (Emergency requests + AI intake + matching)
│   │   ├── ngo.js            (Admin panel - dashboard, AI summary, forecast)
│   │   └── distributor.js    (Distributor panel - inventory)
│   ├── services/
│   │   ├── groqService.js    (Groq API wrapper)
│   │   ├── ollamaService.js  (Local Ollama wrapper)
│   │   ├── aiService.js      (Unified AI logic: intake parsing, screening, summaries, forecast)
│   │   └── matchingService.js (Blood compatibility + distance + reliability ranking)
│   └── data/db.js            (In-memory demo DB - swap for MongoDB/Postgres later)
│
└── frontend/              React + Vite
    └── src/
        ├── pages/
        │   ├── UserPanel.jsx        (Donor registration + raise emergency request)
        │   ├── DistributorPanel.jsx (Inventory + fulfill requests)
        │   └── AdminPanel.jsx       (Dashboard + AI insights)
        └── api.js                  (API client)
```

## Where Each Piece You Asked For Is Used

| Requirement | Where |
|---|---|
| **Groq API** | `backend/services/groqService.js` — used by default for AI intake parsing, eligibility screening, summaries |
| **Ollama** | `backend/services/ollamaService.js` — swap in by setting `AI_PROVIDER=ollama` in `.env` (needs `ollama serve` running locally) |
| **Google Maps API** | `backend/services/mapsService.js` — donor distance calculation. Falls back to straight-line (Haversine) distance if no key is set yet, so the app still runs |
| **NGO Admin Panel** | `frontend/src/pages/AdminPanel.jsx` + `backend/routes/ngo.js` |
| **Distributor Panel** | `frontend/src/pages/DistributorPanel.jsx` + `backend/routes/distributor.js` |
| **User Panel** | `frontend/src/pages/UserPanel.jsx` + `backend/routes/donors.js` + `backend/routes/requests.js` |

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your real GROQ_API_KEY and GOOGLE_MAPS_API_KEY when ready
npm run dev
```
Runs on `http://localhost:5000`. Works immediately with placeholder mock AI responses
and Haversine-distance matching even before you add real API keys.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:3000` and proxies `/api` calls to the backend.

### 3. (Optional) Ollama for local/offline AI
```bash
# Install from https://ollama.com, then:
ollama pull llama3.1
ollama serve
```
Then set `AI_PROVIDER=ollama` in `backend/.env`.

## How Matching Works

1. User submits a request (raw text or structured) → AI parses blood type/urgency/quantity
2. `matchingService.js` filters donors by blood-type compatibility + 90-day eligibility
3. Each candidate donor is scored: `0.6 * distanceScore + 0.4 * reliabilityScore`
4. Only the **top 5** ranked donors are flagged for notification (avoids notifying everyone)
5. Distributor panel shows the request + matched donors; NGO admin panel shows aggregate
   stats, AI-generated plain-language summaries, and a shortage forecast

## Next Steps to Make This Production-Ready

- Replace in-memory `data/db.js` with a real database (MongoDB/PostgreSQL)
- Add authentication (JWT) for the 3 different panel roles
- Add real SMS/push notification delivery (Twilio, Firebase Cloud Messaging)
- Add the Google Maps JavaScript SDK on the frontend for live map visualization
  (package already included: `@react-google-maps/api`)
- Add donor reliability score updates based on actual response history
- Deploy backend (Render/Railway) + frontend (Vercel/Netlify)
