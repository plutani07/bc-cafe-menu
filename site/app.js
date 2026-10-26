// BC Cafe Menu website.
// Reads menu.txt (same format the C++ program uses):
//   Day|Meal|Name|Calories|ingredient1,ingredient2,...
//
// Photos: drop a picture in site/img/ named after the item, lowercase with
// dashes (e.g. "Turkey Sandwich" -> img/turkey-sandwich.jpg). If there's no
// photo, the card shows a food emoji instead.

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];
const MEAL_ICONS = { All: "🍽️", Breakfast: "🥞", Lunch: "🥪", Dinner: "🍝" };
const MIN_CAL = 10, MAX_CAL = 1000; // same limits as MenuItem::setCalories

// Emoji by keyword (first match wins)
const EMOJI = [
  ["pancake", "🥞"], ["waffle", "🧇"], ["egg", "🍳"], ["oat", "🥣"], ["cereal", "🥣"],
  ["burrito", "🌯"], ["taco", "🌮"], ["pizza", "🍕"], ["burger", "🍔"], ["sandwich", "🥪"],
  ["grilled cheese", "🥪"], ["mac", "🧀"], ["spaghetti", "🍝"], ["pasta", "🍝"],
  ["salad", "🥗"], ["fish", "🐟"], ["shrimp", "🍤"], ["steak", "🥩"], ["wing", "🍗"],
  ["chicken", "🍗"], ["rice", "🍚"], ["soup", "🍲"], ["fries", "🍟"], ["hot dog", "🌭"],
  ["cake", "🍰"], ["cookie", "🍪"], ["fruit", "🍎"],
];
// Soft tile colors, picked per item so cards don't all look the same
const TILES = [
  ["#f3ecfb", "#e6d9f6"], ["#fdf3dc", "#f8e4ae"], ["#eef0fb", "#dde1f7"],
  ["#fbeee8", "#f5d9cc"], ["#eaf5ee", "#d3ebdc"],
];

const todayIndex = new Date().getDay();
const state = { day: todayIndex, meal: "All", week: false };
let items = [];

const $ = (id) => document.getElementById(id);

/* ---------- helpers ---------- */
function parseMenu(text) {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [day, meal, name, cal, ing = ""] = line.split("|");
    const calories = parseInt(cal, 10);
    if (!DAYS.includes(day) || !MEALS.includes(meal) || !name) continue;
    if (!(calories >= MIN_CAL && calories <= MAX_CAL)) continue;
    out.push({
      day, meal, name: name.trim(), calories,
      ingredients: ing.split(",").map((s) => s.trim()).filter(Boolean),
    });
  }
  return out;
}

function emojiFor(name) {
  const n = name.toLowerCase();
  for (const [key, e] of EMOJI) if (n.includes(key)) return e;
  return "🍽️";
}
function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function tileFor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TILES[h % TILES.length];
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) if (c != null) node.append(c);
  return node;
}

// Photo if one exists in img/, otherwise the emoji stays visible
function addPhoto(container, name) {
  const img = new Image();
  img.alt = "";
  img.onload = () => container.append(img);
  img.src = `img/${slug(name)}.jpg`;
}

// Which meal is "up next" right now
function currentMeal() {
  const h = new Date().getHours();
  if (h < 10) return "Breakfast";
  if (h < 15) return "Lunch";
  return "Dinner";
}

/* ---------- top of page ---------- */
function renderHero() {
  const now = new Date();
  $("heroDate").textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  const today = items.filter((i) => i.day === DAYS[todayIndex]);
  const order = MEALS.slice(MEALS.indexOf(currentMeal()));
  let next = null;
  for (const m of order) { next = today.find((i) => i.meal === m); if (next) break; }
  next = next || today[0];

  const tag = $("heroTag");
  if (next) {
    $("heroEmoji").textContent = emojiFor(next.name);
    tag.querySelector(".tag-label").textContent = `${next.meal} today`;
    tag.querySelector(".tag-name").textContent = next.name;

    // Banner shows something different from the hero: today's lightest pick
    const light = today.reduce((a, b) => (b.calories < a.calories ? b : a));
    $("feature").hidden = false;
    $("featureLabel").textContent = `Lightest pick today · ${light.calories} cal`;
    $("featureName").textContent = `${light.name} for ${light.meal.toLowerCase()}`;
    $("featureArt").textContent = emojiFor(light.name);
    $("featureBtn").onclick = () => openSheet(light);
  } else {
    tag.querySelector(".tag-label").textContent = "Today";
    tag.querySelector(".tag-name").textContent = "Nothing listed";
    $("feature").hidden = true;
  }
}

