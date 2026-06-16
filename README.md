<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered-FF6B35?style=for-the-badge&logo=google&logoColor=white" alt="AI Powered"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Groq-AI-F55036?style=for-the-badge&logo=groq&logoColor=white" alt="Groq AI"/>
  <img src="https://img.shields.io/badge/Gemini-API-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini API"/>
</p>

# 🍳 Appitat — AI Recipe Recommender

**Appitat** is a full-stack, AI-powered recipe recommendation platform that transforms the ingredients in your kitchen into personalized, creative recipes. Powered by **Groq AI** (`llama-3.3-70b-versatile`) for lightning-fast recipe generation and **Google Gemini** for vision-based ingredient detection, it offers smart pantry tracking, deep dietary personalization, gamified cooking progress, and a stunning modern UI — all designed to make home cooking effortless and enjoyable.

> _"Tell us what's in your fridge — our AI finds the perfect recipe from your ingredients every single time."_

<p align="center">
  <a href="https://appitat-frontend.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-appitat--frontend.onrender.com-FF6B35?style=for-the-badge" alt="Live Demo"/>
  </a>
</p>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Getting Started](#️-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running Locally](#running-locally)
- [🔌 API Reference](#-api-reference)
    - [Authentication](#authentication-endpoints)
    - [AI Recipes](#ai-recipe-endpoints)
    - [User Management](#user-management-endpoints)
- [🧠 AI Integration](#-ai-integration)
- [🎮 Gamification System](#-gamification-system)
- [📄 Database Models](#-database-models)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

### 🤖 AI-Powered Recipe Generation

- **Streaming Smart Recommendations** — Enter your available ingredients and preferences; the Groq AI generates 4 distinct, creative recipes delivered one-at-a-time via **Server-Sent Events (SSE)** — each card appears instantly as it finishes, with no waiting for the full batch.
- **Vision-Based Ingredient Detection** — Upload a photo of your fridge or ingredients, and the Gemini AI identifies them and suggests matching recipes automatically.
- **Deep Personalization** — Recipes adapt to your skill level (beginner → pro), allergy restrictions, disliked ingredients, cuisine preferences, meal type, spice level, calorie targets, serving size, and more.
- **Chef's Tip per Recipe** — Every AI-generated recipe now includes a practical, dish-specific chef's tip (technique, substitution, or timing trick).

### 🔍 Advanced Filtering

- **Calorie Range Slider** — A smooth dual-handle range slider (0–2000+ kcal) lets you set a precise minimum and maximum calorie target. This constraint is enforced as a hard requirement in the AI prompt.
- **Servings Filter** — Select a target number of servings; the AI designs portion sizes accordingly.
- **Meal Type, Cuisine, Diet, Time & Spice** — Comprehensive filter set covering all major preferences.
- **Mobile Bottom Sheet** — On mobile, all filters open in an animated bottom-sheet panel with smooth enter/exit transitions and a swipe-to-dismiss handle. A badge on the filter button shows the count of active filters.

### 🏠 Smart Pantry Management

- Maintain an ongoing pantry inventory that's automatically merged with your entered ingredients when generating recipes.
- Set strict allergy filters and a "Never Show Me" list to exclude unwanted ingredients globally across all AI requests.

### 🎮 Gamification & Progression

- **XP System** — Earn XP for generating recipes (+50 XP), saving recipes (+50 XP), and using vision features (+30 XP).
- **Leveling** — Level up every 500 XP, progressing from Novice Cook to Master Chef.
- **20 Achievement Badges** — Unlock badges across two categories:
    - _XP Milestones_ (Kitchen Novice → Appitat Legend)
    - _Cooking Consistency_ (First Flame → 365 Club)
- **Cooking History** — Track your last 20 cooked recipes with timestamps and XP gained.
- **Badge Unlock Notifications** — Real-time toast notifications when you unlock a new badge.

### 📖 Digital Cookbook

- Save/unsave favorite recipes with a single tap.
- Saved recipes sync to the cloud and persist across sessions.
- Dedicated "Saved Recipes" page and Account Cookbook tab for easy access.

### 🎨 Premium UI/UX

- **Dark/Light Theme** — Toggle between themes with smooth transitions.
- **Responsive Design** — Fully optimized for desktop, tablet, and mobile.
- **Mobile Bottom Navigation** — Persistent bottom nav bar on mobile for fast access to Dashboard, Saved, and Account pages.
- **Glassmorphism & Micro-Animations** — Modern design with slide-up animations, AI aura glows, marquee feature sections, and confetti celebrations.
- **Lazy-Loaded Routes** — All pages use React lazy loading with a custom loading spinner for optimal performance.
- **AI Quote Section** — Time-aware motivational cooking quotes on the dashboard.

### 👤 User Account Management

- Full profile customization (display name, email, age, experience level).
- Profile picture & cover image uploads with preview.
- Tabbed account page (Cookbook, Preferences & AI, Badges, History).
- Settings page with unsaved changes detection and discard modal.

### 🔐 Security & Authentication

- **Google OAuth Integration** — Seamless one-tap login and registration using Google accounts.
- **Email Verification** — Mandatory 6-digit OTP verification via Nodemailer for all manual signups to ensure account security.
- **Secure Password Reset** — Forgot password flow with time-limited 6-digit recovery codes.

---

## 🛠️ Tech Stack

### Frontend

| Technology                     | Purpose                                       |
| ------------------------------ | --------------------------------------------- |
| **React 19**                   | UI library with hooks & functional components |
| **Vite 7**                     | Next-gen build tool & dev server              |
| **React Router DOM 7**         | Client-side routing with lazy loading         |
| **Tailwind CSS 4**             | Utility-first CSS framework                   |
| **Framer Motion 12**           | Declarative animations & marquee effects      |
| **Axios**                      | HTTP client with interceptors for auth        |
| **Lucide React & React Icons** | Modern icon libraries                         |
| **Canvas Confetti**            | Celebration effects on achievements           |

### Backend

| Technology                   | Purpose                                          |
| ---------------------------- | ------------------------------------------------ |
| **Express 5**                | REST API server                                  |
| **MongoDB + Mongoose 9**     | NoSQL database & ODM                             |
| **Groq SDK**                 | Cloud AI recipe generation via SSE streaming     |
| **Google Generative AI SDK** | Gemini API integration for vision features       |
| **JSON Web Tokens (JWT)**    | Stateless authentication (7-day expiry)          |
| **Google Auth Library**      | Secure Google sign-in integration                |
| **Nodemailer**               | Email delivery for OTP and password resets       |
| **bcryptjs**                 | Password hashing with salt rounds                |
| **Multer**                   | Multipart file uploads (images)                  |
| **CORS**                     | Cross-Origin Resource Sharing configuration      |
| **dotenv**                   | Environment variable management                  |

### Deployment

| Platform          | Service                                      |
| ----------------- | -------------------------------------------- |
| **Render**        | Frontend Static Site & Backend Web Service   |
| **MongoDB Atlas** | Cloud database                               |

---

## 📁 Project Structure

```
Appitat/
├── frontend/                          # React + Vite frontend application
│   ├── public/                        # Static assets & redirect rules
│   │   └── _redirects                 # Render SPA rewrite rule
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── dashboard/             # Dashboard-specific components
│   │   │   │   ├── IngredientManager.jsx      # Ingredient input & management
│   │   │   │   └── PreferencesSidebar.jsx     # Filters: cuisine, diet, time, spice,
│   │   │   │                                  # calories (range slider), servings,
│   │   │   │                                  # meal type + mobile bottom sheet
│   │   │   ├── AccountBadgesCard.jsx          # Badge display grid
│   │   │   ├── AccountPantryCard.jsx          # Pantry management card
│   │   │   ├── AccountPersonalizationCard.jsx # Allergy & preference editor
│   │   │   ├── BackToTopButton.jsx            # Scroll-to-top button
│   │   │   ├── FloatingPaths.jsx              # Background animation paths
│   │   │   ├── Footer.jsx                     # Global footer
│   │   │   ├── MobileBottomNav.jsx            # Bottom navigation bar (mobile)
│   │   │   ├── Navbar.jsx                     # Navigation bar with auth state
│   │   │   └── RecipeCard.jsx                 # Recipe card + skeleton loader
│   │   ├── context/
│   │   │   └── AppContext.jsx         # Global React context provider
│   │   ├── data/
│   │   │   ├── badges.js              # Badge definitions & unlock calculator
│   │   │   └── constants.jsx          # Default recipes & app constants
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.js     # Persistent localStorage hook
│   │   │   └── useTheme.js            # Dark/light theme toggle hook
│   │   ├── lib/
│   │   │   ├── api.js                 # Axios instance & API wrappers
│   │   │   └── utils.js               # Shared utility functions
│   │   ├── pages/
│   │   │   ├── AccountPage.jsx        # User profile with tabs
│   │   │   ├── AuthPage.jsx           # Login & Signup forms
│   │   │   ├── DashboardPage.jsx      # Main recipe discovery page
│   │   │   ├── HeroPage.jsx           # Landing/marketing page
│   │   │   ├── NotFoundPage.jsx       # 404 error page
│   │   │   ├── RecipeDetailPage.jsx   # Full recipe view with steps
│   │   │   ├── SavedPage.jsx          # Saved recipes collection
│   │   │   └── SettingsPage.jsx       # Profile editing & image uploads
│   │   ├── App.jsx                    # Root component, routing & global state
│   │   ├── index.css                  # Global styles & design tokens
│   │   └── main.jsx                   # React DOM entry point
│   ├── index.html                     # HTML entry point
│   ├── vite.config.js                 # Vite build configuration
│   └── package.json                   # Frontend dependencies
│
├── server/                            # Express backend API
│   ├── config/
│   │   ├── db.js                      # MongoDB connection setup
│   │   └── gemini.js                  # Gemini AI model configuration
│   ├── controllers/
│   │   ├── aiController.js            # AI recommendation, streaming & vision logic
│   │   ├── authController.js          # Signup & login handlers
│   │   └── userController.js          # Profile, pantry, XP, history handlers
│   ├── middleware/
│   │   └── auth.js                    # JWT authentication middleware
│   ├── models/
│   │   ├── Recipe.js                  # Mongoose recipe schema
│   │   └── User.js                    # Mongoose user schema
│   ├── routes/
│   │   ├── aiRoutes.js                # AI-related API routes
│   │   ├── authRoutes.js              # Authentication routes
│   │   └── userRoutes.js              # User management routes
│   ├── uploads/                       # Uploaded images storage
│   ├── index.js                       # Express server entry point
│   └── package.json                   # Backend dependencies
│
├── .gitignore                         # Git ignore rules
├── package.json                       # Root workspace config
└── README.md                          # This documentation
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ (bundled with Node.js)
- **MongoDB Atlas** account ([Create Free Cluster](https://www.mongodb.com/cloud/atlas))
- **Groq API** key ([Get API Key](https://console.groq.com/))
- **Google AI Studio** API key for vision features ([Get API Key](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/tauqeer-rahim03/Appitat.git
    cd Appitat
    ```

2. **Install backend dependencies:**

    ```bash
    cd server
    npm install
    ```

3. **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Google Gemini API Key (for vision ingredient detection)
GOOGLE_API_KEY=your_google_ai_api_key

# Groq API Key (for recipe generation)
GROQ_API_KEY=your_groq_api_key

# JWT Secret Key (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key

# Google OAuth Client ID
GOOGLE_CLIENT_ID=your_google_client_id

# Email Service (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password

# Frontend URL (for CORS — set to your deployed frontend URL in production)
FRONTEND_URL=http://localhost:5173

# Server Port
PORT=5000
```

Create a `.env` file in the `frontend/` directory (or set this in your hosting environment):

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

### Running Locally

**Start the backend server:**

```bash
cd server
npm start
```

> Server runs on `http://localhost:5000`

**Start the frontend dev server (in a new terminal):**

```bash
cd frontend
npm run dev
```

> Frontend runs on `http://localhost:5173`

---

## 🔌 API Reference

All API endpoints are prefixed with `/api`. Protected routes require a `Bearer <token>` in the `Authorization` header.

### Authentication Endpoints

| Method | Endpoint                    | Auth | Description                            |
| ------ | --------------------------- | ---- | -------------------------------------- |
| `POST` | `/api/auth/signup`          | ❌   | Register a new user account            |
| `POST` | `/api/auth/login`           | ❌   | Login and receive a JWT token          |
| `POST` | `/api/auth/google`          | ❌   | Authenticate via Google OAuth token    |
| `POST` | `/api/auth/verify-email`    | ❌   | Verify email using 6-digit OTP         |
| `POST` | `/api/auth/forgot-password` | ❌   | Send password reset OTP                |
| `POST` | `/api/auth/reset-password`  | ❌   | Reset password using OTP               |

#### `POST /api/auth/signup`

```json
// Request Body
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

// Response (201)
{
  "message": "User created successfully"
}
```

#### `POST /api/auth/login`

```json
// Request Body
{
  "email": "john@example.com",
  "password": "securepassword"
}

// Response (200)
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "xp": 0,
    "level": 1,
    "pantry": [],
    "allergies": []
  }
}
```

---

### AI Recipe Endpoints

| Method | Endpoint                   | Auth | Description                                                |
| ------ | -------------------------- | ---- | ---------------------------------------------------------- |
| `POST` | `/api/ai/recommend`        | ✅   | Generate 4 AI recipes (batch, single response)             |
| `POST` | `/api/ai/recommend-stream` | ✅   | Generate 4 AI recipes one-at-a-time via SSE streaming      |
| `POST` | `/api/ai/vision-recipe`    | ✅   | Identify ingredients from image & generate recipes         |
| `POST` | `/api/ai/save`             | ✅   | Save a recipe to the database                              |
| `GET`  | `/api/ai/recipe/:id`       | ✅   | Fetch a specific recipe by ID                              |

#### `POST /api/ai/recommend-stream` _(Primary endpoint used by the frontend)_

This endpoint uses **Server-Sent Events (SSE)**. The client receives events as each recipe is generated.

```json
// Request Body
{
  "ingredients": ["chicken", "garlic", "rice"],
  "cuisine": "Italian",
  "cookingTime": "30 min",
  "dietaryType": "None",
  "spiceLevel": "Medium",
  "mealType": "Dinner",
  "calories": "400-600",
  "servings": "4"
}
```

**SSE Event Types:**

| Event    | Payload                                      | Description                        |
| -------- | -------------------------------------------- | ---------------------------------- |
| `recipe` | `{ recipe: {...}, index: 0..3 }`             | One complete recipe object         |
| `error`  | `{ index: N, message: "..." }`               | A single recipe failed to generate |
| `done`   | `{ total: 4 }`                               | All recipes have been streamed     |

**Recipe object fields:** `title`, `emoji`, `description`, `tip`, `cuisine`, `ingredients`, `steps`, `time`, `calories`, `difficulty`, `servings`, `accent`, `tags`

#### `POST /api/ai/vision-recipe`

```
Content-Type: multipart/form-data

Fields:
  - image: <file>        (image file upload)
  — OR —
  - imageUrl: <string>   (URL of the image)
```

---

### User Management Endpoints

| Method | Endpoint                  | Auth | Description                                    |
| ------ | ------------------------- | ---- | ---------------------------------------------- |
| `GET`  | `/api/user/profile`       | ✅   | Fetch the authenticated user's full profile    |
| `PUT`  | `/api/user/profile`       | ✅   | Update profile fields (name, email, age, etc.) |
| `PUT`  | `/api/user/pantry`        | ✅   | Update pantry ingredients & allergies          |
| `PUT`  | `/api/user/update-images` | ✅   | Upload profile & cover images                  |
| `GET`  | `/api/user/my-recipes`    | ✅   | Fetch all saved recipes for the user           |
| `POST` | `/api/user/add-xp`        | ✅   | Add XP points (atomic increment)               |
| `POST` | `/api/user/record-cook`   | ✅   | Record a recipe as cooked in history           |
| `POST` | `/api/user/sync-saved`    | ✅   | Sync locally saved recipes to the cloud        |

#### `PUT /api/user/profile`

Whitelisted fields: `name`, `email`, `age`, `experience`, `allergies`, `pantry`, `neverShowMe`, `profilePic`, `coverPic`, `xp`, `level`, `cookDays`

```json
// Request Body
{
  "name": "Jane Doe",
  "age": 28,
  "experience": "intermediate",
  "allergies": ["peanuts", "shellfish"],
  "pantry": ["olive oil", "salt", "pepper", "garlic"]
}

// Response (200)
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

## 🧠 AI Integration

Appitat uses a **hybrid AI architecture** combining **Groq** (`llama-3.3-70b-versatile`) for recipe generation and the **Google Gemini API** (`gemini-2.0-flash-lite`) for vision features:

### Streaming Recipe Generation Pipeline (Groq)

1. **Input Aggregation** — Merges user-provided ingredients with their saved pantry items (deduped).
2. **Exclusion Filtering** — Combines the user's allergy list and "Never Show Me" list into hard exclusion rules.
3. **Prompt Engineering** — Constructs a detailed prompt per recipe, including cuisine, meal type, cooking time, diet, spice level, skill level, calorie range (hard constraint), and serving size.
4. **SSE Streaming** — Generates recipes sequentially (4 independent API calls), sending each finished recipe as an SSE `recipe` event so the UI can render progressively.
5. **Deduplication** — Tracks generated titles across the session; each new prompt instructs the model to avoid already-generated recipes.
6. **Structured Output** — Uses `response_format: { type: "json_object" }` for reliable JSON parsing with no markdown contamination.

### Vision Recognition Pipeline (Gemini)

1. **Image Ingestion** — Accepts either a file upload (via Multer) or a URL reference.
2. **Base64 Encoding** — Converts the image to base64 for the Gemini multimodal API.
3. **Ingredient Identification** — The Gemini AI analyzes the image and returns identified ingredients.
4. **Recipe Generation** — Generates 3 recipes based on the identified ingredients.
5. **Auto-Save** — The primary recipe is automatically saved to the database.

---

## 🎮 Gamification System

### XP Awards

| Action                             | XP Earned |
| ---------------------------------- | --------- |
| Generate AI recipes (Find Recipes) | +50 XP    |
| Save a recipe                      | +50 XP    |
| Use Vision recognition             | +30 XP    |

### Leveling System

- **Formula:** `Level = floor(XP / 500) + 1`
- Every 500 XP triggers a level-up

### Badge Tiers

#### XP Milestones (10 badges)

| Badge           | Threshold  | Emoji |
| --------------- | ---------- | ----- |
| Kitchen Novice  | 100 XP     | 🥚    |
| Apprentice Prep | 500 XP     | 🔪    |
| Taste Tester    | 1,000 XP   | 🥄    |
| Sauce Boss      | 2,500 XP   | 🥫    |
| Flavor Chemist  | 5,000 XP   | 🧪    |
| Sous Chef       | 10,000 XP  | 👨‍🍳    |
| Grill Master    | 15,000 XP  | 🔥    |
| Executive Chef  | 25,000 XP  | 👑    |
| Michelin Star   | 50,000 XP  | ⭐    |
| Appitat Legend  | 100,000 XP | 🏆    |

#### Cooking Consistency (10 badges)

| Badge            | Threshold | Emoji |
| ---------------- | --------- | ----- |
| First Flame      | 1 day     | 🎇    |
| Weekend Warrior  | 3 days    | 🥓    |
| One Week Wonders | 7 days    | 📅    |
| Baker's Dozen    | 13 days   | 🥐    |
| Habit Builder    | 21 days   | 🧱    |
| Monthly Menu     | 30 days   | 📋    |
| Quarter Century  | 50 days   | 🪙    |
| Centurion Chef   | 100 days  | 💯    |
| Half a Year      | 180 days  | 🌞    |
| 365 Club         | 365 days  | 🎉    |

---

## 📄 Database Models

### User Schema

```javascript
{
  name:                   String (required),
  email:                  String (required, unique),
  password:               String (hashed),
  googleId:               String,
  isVerified:             Boolean (default: false),
  verificationCode:       String,
  verificationCodeExpiry: Date,
  resetCode:              String,
  resetCodeExpiry:        Date,
  profilePic:             String,
  coverPic:               String,
  pantry:                 [String],
  allergies:              [String],
  neverShowMe:            [String],
  age:                    Number,
  experience:             String (enum: "beginner" | "intermediate" | "advanced" | "pro"),
  xp:                     Number (default: 0),
  level:                  Number (default: 1),
  cookDays:               Number (default: 0),
  recentlyViewed:         [{ recipeId, viewedAt }],
  history:                [{ recipeId, title, emoji, cuisine, xpAwarded, cookedAt }],
  badges:                 [{ name, emoji, unlockedAt }],
  savedRecipes:           [Object]
}
```

### Recipe Schema

```javascript
{
  userId:                ObjectId (ref: "User", required),
  title:                 String (required),
  description:           String,
  ingredients:           [String] (required),
  steps:                 [String] (required),
  servings:              Number (default: 1),
  calories:              Number,
  time:                  String,
  difficulty:            String,
  cuisine:               String,
  emoji:                 String,
  accent:                String (hex color),
  tags:                  [String],
  recipeImage:           String,
  identifiedIngredients: [String],
  isAIGenerated:         Boolean (default: false),
  createdAt:             Date (default: now)
}
```

---

## 🚀 Deployment

Both the frontend and backend are hosted on **Render**.

### Backend (Render Web Service)

1. Create a new **Web Service** on [Render](https://render.com).
2. Set the **Root Directory** to `server`.
3. Set the **Build Command** to `npm install`.
4. Set the **Start Command** to `npm start`.
5. Add all environment variables from the [Environment Variables](#environment-variables) section.
6. Set `FRONTEND_URL` to your Render frontend URL (e.g. `https://appitat-frontend.onrender.com`).

### Frontend (Render Static Site)

1. Create a new **Static Site** on [Render](https://render.com).
2. Set the **Root Directory** to `frontend`.
3. Set the **Build Command** to `npm install && npm run build`.
4. Set the **Publish Directory** to `dist`.
5. Add the environment variable:
    ```
    VITE_API_URL=https://appitat-backend.onrender.com/api
    ```
6. The `public/_redirects` file handles SPA routing automatically:
    ```
    /*  /index.html  200
    ```

### Database (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Whitelist `0.0.0.0/0` for connections from Render.
3. Copy the connection string and set it as `MONGO_URI` in the backend environment variables.

> **Note on free tier:** Render's free Web Services spin down after 15 minutes of inactivity. The frontend sends a wake-up ping to the backend on first load to minimise cold-start delays.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch:
    ```bash
    git checkout -b feature/amazing-feature
    ```
3. **Commit** your changes:
    ```bash
    git commit -m "feat: add amazing feature"
    ```
4. **Push** to the branch:
    ```bash
    git push origin feature/amazing-feature
    ```
5. **Open** a Pull Request

### Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Formatting (no code change)
- `refactor:` — Code restructuring
- `test:` — Adding tests
- `chore:` — Maintenance tasks

---

## 👥 Contributors

This project was collaboratively built by:

<table>
  <tr>
  <td align="center">
      <a href="https://github.com/tauqeer-rahim03">
        <img src="https://img.shields.io/badge/Tauqeer_Rahim-181717?style=for-the-badge&logo=github&logoColor=white" alt="Tauqeer Rahim"/>
      </a>
      <br />
      <sub><b>Tauqeer Rahim</b></sub>
    </td>
    <td align="center">
      <a href="https://github.com/Niveditha-Sury">
        <img src="https://img.shields.io/badge/Niveditha_Sury-181717?style=for-the-badge&logo=github&logoColor=white" alt="Niveditha Sury"/>
      </a>
      <br />
      <sub><b>Niveditha Sury</b></sub>
    </td>
  </tr>
</table>

---

<p align="center">
  Built with ❤️ and AI by <strong>Tauqeer Rahim</strong> &amp; <strong>Niveditha Sury</strong>
</p>
