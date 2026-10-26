// BC Cafe catering page. Reads catering.json (from the three Perkins catering guides).

const SECTION_EMOJI = {
  "Breakfast": "🥐", "Breakfast A La Carte": "🍩", "Lunch & Dinner": "🥪", "Snacks & Extras": "🍪",
  "Beverages": "🥤", "Groceries To Go": "🛒", "Cold Luncheons": "🥗", "Lunch & Dinner Entrées": "🍽️",
  "Desserts": "🍰", "Hors d'Oeuvres": "🍢", "Themed Buffets": "🎉", "Reception Packages": "🥂",
  "Carving & Specialty Stations": "🔪", "Dessert Stations": "🍨", "Plated Dinners": "🍷",
};

let data = null;
let current = 0;

function renderGuide() {
  const guide = data.guides[current];
  const tabs = $("guideTabs");
  tabs.replaceChildren(...data.guides.map((g, i) => el("button", {
    type: "button", class: "week-tab", role: "tab", "aria-selected": String(i === current),
    onclick: () => { current = i; renderGuide(); },
  }, g.name)));
  $("guideTagline").textContent = guide.tagline;

  const body = $("guideBody");
  body.replaceChildren();
  for (const section of guide.sections) {
    const block = el("section", { class: "station-block" },
      el("div", { class: "station-head" },
        el("span", { class: "station-ico", "aria-hidden": "true" }, SECTION_EMOJI[section.title] || "🍽️"),
        el("div", {}, el("h3", {}, section.title), section.note ? el("p", {}, section.note) : null)));
    block.append(el("div", { class: "cater-grid" }, ...section.items.map((it) =>
      el("article", { class: "cater-card" },
        el("h4", {}, it.name),
        it.desc ? el("p", {}, it.desc) : null))));
    body.append(block);
  }
}

async function init() {
  setupTheme();
  try {
    const res = await fetch("catering.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    data = await res.json();
  } catch (e) {
    $("guideBody").replaceChildren(el("div", { class: "notice" },
      el("strong", {}, "Couldn't load the catering menus"), "catering.json is missing or unreadable."));
    return;
  }
  $("officeHours").textContent = data.office;
  $("cateringNotes").replaceChildren(...data.notes.map((n) => el("li", {}, n)));
  $("sourceNote").textContent = data.source;
  renderGuide();
}

init();
