// BC Cafe Menu website (main page).
// Reads menu.txt — the same file the C++ program uses — and shows the
// Perkins College Dining Hall menu by rotation week, day, meal, and station.
//
// Photos: drop a picture in site/img/ named after the item, lowercase with
// dashes (e.g. "Chicken Parmesan" -> img/chicken-parmesan.jpg).

const now = new Date();
const TODAY = dayIndexOf(now);
const THIS_WEEK = cycleWeekFor(now);

let items = [];
const state = { week: THIS_WEEK, day: TODAY, meal: null, view: "day", veg: false };

/* ---------- helpers ---------- */
function mealsFor(dayIdx) {
  return dayIdx >= 5 ? ["Brunch", "Lunch", "Dinner"] : ["Breakfast", "Lunch", "Dinner"];
}
function mealByClock(dayIdx) {
  const h = now.getHours() + now.getMinutes() / 60;
  if (h < 10.5) return mealsFor(dayIdx)[0];
  if (h < 15) return "Lunch";
  return "Dinner";
}
function isToday(week, dayIdx) { return week === THIS_WEEK && dayIdx === TODAY; }
// The next calendar date (from this week on) that this cycle week + day falls on
function dateFor(week, dayIdx) {
  const weeksAhead = ((week - THIS_WEEK) % CYCLE_WEEKS + CYCLE_WEEKS) % CYCLE_WEEKS;
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() - TODAY + dayIdx + weeksAhead * 7);
  return d;
}
function pick(week, dayIdx, meal) {
  return items.filter((i) => i.week === week && i.day === DAYS[dayIdx] && i.meal === meal && (!state.veg || i.tags.includes("vegetarian")));
}
function groupBy(list, key) {
  const map = new Map();
  for (const it of list) {
    if (!map.has(it[key])) map.set(it[key], []);
    map.get(it[key]).push(it);
  }
  return map;
}
function stationOrder(a, b) {
  const names = Object.keys(STATIONS);
  const ia = names.indexOf(a), ib = names.indexOf(b);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
}

// Every time an item (same name + station) is served across the cycle, summarized
function whenServed(item) {
  const all = items.filter((i) => i.name === item.name && i.station === item.station);
  const meals = [...new Set(all.map((i) => i.meal))].sort((a, b) => MEALS.indexOf(a) - MEALS.indexOf(b));
  if (all.length && all.every((i) => i.everyDay)) {
    const days = new Set(all.map((i) => i.day));
    const dayText = days.size === 7 ? "Every day" : days.size === 5 ? "Weekdays" : days.size === 2 ? "Weekends" : [...days].join(", ");
    return `${dayText} · ${meals.join(" & ")}`;
  }
  const seen = new Set();
  const parts = [];
  for (const i of all.sort((a, b) => a.week - b.week || DAYS.indexOf(a.day) - DAYS.indexOf(b.day))) {
    const label = `Week ${i.week} ${i.day.slice(0, 3)}`;
    if (!seen.has(label)) { seen.add(label); parts.push(label); }
  }
  const shown = parts.slice(0, 8).join(", ");
  return parts.length > 8 ? `${shown} + ${parts.length - 8} more` : shown;
}

/* ---------- top of page ---------- */
function renderHero() {
  $("heroDate").textContent =
    `${now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} · Week ${THIS_WEEK} of the menu cycle`;

  const meal = mealByClock(TODAY);
  const order = mealsFor(TODAY).slice(mealsFor(TODAY).indexOf(meal));
  let next = null;
  for (const m of order) {
    next = items.find((i) => i.week === THIS_WEEK && i.day === DAYS[TODAY] && i.meal === m &&
                             i.station === "Laurene's" && !i.tags.includes("side"));
    if (next) break;
  }
  const tag = $("heroTag");
  if (next) {
    $("heroEmoji").textContent = emojiFor(next.name, next.station);
    tag.querySelector(".tag-label").textContent = `${next.meal} today`;
    tag.querySelector(".tag-name").textContent = next.name;
  } else {
    tag.querySelector(".tag-label").textContent = "Today";
    tag.querySelector(".tag-name").textContent = "See the full menu";
  }

  // Banner: today's plant-based pick from Root & Vine
  const rootMeal = meal === "Dinner" ? "Dinner" : "Lunch";
  const root = items.find((i) => i.week === THIS_WEEK && i.day === DAYS[TODAY] && i.meal === rootMeal && i.station === "Root & Vine")
            || items.find((i) => i.week === THIS_WEEK && i.day === DAYS[TODAY] && i.station === "Root & Vine");
  if (root) {
    $("feature").hidden = false;
    $("featureLabel").textContent = `Plant-based pick · ${root.meal} at Root & Vine`;
    $("featureName").textContent = root.name;
    $("featureArt").textContent = emojiFor(root.name, root.station);
    $("featureBtn").onclick = () => openSheet(root);
  }
}

