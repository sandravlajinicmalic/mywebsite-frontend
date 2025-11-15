# 🎰 Wheel of Fortune - Complete Documentation

## 📋 Overview

The Wheel of Fortune is a reward system that allows authenticated users to spin a wheel with 8 different prizes. The system consists of both frontend (React/TypeScript) and backend (Express/TypeScript) components, with rewards that create temporary visual effects on the user's profile and website experience.

---

## 🎨 Frontend Implementation

### 1. **Configuration** (`src/config/wheel.ts`)

The wheel configuration defines all prizes, colors, descriptions, and rendering parameters.

#### **Prizes (8 items):**
- `New Me, Who Dis?` - New avatar icon
- `Fancy Schmancy Nickname` - Fancy styled nickname (cursive, larger font)
- `Chase the Yarn!` - Yarn ball appears on the page
- `Paw-some Cursor` - Cursor becomes a cat paw
- `Royal Meowjesty` - Prefix "Royal Meowjesty" added to nickname
- `Color Catastrophe` - Pink/blue color swap
- `Spin Again, Brave Soul` - Allows immediate re-spin (bypasses cooldown)
- `Total Cat-astrophe` - Nothing (joke prize)

#### **Cooldown:**
- Default: 30 seconds between spins
- Exception: "Spin Again, Brave Soul" bypasses cooldown

#### **Prize Weights:**
The system uses weighted random selection:
- Most prizes: weight 1
- `Paw-some Cursor`: weight 10 (more likely to win)

#### **Wheel Rendering:**
- Size: 500px
- Shape: Irregular "potato shape" using multiple sine/cosine functions
- 8 segments with distinct colors
- Text automatically formats into 1-2 lines based on segment width

### 2. **Hook: `useWheelOfFortune`** (`src/hooks/useWheelOfFortune.ts`)

Custom React hook that manages all wheel state and logic.

#### **State Management:**
- `rotation` - Current wheel rotation (in degrees)
- `isSpinning` - Whether the wheel is currently spinning
- `isModalOpen` - Whether the result modal is open
- `winningItem` - The winning prize
- `canSpin` - Whether the user can spin (cooldown status)
- `cooldownSeconds` - Remaining cooldown time
- `confetti` - Confetti animation pieces

#### **Cooldown Logic:**

**On Mount:**
1. Checks `localStorage` for `WHEEL_LAST_SPIN_TIME`
2. If exists, calculates remaining time
3. If cooldown expired, enables spin
4. If not, sets timer and disables spin

**Periodic Check:**
- Updates every second
- Updates `cooldownSeconds` and `canSpin` state
- When cooldown expires, clears `localStorage`

#### **Spin Function (`spinWheel`):**

**Step 1: Validation**
```typescript
if (isSpinning || !canSpin) return
// Checks if user is authenticated
```

**Step 2: Calculate Rotation**
```typescript
// Random number of full rotations (3-7)
const spins = Math.floor(Math.random() * 5) + 3

// Weighted random prize selection
const winningIndex = getWeightedRandomPrizeIndex()

// Calculate segment center angle
const segmentAngle = 360 / WHEEL_CONFIG.ITEMS.length
const segmentCenterAngle = -90 + (winningIndex * segmentAngle) + (segmentAngle / 2)

// Calculate rotation needed to land on winning segment
const finalRotation = spins * 360 + angleToRotate
```

**Step 3: Animation**
- Sets `rotation` state with `finalRotation`
- CSS transition animates rotation (4 seconds)
- Uses `cubic-bezier(0.17, 0.67, 0.12, 0.99)` for smooth easing

**Step 4: Calculate Actual Result (after 4 seconds)**
```typescript
// Normalize rotation to 0-360
const normalizedRotation = ((totalRotationAfter % 360) + 360) % 360
const positionAtTop = (360 - normalizedRotation) % 360
const adjustedPosition = (positionAtTop - 22.5 + 360) % 360
const actualWinningIndex = Math.round(adjustedPosition / segmentAngle) % WHEEL_CONFIG.ITEMS.length
const actualWinningItem = WHEEL_CONFIG.ITEMS[actualWinningIndex]
```

**Step 5: Send to Backend**
```typescript
const response = await wheelService.spin(actualWinningItem)
```

**Step 6: Handle Response**
- If `response.canSpin === true` (Spin Again prize):
  - Enables immediate re-spin
  - Clears cooldown
