<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered-FF6B35?style=for-the-badge&logo=google&logoColor=white" alt="AI Powered"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Ollama-gpt--oss-000000?style=for-the-badge&logo=ollama&logoColor=white" alt="Ollama"/>
  <img src="https://img.shields.io/badge/Gemini-API-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini API"/>
</p>

# 🍳 Appitat — AI Recipe Recommender

**Appitat** is a full-stack, AI-powered recipe recommendation platform that transforms the ingredients in your kitchen into personalized, creative recipes. Powered by **Ollama (`gpt-oss`)** for recipe generation and **Google Gemini** for vision detection, it offers smart pantry tracking, deep dietary personalization, gamified cooking progress, and a stunning modern UI — all designed to make home cooking effortless and enjoyable.

> _"Tell us what's in your fridge — our AI finds the perfect recipe from your ingredients every single time."_

<p align="center">
  <a href="https://appitat.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-appitat.vercel.app-FF6B35?style=for-the-badge" alt="Live Demo"/>
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

- **Smart Recommendations** — Enter your available ingredients and preferences; the Ollama AI generates 4 distinct, creative recipes with detailed step-by-step instructions.
- **Vision-Based Ingredient Detection** — Upload a photo of your fridge or ingredients, and the Gemini AI identifies them and suggests matching recipes automatically.
- **Deep Personalization** — Recipes adapt to your skill level (beginner → pro), allergy restrictions, disliked ingredients, cuisine preferences, meal type, spice level, and more.

### 🏠 Smart Pantry Management

- Maintain an ongoing pantry inventory that's automatically included when generating recipes.
- Set strict allergy filters and a "Never Show Me" list to exclude unwanted ingredients globally.

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
- **Glassmorphism & Micro-Animations** — Modern design with slide-up animations, AI aura glows, marquee feature sections, and confetti celebrations.
- **Lazy-Loaded Routes** — All pages use React lazy loading with a custom loading spinner for optimal performance.
- **AI Quote Section** — Time-aware motivational cooking quotes on the dashboard.

### 👤 User Account Management

- Full profile customization (display name, email, age, experience level).
- Profile picture & cover image uploads with preview.
- Tabbed account page (Cookbook, Preferences & AI, Badges, History).
- Settings page with unsaved changes detection and discard modal.

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

| Technology                   | Purpose                                     |
| ---------------------------- | ------------------------------------------- |
| **Express 5**                | REST API server                             |
| **MongoDB + Mongoose 9**     | NoSQL database & ODM                        |
| **Ollama SDK**               | Local/cloud AI recipe generation            |
| **Google Generative AI SDK** | Gemini API integration for vision features  |
| **JSON Web Tokens (JWT)**    | Stateless authentication (7-day expiry)     |
| **bcryptjs**                 | Password hashing with salt rounds           |
| **Multer**                   | Multipart file uploads (images)             |
| **CORS**                     | Cross-Origin Resource Sharing configuration |
| **dotenv**                   | Environment variable management             |

### Deployment

| Platform          | Service                            |
| ----------------- | ---------------------------------- |
| **Vercel**        | Frontend hosting with SPA rewrites |
| **Render**        | Backend API hosting                |
| **MongoDB Atlas** | Cloud database                     |

---

## 📁 Project Structure