/* ---------- pickers ---------- */
function renderWeekTabs() {
  const box = $("weekTabs");
  box.replaceChildren();
  for (let w = 1; w <= CYCLE_WEEKS; w++) {
    box.append(el("button", {
      type: "button", class: "week-tab", role: "tab", "aria-selected": String(w === state.week),
      onclick: () => { state.week = w; render(); },
    }, `Week ${w}`, w === THIS_WEEK ? el("span", { class: "now" }, "this week") : null));
  }
}

function renderDays() {
  const searching = $("search").value.trim() !== "";
  const box = $("dayTabs");
  box.replaceChildren();
  DAYS.forEach((d, i) => {
    const date = dateFor(state.week, i);
    box.append(el("button", {
      type: "button", class: "day", role: "tab",
      "aria-selected": String(!searching && state.view === "day" && i === state.day),
      title: `${d}, ${date.toLocaleDateString(undefined, { month: "long", day: "numeric" })}`,
      onclick: () => { state.day = i; state.view = "day"; state.meal = null; $("search").value = ""; render(); },
    },
      el("span", { class: "d-short" }, d.slice(0, 3)),
      el("span", { class: "d-count" }, String(date.getDate())),
      el("span", { class: "d-today" }, isToday(state.week, i) ? "TODAY" : ""),
    ));
  });

  $("dayTitle").textContent = searching ? "Search results"
    : state.view === "week" ? `Week ${state.week} at a glance`
    : isToday(state.week, state.day) ? `Today · ${DAYS[state.day]}`
    : `${DAYS[state.day]} · Week ${state.week}`;
  $("weekToggle").textContent = state.view === "week" ? "Back to one day" : "View week";
}

const MEAL_ICONS = { Breakfast: "🥞", Brunch: "🧇", Lunch: "🥪", Dinner: "🍽️" };
function renderChips() {
  const box = $("mealChips");
  box.replaceChildren();
  const hide = state.view === "week" || $("search").value.trim() !== "";
  box.hidden = hide;
  if (hide) return;
  for (const m of mealsFor(state.day)) {
    box.append(el("button", {
      type: "button", class: "chip", "aria-pressed": String(state.meal === m),
      onclick: () => { state.meal = m; render(); },
    }, el("span", { class: "chip-ico" }, MEAL_ICONS[m]), m));
  }
}

/* ---------- cards ---------- */
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

function badges(item) {
  const out = [];
  if (item.tags.includes("vegetarian")) out.push(el("span", { class: "badge veg" }, "Plant-based"));
  if (item.tags.includes("rotating")) out.push(el("span", { class: "badge" }, "Not every day"));
  return out;
}

function itemCard(item, { search = "", when = "" } = {}) {
  const [a, b] = tileFor(item.name);
  const thumb = el("div", { class: "thumb", style: `background: linear-gradient(145deg, ${a}, ${b})` },
    emojiFor(item.name, item.station));
  addPhoto(thumb, item.name);
  const detail = item.ingredients.length ? item.ingredients.slice(0, 6).join(", ") + (item.ingredients.length > 6 ? "…" : "") : "";

  return el("button", { type: "button", class: "item", onclick: () => openSheet(item),
    "aria-label": `${item.name}. View details` },
    thumb,
    el("div", { class: "item-body" },
      when ? el("span", { class: "item-where" }, `${item.station}`) : null,
      el("h4", { class: "item-name" }, highlight(item.name, search)),
      detail ? el("p", { class: "item-ing" }, highlight(detail, search)) : null,
      when ? el("span", { class: "item-when" }, when) : el("span", { class: "badges" }, ...badges(item)),
    ),
    el("span", { class: "plus", "aria-hidden": "true" }, "+"));
}

function sideChips(sides) {
  return el("div", { class: "sides" },
    el("span", { class: "sides-label" }, "Sides"),
    ...sides.map((s) => el("button", { type: "button", class: "side-chip", onclick: () => openSheet(s) }, s.name)));
}

