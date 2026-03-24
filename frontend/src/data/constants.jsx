import {
    FaBowlRice,
    FaFish,
    FaEgg,
    FaBowlFood,
    FaCheese,
    FaBurger,
} from "react-icons/fa6";

export const RECIPES = [
    {
        id: 1,
        title: "Saffron Risotto",
        cuisine: "Italian",
        time: "35 min",
        difficulty: "Medium",
        tags: ["Vegetarian", "Gluten-Free"],
        description:
            "Creamy arborio rice slow-cooked with golden saffron threads, finished with a drizzle of white truffle oil and aged parmesan shavings. A luxurious dish that rewards patience with every silky bite.",
        calories: 420,
        emoji: <FaBowlRice />,
        accent: "#F5C842",
        steps: [
            "Toast arborio rice in butter for 2 min",
            "Add warm saffron broth ladle by ladle",
            "Stir constantly for 20 min",
            "Finish with parmesan and truffle oil",
        ],
        ingredients: [
            "300g arborio rice",
            "1L chicken/veg broth",
            "Pinch of saffron",
            "50g parmesan",
            "2 tbsp truffle oil",
            "1 shallot",
            "Butter, salt, pepper",
        ],
    },
    {
        id: 2,
        title: "Miso-Glazed Salmon",
        cuisine: "Japanese",
        time: "20 min",
        difficulty: "Easy",
        tags: ["Dairy-Free", "Gluten-Free"],
        description:
            "Silky salmon fillets marinated in white miso, mirin, and sake, then broiled to caramelised perfection. The glaze turns into a lacquered shell of umami goodness.",
        calories: 380,
        emoji: <FaFish />,
        accent: "#FF8C69",
        steps: [
            "Mix miso, mirin, sake and sugar",
            "Marinate salmon 30 min",
            "Broil 8 min until caramelised",
            "Garnish with sesame & scallion",
        ],
        ingredients: [
            "2 salmon fillets",
            "3 tbsp white miso",
            "2 tbsp mirin",
            "1 tbsp sake",
            "1 tsp sugar",
            "Sesame seeds",
            "Spring onion",
        ],
    },
    {
        id: 3,
        title: "Harissa Shakshuka",
        cuisine: "Mediterranean",
        time: "25 min",
        difficulty: "Easy",
        tags: ["Vegetarian", "Dairy-Free"],
        description:
            "Poached eggs nestled in a fiery harissa-tomato sauce with wilted spinach and crispy chickpeas. Bold, smoky, and deeply satisfying — ready in under 30 minutes.",
        calories: 290,
        emoji: <FaEgg />,
        accent: "#E85D4A",
        steps: [
            "Sauté onion and garlic in olive oil",
            "Add harissa, tomatoes, chickpeas",
            "Simmer 10 min, add spinach",
            "Create wells, crack in eggs, cover 5 min",
        ],
        ingredients: [
            "4 eggs",
            "2 tbsp harissa",
            "400g crushed tomatoes",
            "1 can chickpeas",
            "100g spinach",
            "1 onion",
            "3 garlic cloves",
            "Olive oil",
        ],
    },
    {
        id: 4,
        title: "Green Goddess Pad Thai",
        cuisine: "Thai",
        time: "30 min",
        difficulty: "Medium",
        tags: ["Vegan"],
        description:
            "Rice noodles tossed in an herbaceous green goddess sauce with edamame, snap peas, and toasted sesame. A vibrant twist on a beloved classic.",
        calories: 510,
        emoji: <FaBowlFood />,
        accent: "#4CAF50",
        steps: [
            "Soak rice noodles 20 min",
            "Blend herbs, lime, tahini for sauce",
            "Stir-fry veg in wok",
            "Toss noodles with sauce and veg",
        ],
        ingredients: [
            "200g rice noodles",
            "100g edamame",
            "100g snap peas",
            "Fresh basil & coriander",
            "2 tbsp tahini",
            "Lime juice",
            "Sesame oil",
            "Soy sauce",
        ],
    },
    {
        id: 5,
        title: "Paneer Butter Masala",
        cuisine: "Indian",
        time: "40 min",
        difficulty: "Medium",
        tags: ["Vegetarian", "Gluten-Free"],
        description:
            "Soft paneer cubes bathed in a velvety tomato-butter sauce spiced with garam masala and fenugreek leaves. Serve with warm naan or fragrant basmati.",
        calories: 460,
        emoji: <FaCheese />,
        accent: "#FF9F1C",
        steps: [
            "Brown paneer cubes in butter",
            "Make tomato-cashew base sauce",
            "Blend sauce until smooth",
            "Add paneer, cream, kasuri methi",
        ],
        ingredients: [
            "300g paneer",
            "400g tomatoes",
            "50g cashews",
            "200ml cream",
            "2 tbsp butter",
            "Garam masala",
            "Kasuri methi",
            "Onion, garlic, ginger",
        ],
    },
    {
        id: 6,
        title: "Tacos al Pastor",
        cuisine: "Mexican",
        time: "45 min",
        difficulty: "Hard",
        tags: ["Dairy-Free"],
        description:
            "Smoky achiote-marinated pork shaved thin, served with charred pineapple, cilantro, and salsa verde on warm corn tortillas. Street food perfection.",
        calories: 540,
        emoji: <FaBurger />,
        accent: "#C0392B",
        steps: [
            "Marinate pork in achiote, citrus, chipotle",
            "Grill or pan-sear on high heat",
            "Char pineapple slices",
            "Assemble on warm corn tortillas",
        ],
        ingredients: [
            "500g pork shoulder",
            "2 tbsp achiote paste",
            "Pineapple slices",
            "Corn tortillas",
            "Chipotle in adobo",
            "Cilantro",
            "Lime",
            "White onion",
        ],
    },
];

