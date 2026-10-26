// Shared helpers for the BC Cafe site: reading menu.txt, the 4-week cycle,
// station info, emoji, and small DOM helpers. Used by index.html and catering.html.

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Brunch", "Lunch", "Dinner"];
const CYCLE_WEEKS = 4;
// Monday that starts Week 1 of the Perkins menu cycle (same as MenuCycle.h)
const CYCLE_START = { year: 2026, month: 10, day: 26 };

// Stations from the Perkins College Dining Hall menu.
// "featured" stations change every day; the rest serve the same thing daily.
const STATIONS = {
  "Laurene's":          { blurb: "Southern comfort classics", emoji: "🍗", featured: true },
  "Root & Vine":        { blurb: "A green kitchen · plant-based", emoji: "🌱", featured: true },
  "Hearth & Ladle":     { blurb: "Soup of the day · Mon–Fri", emoji: "🍲", featured: true },
  "Rise & Shine":       { blurb: "Breakfast basics", emoji: "🥐" },
  "Fresh Off the Grill":{ blurb: "Burgers, dogs & breakfast to order", emoji: "🍔" },
  "Sapori":             { blurb: "Pasta & pizza", emoji: "🍕" },
  "Stix & Bowls":       { blurb: "Asian stir fry", emoji: "🥡" },
  "Stack'd":            { blurb: "Deli sandwiches & wraps", emoji: "🥪" },
  "Crisp":              { blurb: "Salad bar", emoji: "🥗" },
  "Sugar & Spice":      { blurb: "Desserts", emoji: "🍰" },
};
function stationInfo(name) {
  return STATIONS[name] || { blurb: "", emoji: "🍽️" };
}

// ---------- dates & the menu cycle ----------
function dayIndexOf(date) { return (date.getDay() + 6) % 7; } // Monday = 0
function cycleWeekFor(date) {
  const start = Date.UTC(CYCLE_START.year, CYCLE_START.month - 1, CYCLE_START.day);
  const d = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const weeks = Math.floor((d - start) / (7 * 86400000));
  return ((weeks % CYCLE_WEEKS) + CYCLE_WEEKS) % CYCLE_WEEKS + 1;
}

// ---------- menu.txt ----------
// Week|Day|Meal|Station|Name|Calories|Ingredients|Tags
// Week: 1-4 or *;  Day: a day, Daily, Weekdays, Weekends
function parseMenu(text) {
  const items = [];
  const list = (s) => (s || "").split(",").map((x) => x.trim()).filter(Boolean);
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [week, day, meal, station, name, cal, ing, tags] = line.split("|");
    if (!name || !MEALS.includes(meal)) continue;
    const weeks = week === "*" ? [1, 2, 3, 4] : [parseInt(week, 10)].filter((w) => w >= 1 && w <= CYCLE_WEEKS);
    const days = day === "Daily" ? DAYS
      : day === "Weekdays" ? DAYS.slice(0, 5)
      : day === "Weekends" ? DAYS.slice(5)
      : DAYS.includes(day) ? [day] : [];
    const calories = parseInt(cal, 10);
    const base = {
      meal, station, name: name.trim(),
      calories: calories >= 10 && calories <= 1000 ? calories : 0,
      ingredients: list(ing),
      tags: list(tags),
      everyDay: week === "*",
    };
    for (const w of weeks) for (const d of days) items.push({ ...base, week: w, day: d });
  }
  return items;
}