- Otherwise:
  - Sets 30-second cooldown
  - Saves time to `localStorage`

**Step 7: Show Modal (after 0.5 seconds)**
- Opens modal with result
- Generates confetti explosion (50 pieces)
- Dispatches `reward-activated` event for rewards requiring visual effects:
  - `New Me, Who Dis?` (avatar change)
  - `Paw-some Cursor` (cursor change)
  - `Color Catastrophe` (color swap)
  - `Chase the Yarn!` (yarn ball)

### 3. **Component: `WheelOfFortuneCat`** (`src/components/organisms/WheelOfFortuneCat.tsx`)

Main component that renders the wheel and handles user interaction.

#### **Wheel Rendering:**
- SVG with 8 irregular segments (potato shape)
- Each segment has a color from `WHEEL_CONFIG.COLORS`
- Text automatically formats into 1-2 lines
- Pointer (finnish.svg) at the top
- Center circle with shadow effect

#### **Button:**
- Disabled while spinning or during cooldown
- Shows remaining cooldown time
- Text changes: "Vrti se..." (spinning), "Sačekaj Xs" (wait), "Zavrti" (spin)

#### **Modal:**
- Displays winning prize name
- Shows prize description
- Confetti explosion animation
- Closes without page refresh (rewards applied via event system)

### 4. **Active Rewards Component** (`src/components/organisms/ActiveRewards.tsx`)

Manages and applies active reward effects.

#### **Reward Types Handled:**
1. **Yarn Ball** (`yarn`)
   - Renders `YarnBall` component when active
   - Automatically hides when expired

2. **Cursor** (`cursor`)
   - Applies custom cursor CSS (`/images/paw.png`)
   - Reverts to default when expired

3. **Color Swap** (`color`)
   - Applies CSS filter to swap pink/blue colors
   - Reverts when expired
   - Optimistic update for instant feedback

#### **Event System:**
- Listens for `reward-activated` custom event
- Optimistically applies color swap immediately
- Fetches rewards from backend after 200ms delay
- Refreshes every 5 seconds to check expiration

#### **Expiration Handling:**
- Sets timers for each active reward
- Automatically removes effects when expired
- Cleans up on component unmount

### 5. **Header Component** (`src/components/molecules/Header.tsx`)

Applies nickname and avatar rewards.

#### **Avatar Reward:**
- Fetches active rewards every 5 seconds
- If `avatar` reward exists, uses new avatar
- When expired, reverts to default avatar
- Listens for `reward-activated` event for immediate update

#### **Nickname Reward:**
- Applies `style: 'cursive'` and `fontSize: '1.5'` if present
- Adds `prefix: 'Royal Meowjesty'` if present
- Reverts to default when expired

### 6. **Service: `wheelService`** (`src/services/wheel.ts`)

API service for wheel operations.

#### **Methods:**
- `spin(reward: string)` - Sends spin result to backend
- `canSpin()` - Checks cooldown status
- `getHistory()` - Gets last 50 spins for user

---

## 🔧 Backend Implementation

### 1. **Route: `/wheel/spin`** (`routes/wheel.ts`)

POST endpoint that saves spin results and activates rewards.

#### **Authentication:**
- Uses `authenticateToken` middleware
- Requires authenticated user

#### **Validation:**
- Checks if `reward` string is present
- Validates user ID

#### **Cooldown Check (`checkCooldown`):**
```typescript
// Get last spin from database
const lastSpin = await supabase
  .from('wheel_spins')
  .select('created_at, reward')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(1)
  .single()

// Skip cooldown if last spin was "Spin Again, Brave Soul"
if (lastSpin.reward === 'Spin Again, Brave Soul') {
  return { canSpin: true, remainingMs: 0 }
}

// Calculate remaining time
const timeDiff = now.getTime() - lastSpinTime.getTime()
const remainingMs = COOLDOWN_MS - timeDiff
```

#### **Save Spin:**
```typescript
await supabase
  .from('wheel_spins')
  .insert([{
    user_id: userId,
    reward: reward
  }])
```

#### **Reward Activation (`createActiveReward`):**

Each reward has a handler that creates an active reward entry:

1. **`New Me, Who Dis?`**:
   - Generates new random avatar
   - Saves original avatar
   - Creates `user_active_rewards` with type `avatar`
   - Duration: 30 seconds