export const CUISINE_TAGS = [
    { label: "Italian", emoji: "🇮🇹" },
    { label: "Indian", emoji: "🇮🇳" },
    { label: "Chinese", emoji: "🇨🇳" },
    { label: "Mexican", emoji: "🇲🇽" },
    { label: "Japanese", emoji: "🇯🇵" },
    { label: "Thai", emoji: "🇹🇭" },
    { label: "French", emoji: "🇫🇷" },
    { label: "Any", emoji: "🌍" },
];

export const TIME_OPTIONS = [
    { label: "Under 15 min", emoji: "⚡" },
    { label: "15-30 min", emoji: "⏱️" },
    { label: "30-60 min", emoji: "⏳" },
    { label: "Over 1 hr", emoji: "🕰️" },
];

export const CALORIE_OPTIONS = [
    { label: "Under 300 kcal", emoji: "🥗" },
    { label: "300 - 500 kcal", emoji: "🥘" },
    { label: "500 - 800 kcal", emoji: "🍔" },
    { label: "Over 800 kcal", emoji: "🥩" },
];

export const DIET_TAGS = [
    { label: "No restriction", emoji: "🥩" },
    { label: "Vegetarian", emoji: "🌱" },
    { label: "Vegan", emoji: "🌿" },
    { label: "Keto", emoji: "🥑" },
    { label: "Gluten-free", emoji: "🚫🌾" },
];

export const SPICE_LEVELS = [
    { label: "Mild", emoji: "😌" },
    { label: "Medium", emoji: "🌶️" },
    { label: "Spicy", emoji: "🔥" },
    { label: "Extra Hot", emoji: "💀" },
];

export const SERVING_OPTIONS = [
    { label: "1 person", emoji: "👤" },
    { label: "2 people", emoji: "👥" },
    { label: "3-4 people", emoji: "👨‍👩‍👧‍👦" },
    { label: "5+ people", emoji: "🎉" },
];

export const MEAL_TYPES = [
    { label: "Breakfast", emoji: "🍳" },
    { label: "Brunch", emoji: "🥂" },
    { label: "Lunch", emoji: "🍱" },
    { label: "Dinner", emoji: "🍽️" },
    { label: "Fast Food", emoji: "🍟" },
    { label: "Dessert", emoji: "🍰" },
    { label: "Snack", emoji: "🍿" },
];