```
Ai-recipe-recommender/
├── frontend/                          # React + Vite frontend application
│   ├── public/                        # Static assets & redirect rules
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── dashboard/             # Dashboard-specific components
│   │   │   │   ├── IngredientManager.jsx      # Ingredient input & management
│   │   │   │   └── PreferencesSidebar.jsx     # Cuisine, diet, time filters
│   │   │   ├── AccountBadgesCard.jsx          # Badge display grid
│   │   │   ├── AccountPantryCard.jsx          # Pantry management card
│   │   │   ├── AccountPersonalizationCard.jsx # Allergy & preference editor
│   │   │   ├── BackToTopButton.jsx            # Scroll-to-top button
│   │   │   ├── FloatingPaths.jsx              # Background animation paths
│   │   │   ├── Footer.jsx                     # Global footer
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
│   │   ├── aiController.js            # AI recommendation & vision logic
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
- **Ollama** running locally with the `gpt-oss:120b-cloud` model pulled ([Download](https://ollama.com/))
- **Google AI Studio** API key ([Get API Key](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Niveditha-Sury/Ai-recipe-recommender.git
    cd Ai-recipe-recommender
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

# Google Gemini API Key
GOOGLE_API_KEY=your_google_ai_api_key

# JWT Secret Key (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key

# Frontend URL (for CORS)
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
node index.js
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

| Method | Endpoint           | Auth | Description                   |
| ------ | ------------------ | ---- | ----------------------------- |
| `POST` | `/api/auth/signup` | ❌   | Register a new user account   |
| `POST` | `/api/auth/login`  | ❌   | Login and receive a JWT token |

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

| Method | Endpoint                | Auth | Description                                        |
| ------ | ----------------------- | ---- | -------------------------------------------------- |
| `POST` | `/api/ai/recommend`     | ✅   | Generate AI recipes from ingredients & preferences |
| `POST` | `/api/ai/vision-recipe` | ✅   | Identify ingredients from image & generate recipes |
| `POST` | `/api/ai/save`          | ✅   | Save a recipe to the database                      |
| `GET`  | `/api/ai/recipe/:id`    | ✅   | Fetch a specific recipe by ID                      |

#### `POST /api/ai/recommend`

```json
// Request Body
{
  "ingredients": ["chicken", "garlic", "rice"],
  "cuisine": "Italian",
  "cookingTime": "30 min",
  "dietaryType": "None",
  "spiceLevel": "Medium",
  "mealType": "Dinner"
}

// Response (200)
{
  "message": "Smart recipes generated!",
  "recipes": [
    {
      "title": "Garlic Butter Chicken Risotto",
      "emoji": "🍗",
      "description": "A creamy, rich Italian risotto...",
      "cuisine": "Italian",
      "ingredients": ["500g chicken breast", "2 cups arborio rice", ...],
      "steps": ["Season the chicken...", "Heat olive oil...", ...],
      "time": "35 min",
      "calories": 520,
      "difficulty": "Medium",
      "servings": 4,
      "accent": "#E67E22",
      "tags": ["Comfort Food", "Italian", "One Pot"]
    }
  ]
}
```

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

Appitat uses a hybrid AI architecture combining **Ollama** (`gpt-oss:120b-cloud`) for recipe generation and the **Google Gemini API** (`gemini-2.0-flash-lite`) for vision features:

### Recipe Generation Pipeline (Ollama)

1. **Input Aggregation** — Merges user-provided ingredients with their saved pantry items.
2. **Exclusion Filtering** — Combines the user's allergy list and "Never Show Me" list to build exclusion rules.
3. **Prompt Engineering** — Constructs a detailed prompt including cuisine, meal type, cooking time, diet, spice level, and skill level.
4. **Structured Output** — Requests JSON-formatted responses with `format: "json"` for reliable parsing.
5. **Robust Parsing** — Uses brace-counting JSON extraction to handle trailing conversational text from the model.

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
  name:           String (required),
  email:          String (required, unique),
  password:       String (required, hashed),
  profilePic:     String,
  coverPic:       String,
  pantry:         [String],
  allergies:      [String],
  neverShowMe:    [String],
  age:            Number,
  experience:     String (enum: "beginner" | "intermediate" | "advanced" | "pro"),
  xp:             Number (default: 0),
  level:          Number (default: 1),
  cookDays:       Number (default: 0),
  recentlyViewed: [{ recipeId, viewedAt }],
  history:        [{ recipeId, title, emoji, cuisine, xpAwarded, cookedAt }],
  badges:         [{ name, emoji, unlockedAt }],
  savedRecipes:   [Object]
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

### Frontend (Vercel)

1. Import the repository on [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. Set the **Build Command** to `npm run build`.
4. Set the **Output Directory** to `dist`.
5. Add the environment variable:
    ```
    VITE_API_URL=https://your-backend.onrender.com/api
    ```
6. Ensure a `vercel.json` exists for SPA rewrites:
    ```json
    {
        "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```

### Backend (Render)

1. Create a new **Web Service** on [Render](https://render.com).
2. Set the **Root Directory** to `server`.
3. Set the **Build Command** to `npm install`.
4. Set the **Start Command** to `node index.js`.
5. Add all environment variables from the [Environment Variables](#environment-variables) section.
6. Update `FRONTEND_URL` to your Vercel deployment URL.

### Database (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Whitelist `0.0.0.0/0` for connections from Render.
3. Copy the connection string and set it as `MONGO_URI` in the backend `.env`.

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
  Built with ❤️ and AI by <strong>Tauqeer Rahim</strong> & <strong>Niveditha Sury</strong>
</p>