function stationHead(name, count) {
  const info = stationInfo(name);
  return el("div", { class: "station-head" },
    el("span", { class: "station-ico", "aria-hidden": "true" }, info.emoji),
    el("div", {}, el("h3", {}, name), el("p", {}, info.blurb)),
    count ? el("span", { class: "station-count" }, count) : null);
}

/* ---------- views ---------- */
function renderDayView(box) {
  if (!state.meal || !mealsFor(state.day).includes(state.meal)) {
    state.meal = isToday(state.week, state.day) ? mealByClock(state.day) : mealsFor(state.day)[0];
    renderChips();
  }
  const list = pick(state.week, state.day, state.meal);
  if (!list.length) {
    box.append(el("div", { class: "notice" }, el("strong", {}, "Nothing listed"),
      state.veg ? "No plant-based items for this meal. Turn off the Plant-based filter to see everything." : "Nothing is listed for this meal."));
    return;
  }
  const byStation = groupBy(list, "station");
  const names = [...byStation.keys()].sort(stationOrder);
  const featured = names.filter((n) => stationInfo(n).featured);
  const everyday = names.filter((n) => !stationInfo(n).featured);

  for (const st of featured) {
    const all = byStation.get(st);
    const mains = all.filter((i) => !i.tags.includes("side"));
    const sides = all.filter((i) => i.tags.includes("side"));
    const block = el("section", { class: "station-block" }, stationHead(st));
    if (mains.length) block.append(el("div", { class: "grid" }, ...mains.map((i) => itemCard(i))));
    if (sides.length) block.append(sideChips(sides));
    box.append(block);
  }

  if (everyday.length) {
    box.append(el("h2", { class: "group-title" }, "Every day stations",
      el("span", {}, "Same lineup all week")));
    const grid = el("div", { class: "station-grid" });
    for (const st of everyday) {
      const all = byStation.get(st);
      const mains = all.filter((i) => !i.tags.includes("side"));
      const sides = all.filter((i) => i.tags.includes("side"));
      grid.append(el("section", { class: "station-tile" },
        stationHead(st),
        el("ul", { class: "tile-list" }, ...mains.map((i) =>
          el("li", {}, el("button", { type: "button", onclick: () => openSheet(i) },
            el("span", { "aria-hidden": "true" }, emojiFor(i.name, i.station)),
            el("span", { class: "tile-name" }, i.name),
            i.tags.includes("rotating") ? el("span", { class: "badge" }, "rotates") : null,
            i.tags.includes("vegetarian") ? el("span", { class: "badge veg" }, "veg") : null)))),
        sides.length ? el("p", { class: "tile-sides" }, "With ", sides.map((s) => s.name).join(", ")) : null,
      ));
    }
    box.append(grid);
  }
}

function renderWeekView(box) {
  box.append(el("p", { class: "hint" }, "Daily specials from Laurene's, Root & Vine, and Hearth & Ladle. Tap a day for the full menu, including every-day stations."));
  const grid = el("div", { class: "week-grid" });
  DAYS.forEach((d, idx) => {
    const card = el("button", { type: "button", class: "week-day" + (isToday(state.week, idx) ? " is-today" : ""),
      onclick: () => { state.day = idx; state.view = "day"; state.meal = null; render(); $("dayTitle").scrollIntoView({ behavior: "smooth" }); } },
      el("h3", {}, d, isToday(state.week, idx) ? el("span", { class: "now" }, "today") : null));
    for (const meal of mealsFor(idx)) {
      const specials = pick(state.week, idx, meal).filter((i) => stationInfo(i.station).featured && !i.tags.includes("side"));
      if (!specials.length) continue;
      card.append(el("div", { class: "wk-meal" },
        el("span", { class: "wk-label" }, meal),
        el("ul", {}, ...specials.map((i) => el("li", {},
          el("span", { "aria-hidden": "true" }, emojiFor(i.name, i.station)), " ", i.name)))));
    }
    grid.append(card);
  });
  box.append(grid);
}