/* ---------- day pills + meal chips ---------- */
function renderDays() {
  const searching = $("search").value.trim() !== "";
  const box = $("dayTabs");
  box.replaceChildren();
  DAYS.forEach((d, i) => {
    const count = items.filter((it) => it.day === d).length;
    const btn = el("button", {
      type: "button", class: "day", role: "tab",
      "aria-selected": String(!state.week && i === state.day),
      title: `${d}: ${count} item${count === 1 ? "" : "s"}`,
      onclick: () => { state.day = i; state.week = false; render(); },
    },
      el("span", { class: "d-short" }, d.slice(0, 3)),
      el("span", { class: "d-count" }, String(count)),
      el("span", { class: "d-today" }, i === todayIndex ? "TODAY" : ""));
    if (searching) btn.setAttribute("aria-selected", "false");
    box.append(btn);
  });
  $("dayTitle").textContent = searching ? "Search results"
    : state.week ? "This week"
    : (state.day === todayIndex ? `Today · ${DAYS[state.day]}` : DAYS[state.day]);
  $("weekToggle").textContent = state.week ? "Back to one day" : "View week";
}

function renderChips() {
  const box = $("mealChips");
  box.replaceChildren();
  for (const m of ["All", ...MEALS]) {
    box.append(el("button", {
      type: "button", class: "chip", "aria-pressed": String(state.meal === m),
      onclick: () => { state.meal = m; render(); },
    }, el("span", { class: "chip-ico" }, MEAL_ICONS[m]), m === "All" ? "All meals" : m));
  }
}

/* ---------- item cards ---------- */
function highlight(text, search) {
  if (!search) return document.createTextNode(text);
  const frag = document.createDocumentFragment();
  const lower = text.toLowerCase();
  let i = 0, at;
  while ((at = lower.indexOf(search, i)) !== -1) {
    frag.append(text.slice(i, at), el("mark", {}, text.slice(at, at + search.length)));
    i = at + search.length;
  }
  frag.append(text.slice(i));
  return frag;
}

function itemCard(item, search, showDay) {
  const [a, b] = tileFor(item.name);
  const thumb = el("div", { class: "thumb", style: `background: linear-gradient(145deg, ${a}, ${b})` },
    emojiFor(item.name));
  addPhoto(thumb, item.name);

  return el("button", { type: "button", class: "item", onclick: () => openSheet(item),
    "aria-label": `${item.name}, ${item.calories} calories. View details` },
    thumb,
    el("div", { class: "item-body" },
      showDay ? el("span", { class: "item-where" }, `${item.day.slice(0, 3)} · ${item.meal}`) : null,
      el("h4", { class: "item-name" }, item.name),
      el("p", { class: "item-ing" }, highlight(item.ingredients.join(", ") || "No ingredients listed", search)),
      el("span", { class: "item-cal" }, `${item.calories} cal`)),
    el("span", { class: "plus", "aria-hidden": "true" },
      svgPlus()));
}

function svgPlus() {
  const ns = "http://www.w3.org/2000/svg";
  const s = document.createElementNS(ns, "svg");
  s.setAttribute("viewBox", "0 0 24 24");
  const p = document.createElementNS(ns, "path");
  p.setAttribute("d", "M12 5v14M5 12h14");
  p.setAttribute("stroke", "currentColor");
  p.setAttribute("stroke-width", "2.6");
  p.setAttribute("stroke-linecap", "round");
  s.append(p);
  return s;
}

/* ---------- results ---------- */
function matches(item, search, maxCal) {
  if (state.meal !== "All" && item.meal !== state.meal) return false;
  if (maxCal && item.calories > maxCal) return false;
  if (search && !item.ingredients.some((i) => i.toLowerCase().includes(search))
             && !item.name.toLowerCase().includes(search)) return false;
  return true;
}