2. **`Fancy Schmancy Nickname`**:
   - Creates reward with `style: 'cursive'`, `fontSize: '1.5'`
   - Type: `nickname`

3. **`Royal Meowjesty`**:
   - Creates reward with `prefix: 'Royal Meowjesty'`
   - Type: `nickname`

4. **`Chase the Yarn!`**:
   - Creates reward with `enabled: true`
   - Type: `yarn`

5. **`Paw-some Cursor`**:
   - Creates reward with `cursor: '/images/paw.png'`
   - Type: `cursor`

6. **`Color Catastrophe`**:
   - Creates reward with `enabled: true`, `swap: 'pink-blue'`
   - Type: `color`

7. **`Spin Again, Brave Soul`**:
   - Only logs, doesn't create reward
   - Allows immediate re-spin

8. **`Total Cat-astrophe`**:
   - Only logs, nothing happens

#### **Response:**
```typescript
{
  success: true,
  spin: newSpin,
  canSpin: canSpinAgain, // true if "Spin Again"
  cooldownSeconds: canSpinAgain ? 0 : 30
}
```

### 2. **Route: `/wheel/history`**

GET endpoint that retrieves spin history.

- Returns last 50 spins for authenticated user
- Sorted by `created_at` (newest first)
- Includes: `id`, `reward`, `created_at`

### 3. **Route: `/wheel/can-spin`**

GET endpoint that checks cooldown status.

- Returns `canSpin` boolean
- Returns `cooldownSeconds` (remaining time)

### 4. **Route: `/user/active-rewards`** (`routes/user.ts`)

GET endpoint that retrieves all active (non-expired) rewards.

- Filters by `expires_at > now()`
- Returns rewards grouped by type
- Includes default avatar calculation for avatar rewards
- Response format:
```typescript
{
  avatar: { value: {...}, expiresAt: "..." },
  nickname: { value: {...}, expiresAt: "..." },
  yarn: { value: {...}, expiresAt: "..." },
  cursor: { value: {...}, expiresAt: "..." },
  color: { value: {...}, expiresAt: "..." }
}
```

---

## 🗄️ Database Schema

### **Table: `wheel_spins`**
```sql
- id (uuid) PRIMARY KEY
- user_id (uuid) NOT NULL REFERENCES users(id) ON DELETE CASCADE
- reward (text) NOT NULL
- created_at (timestamp with time zone) DEFAULT NOW()
```

**Indexes:**
- `idx_wheel_spins_user_id` on `user_id`
- `idx_wheel_spins_created_at` on `created_at DESC`

### **Table: `user_active_rewards`**
```sql
- id (uuid) PRIMARY KEY
- user_id (uuid) NOT NULL REFERENCES users(id) ON DELETE CASCADE
- reward_type (text) NOT NULL -- 'avatar', 'nickname', 'yarn', 'cursor', 'color'
- reward_value (text) NOT NULL -- JSON string with reward data
- expires_at (timestamp with time zone) NOT NULL
- created_at (timestamp with time zone) DEFAULT NOW()
- UNIQUE(user_id, reward_type) -- One reward type per user
```

**Indexes:**
- `idx_user_active_rewards_user_id` on `user_id`
- `idx_user_active_rewards_expires_at` on `expires_at`
- `idx_user_active_rewards_user_type` on `(user_id, reward_type)`

---

## 🔄 Data Flow

```
1. User clicks "Spin" button
   ↓
2. Frontend: Randomly selects prize (weighted) and calculates rotation
   ↓
3. Frontend: Animates wheel (4 seconds)
   ↓
4. Frontend: Calculates actual result based on final rotation
   ↓
5. Frontend: Sends POST /wheel/spin with reward string
   ↓
6. Backend: Checks cooldown (skips if "Spin Again")
   ↓
7. Backend: Saves spin to wheel_spins table
   ↓
8. Backend: Activates reward (creates user_active_rewards entry if needed)
   ↓
9. Backend: Returns response with canSpin and cooldownSeconds
   ↓
10. Frontend: Updates cooldown state and localStorage
    ↓
11. Frontend: Opens modal with result (0.5s delay)
    ↓
12. Frontend: Dispatches 'reward-activated' event for visual effects
    ↓
13. Frontend: ActiveRewards and Header components listen for event
    ↓
14. Frontend: Components fetch active rewards from /user/active-rewards
    ↓
15. Frontend: Components apply visual effects (avatar, cursor, color, yarn, nickname)
    ↓
16. Frontend: Effects automatically expire after 30 seconds
```