function renderSearch(box, search) {
  const seen = new Map();
  for (const it of items) {
    if (state.veg && !it.tags.includes("vegetarian")) continue;
    const hit = it.name.toLowerCase().includes(search) || it.ingredients.some((g) => g.toLowerCase().includes(search));
    if (!hit) continue;
    const key = it.station + "|" + it.name;
    if (!seen.has(key)) seen.set(key, it);
  }
  const results = [...seen.values()].sort((a, b) =>
    (a.name.toLowerCase().includes(search) ? 0 : 1) - (b.name.toLowerCase().includes(search) ? 0 : 1) ||
    (a.tags.includes("side") ? 1 : 0) - (b.tags.includes("side") ? 1 : 0) ||
    a.name.localeCompare(b.name));

  if (!results.length) {
    box.append(el("div", { class: "notice" }, el("strong", {}, "Nothing matches"), `No dishes or ingredients with "${search}" in the 4-week menu.`));
    return;
  }
  box.append(el("p", { class: "hint" }, `${results.length} item${results.length === 1 ? "" : "s"} across all 4 weeks`));
  box.append(el("div", { class: "grid search-grid" }, ...results.slice(0, 60).map((i) => itemCard(i, { search, when: whenServed(i) }))));
  if (results.length > 60) box.append(el("p", { class: "hint" }, `Showing the first 60. Try a more specific search.`));
}

function render() {
  renderWeekTabs();
  renderDays();
  renderChips();
  $("vegToggle").setAttribute("aria-pressed", String(state.veg));
  const box = $("results");
  box.replaceChildren();
  const search = $("search").value.trim().toLowerCase();
  if (search) renderSearch(box, search);
  else if (state.view === "week") renderWeekView(box);
  else renderDayView(box);
}

/* ---------- detail sheet ---------- */
let lastFocus = null;
function openSheet(item) {
  lastFocus = document.activeElement;
  const art = $("sheetArt");
  art.querySelectorAll("img, .emoji").forEach((n) => n.remove());
  art.append(el("span", { class: "emoji", "aria-hidden": "true" }, emojiFor(item.name, item.station)));
  addPhoto(art, item.name);

  $("sheetName").textContent = item.name;
  const dayLabel = isToday(item.week, DAYS.indexOf(item.day)) ? `${item.day} (today)` : item.day;
  $("sheetMeta").textContent = item.everyDay ? `${item.station} · ${stationInfo(item.station).blurb}` : `${item.meal} · ${dayLabel} · Week ${item.week}`;

  const tags = [];
  if (item.tags.includes("side")) tags.push("Side");
  if (item.tags.includes("vegetarian")) tags.push("Plant-based");
  if (item.tags.includes("rotating")) tags.push("Not served every day");
  $("sheetTags").replaceChildren(...tags.map((t) => el("span", { class: "badge" + (t === "Plant-based" ? " veg" : "") }, t)));

  $("sheetCalBlock").hidden = !item.calories;
  if (item.calories) {
    $("sheetCalFill").style.width = "0";
    requestAnimationFrame(() => requestAnimationFrame(() => { $("sheetCalFill").style.width = Math.round(item.calories / 10) + "%"; }));
  }

  const buildYourOwn = item.everyDay && item.ingredients.length > 4;
  $("sheetListTitle").textContent = buildYourOwn ? "Options" : "Ingredients";
  $("sheetIngredients").replaceChildren(...(item.ingredients.length
    ? item.ingredients.map((i) => el("li", {}, i))
    : [el("li", { class: "muted-li" }, "Not listed on the Perkins menu")]));

  $("sheetWhenList").textContent = whenServed(item);
  $("sheetStation").textContent = item.station;
  $("sheetCal").textContent = item.calories ? `${item.calories} cal` : stationInfo(item.station).emoji;

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
  if (where === "today") { state.week = THIS_WEEK; state.day = TODAY; state.view = "day"; state.meal = null; $("search").value = ""; }
  if (where === "week") { state.view = "week"; $("search").value = ""; }
  render();
  document.querySelectorAll(".bottom-nav button").forEach((b) => b.classList.toggle("active", b.dataset.jump === where));
  if (where === "search") {
    $("search").scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => $("search").focus({ preventScroll: true }), 350);
  } else {
    $("dayTitle").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ---------- start ---------- */
async function init() {
  setupTheme();
  document.querySelectorAll("[data-jump]").forEach((a) =>
    a.addEventListener("click", (e) => { e.preventDefault(); jump(a.dataset.jump); }));
  $("weekToggle").addEventListener("click", () => { state.view = state.view === "week" ? "day" : "week"; $("search").value = ""; render(); });
  $("search").addEventListener("input", render);
  $("vegToggle").addEventListener("click", () => { state.veg = !state.veg; render(); });
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