function render() {
  renderDays();
  renderChips();

  const search = $("search").value.trim().toLowerCase();
  const maxCal = parseInt($("maxCal").value, 10) || 0;
  const filtering = Boolean(search || maxCal);
  // Searching always looks across the whole week
  const days = (state.week || search) ? DAYS : [DAYS[state.day]];
  const meals = state.meal === "All" ? MEALS : [state.meal];
  const box = $("results");
  box.replaceChildren();
  let shown = 0;

  for (const day of days) {
    const dayItems = items.filter((it) => it.day === day && matches(it, search, maxCal));
    const multi = days.length > 1;
    if (multi && !dayItems.length) continue;
    const block = el("div", { class: "day-block" });
    if (multi) block.append(el("h2", {}, day === DAYS[todayIndex] ? `${day} · Today` : day));
    const row = el("div", { class: "meals-row" });

    for (const meal of meals) {
      const mealItems = dayItems.filter((it) => it.meal === meal);
      if ((filtering || multi) && !mealItems.length) continue;
      const sec = el("section", { class: "meal-block" }, el("h3", {}, meal));
      if (!mealItems.length) sec.append(el("p", { class: "empty-meal" }, `No ${meal.toLowerCase()} listed for ${day}.`));
      else sec.append(el("div", { class: "grid" }, ...mealItems.map((it) => itemCard(it, search, false))));
      row.append(sec);
      shown += mealItems.length;
    }
    block.append(row);
    box.append(block);
  }

  if (!shown && (filtering || days.length > 1)) {
    box.append(el("div", { class: "notice" },
      el("strong", {}, "Nothing matches"),
      search ? `No items with "${search}" this week.` : "Try a higher calorie limit or a different meal."));
  }
}

/* ---------- detail sheet ---------- */
let lastFocus = null;
function openSheet(item) {
  lastFocus = document.activeElement;
  const art = $("sheetArt");
  art.querySelectorAll("img, .emoji").forEach((n) => n.remove());
  art.append(el("span", { class: "emoji", "aria-hidden": "true" }, emojiFor(item.name)));
  addPhoto(art, item.name);

  $("sheetName").textContent = item.name;
  $("sheetMeta").textContent = `${item.meal} · ${item.day}${item.day === DAYS[todayIndex] ? " (today)" : ""}`;
  const pct = Math.round((item.calories / MAX_CAL) * 100);
  $("sheetCalFill").style.width = "0";
  requestAnimationFrame(() => requestAnimationFrame(() => { $("sheetCalFill").style.width = pct + "%"; }));
  $("sheetCalNote").textContent =
    item.calories <= 400 ? "Lighter option" : item.calories <= 650 ? "Moderate" : "Heavier meal";
  $("sheetIngredients").replaceChildren(
    ...(item.ingredients.length ? item.ingredients : ["None listed"]).map((i) => el("li", {}, i)));
  $("sheetWhen").textContent = `${item.day}, ${item.meal}`;
  $("sheetCal").textContent = `${item.calories} cal`;

  $("sheet").hidden = false;
  $("sheetBackdrop").hidden = false;
  document.body.style.overflow = "hidden";
  $("sheetClose").focus();
}
function closeSheet() {
  $("sheet").hidden = true;
  $("sheetBackdrop").hidden = true;
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

/* ---------- navigation ---------- */
function jump(where) {
  if (where === "today") { state.day = todayIndex; state.week = false; }
  if (where === "week") { state.week = true; }
  render();
  document.querySelectorAll(".bottom-nav button").forEach((b) =>
    b.classList.toggle("active", b.dataset.jump === where));
  if (where === "search") {
    $("search").scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => $("search").focus({ preventScroll: true }), 350);
  } else {
    $("dayTitle").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setupTheme() {
  $("themeBtn").addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("bc-theme", root.dataset.theme); } catch (e) {}
  });
}

/* ---------- start ---------- */
async function init() {
  setupTheme();
  document.querySelectorAll("[data-jump]").forEach((a) =>
    a.addEventListener("click", (e) => { e.preventDefault(); jump(a.dataset.jump); }));
  $("weekToggle").addEventListener("click", () => { state.week = !state.week; render(); });
  $("search").addEventListener("input", render);
  $("maxCal").addEventListener("input", render);
  $("sheetClose").addEventListener("click", closeSheet);
  $("sheetBackdrop").addEventListener("click", closeSheet);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("sheet").hidden) closeSheet(); });

  try {
    const res = await fetch("menu.txt", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    items = parseMenu(await res.text());
  } catch (e) {
    $("results").replaceChildren(el("div", { class: "notice" },
      el("strong", {}, "Couldn't load the menu"), "menu.txt is missing or unreadable."));
    return;
  }
  renderHero();
  render();
}

init();
