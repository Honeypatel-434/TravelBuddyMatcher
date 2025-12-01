# TravelBuddyMatcher

Full-stack travel buddy app (React frontend + Express/Mongo backend).

## Quick overview
- Frontend: React + Tailwind — entry: [frontend/src/index.jsx](frontend/src/index.jsx) and routing in [frontend/src/App.jsx](frontend/src/App.jsx).
- Backend: Express + Mongoose + Socket.IO — entry: [backend/index.js](backend/index.js).

## Repo structure
- backend/
  - controllers/ — API logic (e.g. [`register`](backend/controllers/authController.js), [`getMatches`](backend/controllers/matchController.js))
  - middleware/ — auth: [`authMiddleware`](backend/middleware/authMiddleware.js)
  - models/ — Mongoose models: [backend/models/User.js](backend/models/User.js), [backend/models/Trip.js](backend/models/Trip.js), [backend/models/Message.js](backend/models/Message.js)
  - routes/ — route definitions (see files under [backend/routes](backend/routes))
  - utils/ — helpers: [`getWeatherSmart`](backend/utils/weather.js), [`sendEmail`](backend/utils/mailer.js)
  - index.js — server + Socket.IO handling ([backend/index.js](backend/index.js))
- TravelBuddyMatcher/frontend/ — React app (see [frontend/package.json](frontend/package.json))

## Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB (URI for cloud or local)
- Optional: SMTP credentials for email notifications
- OpenWeather API key (for weather lookups)

## Environment variables
Create a `.env` in `TravelBuddyMatcher/backend/` with:
- MONGO_URI=your_mongo_uri
- JWT_SECRET=your_jwt_secret
- OPENWEATHER_KEY=your_openweather_api_key
- CLIENT_URL=http://localhost:3000
- PORT=5000

(See usage in [backend/utils/weather.js](backend/utils/weather.js)
## Setup & run

Backend
1. cd TravelBuddyMatcher/backend
2. npm install
3. Start dev server:
   - npm run dev (uses nodemon) or
   - npm start

Frontend
1. cd TravelBuddyMatcher/frontend
2. npm install
3. npm start
4. Open http://localhost:3000

Run both servers in separate terminals. Backend defaults to http://localhost:5000 (change via PORT).

## API endpoints

Auth
- POST /api/users/register — register a user  
  Controller: [`register`](backend/controllers/authController.js)
  Body: { name, email, password }

- POST /api/users/login — login  
  Controller: [`login`](backend/controllers/authController.js)
  Body: { email, password }

Protected user
- GET /api/protected/me or /api/protected/profile — get current user (requires `Authorization: Bearer <token>`)  
  Controller: [`getMe`](backend/controllers/userController.js)

- PUT /api/protected/me — update user fields (name, bio, interests, travelStyle, budgetRange)  
  Controller: [`updateMe`](backend/controllers/userController.js)

Trips
- POST /api/trips — create trip (auth required)  
  Controller: [`createTrip`](backend/controllers/tripController.js)  
  Body: { title, destination, startDate, endDate, interests[] }

- GET /api/trips — list trips (auth required)  
  Controller: [`getTrips`](backend/controllers/tripController.js)

- PUT /api/trips/:id — update trip (auth required)  
  Controller: [`updateTrip`](backend/controllers/tripController.js)

- DELETE /api/trips/:id — delete trip (auth required)  
  Controller: [`deleteTrip`](backend/controllers/tripController.js)

Matches
- GET /api/matches?destination=&startDate=&endDate=&interests= — find matching trips (auth required)  
  Controller: [`getMatches`](backend/controllers/matchController.js)

Messages
- GET /api/messages/:roomId — fetch messages for a room (auth required)  
  Controller: [`getRoomMessages`](backend/controllers/messageController.js)

Weather
- GET /api/weather?city=...&country=... OR &lat=...&lon=... — fetch weather  
  Controller: [`getWeather`](backend/controllers/weatherController.js) → uses [`getWeatherSmart`](backend/utils/weather.js)


## Socket.IO (real-time chat)
Server handles:
- "join" — join a room  
- "message" — send message payload { roomId, text, sender }  
Implementation: [backend/index.js](backend/index.js). Messages are persisted via [backend/models/Message.js](backend/models/Message.js) and broadcast to room.

Frontend connects using `socket.io-client` (see [frontend/src/pages/Chat.jsx](frontend/src/pages/Chat.jsx)).

## Useful files
- Server entry: [backend/index.js](backend/index.js)  
- Weather utils: [`getWeatherByCity`](backend/utils/weather.js)  
- Frontend Auth context: [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx)  
- Frontend routes & pages: [frontend/src/App.jsx](frontend/src/App.jsx)

## Development notes
- Auth middleware is in [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js). Ensure JWT_SECRET matches usage in token creation.
- Weather service will throw if OPENWEATHER_KEY is not set.

## Troubleshooting
- CORS: backend sets CORS origin to CLIENT_URL or http://localhost:3000 (see [backend/index.js](backend/index.js)).
- If weather calls fail for certain city names, the frontend tries a country-restricted geocode before a plain lookup (see [frontend/src/pages/Trips.jsx](frontend/src/pages/Trips.jsx) and [frontend/src/pages/DashboardHome.jsx](frontend/src/pages/DashboardHome.jsx)).


For code details see controllers and utils referenced above:
- [backend/controllers/authController.js](backend/controllers/authController.js) — auth
- [backend/controllers/tripController.js](backend/controllers/tripController.js) — trips
- [backend/controllers/matchController.js](backend/controllers/matchController.js) — matches
- [backend/utils/weather.js](backend/utils/weather.js) — weather helpers
- [backend/utils/mailer.js](backend/utils/mailer.js) — email helper