// ---------- emoji ----------
const EMOJI = [
  ["jambalaya", "🥘"], ["casserole", "🥘"], ["strata", "🥘"], ["stir fry", "🥡"], ["lasagna", "🍝"], ["burrito", "🌯"],
  ["taco", "🌮"], ["sandwich", "🥪"], ["philly", "🥖"], ["hot dog", "🌭"], ["pot pie", "🥧"], ["shepherd", "🥧"],
  ["soup", "🍲"], ["stew", "🍲"], ["pho", "🍜"], ["ramen", "🍜"], ["noodle", "🍜"], ["lo mein", "🍜"], ["pad thai", "🍜"],
  ["pancake", "🥞"], ["waffle", "🧇"], ["french toast", "🍞"], ["toast", "🍞"], ["oatmeal", "🥣"], ["cream of wheat", "🥣"],
  ["cereal", "🥣"], ["grits", "🥣"], ["quiche", "🥧"], ["strata", "🥘"], ["frittata", "🍳"], ["omelet", "🍳"], ["egg roll", "🥟"],
  ["egg", "🍳"], ["hash", "🥔"], ["bacon", "🥓"], ["sausage", "🌭"], ["ham", "🍖"], ["biscuit", "🥯"], ["bagel", "🥯"],
  ["muffin", "🧁"], ["danish", "🥐"], ["bread", "🍞"], ["milk", "🥛"], ["fruit", "🍎"], ["spread", "🧈"],
  ["taco", "🌮"], ["burrito", "🌯"], ["enchilada", "🌯"], ["pizza", "🍕"], ["burger", "🍔"], ["hot dog", "🌭"],
  ["philly", "🥖"], ["sandwich", "🥪"], ["wrap", "🥬"], ["salad", "🥗"], ["lasagna", "🍝"], ["spaghetti", "🍝"],
  ["pasta", "🍝"], ["orzo", "🍝"], ["meatball", "🍝"], ["risotto", "🍚"], ["rice", "🍚"], ["bowl", "🥙"], ["curry", "🍛"],
  ["jambalaya", "🥘"], ["casserole", "🥘"], ["shepherd", "🥧"], ["pot pie", "🥧"], ["stir fry", "🥡"], ["fortune", "🥠"],
  ["tilapia", "🐟"], ["fish", "🐟"], ["shrimp", "🍤"], ["wings", "🍗"], ["tenders", "🍗"], ["nuggets", "🍗"], ["chicken", "🍗"],
  ["turkey", "🦃"], ["ribs", "🍖"], ["pork", "🍖"], ["meatloaf", "🍖"], ["steak", "🥩"], ["beef", "🥩"], ["top round", "🥩"],
  ["tofu", "🥢"], ["eggplant", "🍆"], ["portobello", "🍄"], ["mushroom", "🍄"], ["sweet potato", "🍠"], ["yams", "🍠"],
  ["potato", "🥔"], ["fries", "🍟"], ["tots", "🍟"], ["onion ring", "🧅"], ["corn", "🌽"], ["broccoli", "🥦"],
  ["greens", "🥬"], ["cabbage", "🥬"], ["spinach", "🥬"], ["beans", "🫘"], ["peas", "🫛"], ["carrot", "🥕"], ["squash", "🎃"],
  ["roll", "🥖"], ["hushpupp", "🥖"], ["plantain", "🍌"], ["cookie", "🍪"], ["cake", "🍰"], ["pie", "🥧"], ["cobbler", "🥧"],
  ["parfait", "🍨"], ["quinoa", "🥗"], ["couscous", "🥗"], ["hummus", "🫓"], ["vegetable", "🥕"], ["cauliflower", "🥦"],
];
function emojiFor(name, station) {
  const n = name.toLowerCase();
  for (const [key, e] of EMOJI) if (n.includes(key)) return e;
  return stationInfo(station).emoji;
}

// Soft tile colors, picked per item so cards don't all look the same
const TILES = [["#f3ecfb", "#e6d9f6"], ["#fdf3dc", "#f8e4ae"], ["#eef0fb", "#dde1f7"], ["#fbeee8", "#f5d9cc"], ["#eaf5ee", "#d3ebdc"]];
function tileFor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TILES[h % TILES.length];
}
function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ---------- DOM helpers ----------
const $ = (id) => document.getElementById(id);
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) if (c != null && c !== false) node.append(c);
  return node;
}
// Photo if one exists in img/, otherwise the emoji stays visible
function addPhoto(container, name) {
  const img = new Image();
  img.alt = "";
  img.onload = () => container.append(img);
  img.src = `img/${slug(name)}.jpg`;
}
function setupTheme() {
  const btn = $("themeBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("bc-theme", root.dataset.theme); } catch (e) {}
  });
}
