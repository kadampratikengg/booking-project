# Copilot Instructions for Booking Project

## Architecture Overview

This is a full-stack ride-booking platform with three separate frontend clients (admin panel, customer app, driver app) and a Node.js/Express backend with real-time capabilities.

**Key Services:**
- **Backend** (`/backend`): Express API with Socket.IO, MongoDB, AWS S3, OpenAI, JWT auth
- **Admin Panel** (`/admin-panel`): React + Vite SPA for operations management
- **Customer App** (`/frontend-customer`): React Native/Expo mobile app with location/maps
- **Driver App** (`/frontend-driver`): React Native/Expo mobile app for accepting/managing rides

**Data Flow**: Clients authenticate via OTP/JWT → call REST API with Bearer tokens → Backend broadcasts events via Socket.IO (ride assignments, status updates)

---

## Project Setup & Development

### Backend
```bash
cd backend
npm install
npm run dev          # Nodemon auto-restart on changes
```
Requires `.env`: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `AWS_*`, `OPENAI_API_KEY`
Server runs on `http://localhost:5000` with 120 req/min rate limit.

### Admin Panel
```bash
cd admin-panel
npm install
npm run dev          # Vite dev server on http://localhost:5173
npm run build        # Production build to dist/
```
Uses `VITE_API_URL` env var (defaults to `http://localhost:5000/api`).

### Customer/Driver Apps
```bash
cd frontend-customer (or frontend-driver)
npm install
npm start            # Expo CLI
```
Requires native build tools (Android SDK, Xcode). Uses `react-native-config` for env vars.

---

## Critical Patterns & Conventions

### Authentication & Authorization

**Three user types**: `customer`, `driver`, `admin` — distinguished by `type` field in JWT payload.

**Auth Flow**:
1. Client sends mobile/email → backend generates OTP (dev: logged to console, TODO: integrate SMS)
2. Client submits mobile + OTP code → `/api/auth/verify-otp` with `role` param
3. Backend returns `access` + `refresh` JWT tokens (stored in localStorage/secure storage)
4. All API requests include `Authorization: Bearer <token>` header
5. Backend validates via `authMiddleware` → loads user from DB (User/Driver/AdminUser model)

**Key files**: `src/middleware/auth.middleware.js`, `src/utils/jwt.js`, `src/controllers/auth.controller.js`

### Data Models

Models follow MongoDB patterns. Key relationships:
- **Ride**: references `customer` (User), `driver` (Driver), has statuses: "requested" → "assigned" → "started" → "completed"
- **User**: customer profiles, wallet balance
- **Driver**: vehicle docs, rating, verified status
- **AdminUser**: admin accounts with `roles` array
- **Invoice**, **Complaint**, **Rates**, **WalletTransaction**: audit/billing

**Field naming**: Uses camelCase (JS convention) but some legacy fields mix snake_case. Standardize to camelCase for new fields.

### Socket.IO Real-Time Communication

**Architecture**: Clients join rooms: `customer-<userId>` or `driver-<userId>`. Server broadcasts ride events:

**Key Events**:
- `join`: Client subscribes to personal room
- `driver-try-accept`: Driver attempts to accept ride; uses atomic DB update to prevent race conditions
- `ride-assigned`: Broadcast to customer when driver accepted
- `ride-accepted`: Broadcast to all when ride assigned

**Lock Pattern**: Ride acceptance is atomic — uses MongoDB's `findOneAndUpdate` to atomically set status from "requested" to "assigned" (prevents multiple drivers accepting same ride).

**Critical**: Always use the DB lock pattern for race-condition-sensitive operations. Socket.IO alone is not sufficient.

### API Validation

Uses **Joi** for request validation. Validators in `src/validators/`:

Example (ride.validator.js):
```javascript
export const rideRequestValidator = Joi.object({
  customerId: Joi.string().hex().length(24).required(),
  pickup: coordinateSchema.required(),
  vehicleType: Joi.string().valid("bike", "auto", "car").required(),
});
```

**Pattern**: Validate in route handlers before controller logic. Throw 400 for invalid input.

### File Upload (S3)

Uses `multer-s3` with AWS SDK. Configuration in `src/config/aws.js`. Typically used for:
- Driver vehicle documents (VehicleDocument model)
- Invoice images (completed ride proof)

**Pattern**: Middleware `multerS3` in `src/middleware/multer.middleware.js` attaches uploaded file metadata to request.

### Rate Limiting & Security