---

## ⚙️ Important Notes

### **Cooldown Management:**
- **Frontend**: Uses `localStorage` for quick check and UI updates
- **Backend**: Database is source of truth
- If desync occurs, backend returns error with correct cooldown

### **"Spin Again, Brave Soul" Prize:**
- Bypasses cooldown on backend
- Allows immediate re-spin
- No reward entry created

### **Reward Duration:**
- All rewards last 30 seconds
- Backend sets `expires_at` to `now + 30s`
- Frontend checks every 5 seconds
- Automatic cleanup when expired

### **Optimistic Updates:**
- Color swap applies immediately on frontend
- Other rewards wait for backend confirmation
- Prevents flickering and improves UX

### **Wheel Shape:**
- Uses irregular "potato shape" algorithm
- Multiple sine/cosine functions for natural look
- Text automatically wraps to fit segments

### **Weighted Random Selection:**
- `Paw-some Cursor` has 10x weight (more likely)
- Other prizes have equal weight (1x)
- Ensures variety while favoring certain prizes

---

## 🐛 Potential Issues and Solutions

### **Race Conditions:**
- Backend checks cooldown before saving spin
- If multiple requests arrive simultaneously, only first passes
- Subsequent requests return 429 with cooldown info

### **Frontend/Backend Sync:**
- Frontend uses `localStorage` for optimization
- Backend is authoritative source
- If desync occurs, backend error includes correct cooldown

### **Expired Rewards:**
- Backend filters expired rewards in queries
- Frontend checks `expires_at` before applying
- Automatic cleanup via timers and periodic checks

### **Event System:**
- Custom `reward-activated` event for immediate updates
- Components listen and refetch rewards
- Prevents need for page refresh

---

## 📁 File Structure

### **Frontend:**
```
mywebsite-frontend/
├── src/
│   ├── config/
│   │   └── wheel.ts                    # Wheel configuration and utilities
│   ├── hooks/
│   │   └── useWheelOfFortune.ts        # Main wheel logic hook
│   ├── services/
│   │   └── wheel.ts                    # API service
│   ├── components/
│   │   ├── organisms/
│   │   │   ├── WheelOfFortuneCat.tsx   # Main wheel component
│   │   │   └── ActiveRewards.tsx       # Reward effects component
│   │   └── molecules/
│   │       └── Header.tsx              # Applies avatar/nickname rewards
│   └── constants/
│       └── index.ts                    # Storage keys, API endpoints
```

### **Backend:**
```
mywebsite-backend/
├── routes/
│   ├── wheel.ts                        # Wheel endpoints
│   └── user.ts                         # Active rewards endpoint
├── database/
│   └── schema.sql                      # Database schema
└── utils/
    └── avatar.ts                       # Avatar generation utilities
```

---

## 🎯 API Endpoints

### **POST `/wheel/spin`**
- **Auth**: Required
- **Body**: `{ reward: string }`
- **Response**: `{ success: boolean, spin: WheelSpin, canSpin: boolean, cooldownSeconds: number }`
- **Errors**: 400 (invalid reward), 401 (not authenticated), 429 (cooldown active)

### **GET `/wheel/history`**
- **Auth**: Required
- **Response**: `{ success: boolean, spins: WheelSpin[] }`
- **Returns**: Last 50 spins for user

### **GET `/wheel/can-spin`**
- **Auth**: Required
- **Response**: `{ canSpin: boolean, cooldownSeconds: number }`

### **GET `/user/active-rewards`**
- **Auth**: Required
- **Response**: `{ avatar?: {...}, nickname?: {...}, yarn?: {...}, cursor?: {...}, color?: {...} }`
- **Returns**: All active (non-expired) rewards grouped by type

---

## 🚀 Future Enhancements

Potential improvements:
- Admin panel to view all spins
- Statistics dashboard (most common prizes, user history)
- Longer reward durations for special events
- Additional prize types
- Wheel customization options
- Leaderboard for most spins
- Achievement system based on prizes won

---

## 📝 Changelog

### Current Version
- 8 prizes with weighted random selection
- 30-second cooldown (bypassable with "Spin Again")
- 30-second reward duration
- Visual effects: avatar, nickname, cursor, color swap, yarn ball
- Event-based reward activation
- Optimistic updates for better UX
- Automatic expiration handling

---

*Last updated: 2024*

