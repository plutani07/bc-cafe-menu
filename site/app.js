// BC Cafe Menu website.
// Reads menu.txt (same format the C++ program uses):
//   Day|Meal|Name|Calories|ingredient1,ingredient2,...

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];
const MIN_CAL = 10, MAX_CAL = 1000; // same limits as MenuItem::setCalories

const todayIndex = new Date().getDay();
let selectedDay = todayIndex;
let items = [];

const $ = (id) => document.getElementById(id);

function parseMenu(text) {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [day, meal, name, cal, ing = ""] = line.split("|");
    const calories = parseInt(cal, 10);
    if (!DAYS.includes(day) || !MEALS.includes(meal)) continue;
    if (!(calories >= MIN_CAL && calories <= MAX_CAL)) continue;
    out.push({
      day, meal, name, calories,
      ingredients: ing.split(",").map((s) => s.trim()).filter(Boolean),
    });
  }
  return out;
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) node.append(c);
  return node;
}

function renderTabs() {
  const nav = $("dayTabs");
  nav.replaceChildren();
  DAYS.forEach((d, i) => {
    const btn = el("button", { type: "button", "aria-pressed": String(i === selectedDay) }, d.slice(0, 3));
    btn.title = d;
    if (i === todayIndex) btn.append(el("span", { class: "dot", "aria-label": "today" }));
    btn.addEventListener("click", () => { selectedDay = i; render(); });
    nav.append(btn);
  });
}

function card(item, search, showWhere) {
  const c = el("article", { class: "card" },
    el("h3", {}, item.name),
    el("span", { class: "cal" }, `${item.calories} cal`));
  if (showWhere) c.append(el("p", { class: "where" }, `${item.day} · ${item.meal}`));
  const list = el("ul", { class: "ingredients" });
  for (const ing of item.ingredients) {
    const hit = search && ing.toLowerCase().includes(search);
    list.append(el("li", hit ? { class: "hit" } : {}, ing));
  }
  if (item.ingredients.length) c.append(list);
  return c;
}

function matches(item, search, maxCal) {
  if (maxCal && item.calories > maxCal) return false;
  if (search && !item.ingredients.some((i) => i.toLowerCase().includes(search))) return false;
  return true;
}

function render() {
  renderTabs();
  const search = $("search").value.trim().toLowerCase();
  const maxCal = parseInt($("maxCal").value, 10) || 0;
  const allWeek = $("allWeek").checked;
  const filtering = Boolean(search || maxCal);
  const box = $("results");
  box.replaceChildren();

  const days = allWeek ? DAYS : [DAYS[selectedDay]];
  let shown = 0;

  for (const day of days) {
    const dayItems = items.filter((it) => it.day === day && matches(it, search, maxCal));
    if (allWeek) {
      if (!dayItems.length) continue;
      box.append(el("h2", { class: "day-heading" }, day));
    }
    for (const meal of MEALS) {
      const mealItems = dayItems.filter((it) => it.meal === meal);
      if (filtering && !mealItems.length) continue;
      const sec = el("section", { class: "meal" }, el("h2", {}, meal));
      if (!mealItems.length) sec.append(el("p", { class: "empty" }, "Nothing listed"));
      mealItems.forEach((it) => sec.append(card(it, search, false)));
      box.append(sec);
      shown += mealItems.length;
    }
  }

  if (filtering && !shown) {
    box.append(el("p", { class: "notice" },
      allWeek ? "Nothing on this week's menu matches." : `Nothing on ${DAYS[selectedDay]} matches. Try "Search the whole week".`));
  }
}

async function init() {
  $("todayLine").textContent = `Today is ${DAYS[todayIndex]}.`;
  try {
    const res = await fetch("menu.txt", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    items = parseMenu(await res.text());
  } catch (e) {
    $("results").replaceChildren(el("p", { class: "notice" }, "Couldn't load menu.txt."));
    return;
  }
  ["search", "maxCal", "allWeek"].forEach((id) => $(id).addEventListener("input", render));
  render();
}

init();