- Global rate limit: 120 requests/min (express-rate-limit middleware)
- JWT tokens: access ~15min, refresh longer
- Passwords: bcryptjs for hashing (admin auth)
- No CSRF protection (stateless API) — rely on CORS + token validation

### External Integrations

**OpenAI**: `src/utils/openai.js` provides `summarizeRideText()` for AI-powered ride summaries. Uses `gpt-4o-mini` model.
- Input: Ride object
- Output: Text summary (max 200 tokens)
- Used in: TBD (search codebase for invocations)

---

## Frontend Patterns

### Admin Panel (React + Vite)

**Structure**: Pages at `src/pages/`, API client at `src/api/api.js`, components reusable in `src/components/`.

**Protected Routes**: `ProtectedRoute.jsx` checks for `adminToken` in localStorage; redirects to login if missing.

**API Client**: Axios instance auto-injects Bearer token:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Styling**: Global CSS in `src/styles/styles.css` + inline component styles.

**Key Pages**:
- Dashboard: overview (TBD specifics)
- Drivers: manage driver accounts/docs
- Complaints: user dispute logs
- Rates: edit pricing by vehicle type
- Login/Register: admin signup

### Customer/Driver Apps (React Native + Expo)

**Stack**: React Native 0.72, Expo 48. Uses `react-native-maps`, `expo-location` for GPS, `socket.io-client` for real-time.

**Storage**: `expo-secure-store` for tokens (replaces localStorage), `react-native-config` for environment variables.

**Navigation**: `@react-navigation/stack` for screen stack.

**Key Screens**:
- LoginScreen: OTP entry
- Customer: MapBookingScreen (destination selection), RideStatusScreen (in-progress tracking), BookingConfirmScreen, HistoryScreen
- Driver: RideRequestsScreen (accept/reject), ActiveRideScreen (pickup/dropoff nav), DocumentsUploadScreen (onboarding), WalletScreen

---

## Important Gotchas & Edge Cases

1. **Admin field confusion**: Admin authentication uses `email` field but passes it in `mobile` parameter of OTP endpoint (line in auth.controller.js). Inconsistent — fix by adding separate admin auth route.

2. **Ride status mismatch**: Ride model defines `["Pending", "Accepted", "Started", "Completed", "Cancelled"]` but socket.js uses lowercase `["requested", "assigned", ...]`. Standardize to one naming scheme (likely lowercase).

3. **OTP is dev-only**: Console logs OTP instead of sending SMS. Before production, integrate Twilio/AWS SNS — see `src/utils/otp.js`.

4. **No refresh token rotation**: Refresh tokens never rotate; implement token rotation on refresh endpoint.

5. **CORS is `*`**: Socket.IO allows all origins. Tighten in production: `cors: { origin: process.env.FRONTEND_URLS }`

6. **Missing input sanitization**: No input sanitization beyond Joi validation. Consider adding mongo-sanitize.

---

## Common Tasks

### Adding a New Admin Page
1. Create page component in `admin-panel/src/pages/NewPage.jsx`
2. Add route in `App.jsx` with `<ProtectedRoute>` wrapper
3. Use `api` client from `src/api/api.js` for backend calls (token auto-injected)
4. Style using CSS classes from `src/styles/styles.css`

### Adding a New Backend Route
1. Create controller in `src/controllers/feature.controller.js`
2. Create route file `src/routes/feature.routes.js` with Express Router
3. Import + mount route in `src/app.js` at `/api/feature`
4. Add Joi validator in `src/validators/feature.validator.js` if needed
5. Use `authMiddleware` to protect endpoints requiring authentication

### Real-Time Event
1. Emit from backend: `io.to('customer-${customerId}').emit('event-name', payload)`
2. Subscribe on client: `socket.on('event-name', (payload) => { ... })`
3. Ensure client joins room first: `socket.emit('join', { type: 'customer', id: userId })`

---

## Testing & Debugging

- **Postman Collection**: `Postman-collection.json` at project root contains API endpoint examples
- **Backend Logs**: Nodemon outputs to terminal; Socket.IO events logged with `console.log`
- **Network Inspection**: Browser DevTools Network tab shows admin panel API calls; React Native uses Flipper
- **Environment Issues**: Check `.env` file exists with required vars (PORT, MONGODB_URI, JWT_SECRET, AWS keys, OPENAI_API_KEY)

---

## References

- **ExpressJS**: http://expressjs.com
- **Socket.IO**: https://socket.io/docs/
- **Mongoose**: https://mongoosejs.com
- **Joi Validation**: https://joi.dev/
- **React Router**: https://reactrouter.com
- **React Native**: https://reactnative.dev
