const STORE = "idolverse_reborn_saves";

let saves = JSON.parse(localStorage.getItem(STORE) || "[]");
let activeSlot = 0;

const worlds = [
  "Hollywood",
  "K-Pop",
  "Japanese Entertainment",
  "Fashion",
  "Sports",
  "Custom Universe"
];

const careers = [
  "Actor", "K-pop Idol", "Singer", "Model",
  "Influencer", "Athlete", "Entrepreneur",
  "Student", "Ordinary Life"
];

const personalities = [
  "Ambitious", "Charming", "Quiet", "Confident",
  "Rebellious", "Kind-hearted", "Mysterious"
];

let wizard = {
  step: 1,
  name: "",
  hometown: "",
  world: "",
  career: "",
  personality: "",
  background: ""
};

const hero = document.querySelector(".hero");

function saveData() {
  localStorage.setItem(STORE, JSON.stringify(saves));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[char]);
}

document.getElementById("begin").addEventListener("click", showLives);

hero.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;

  if (action === "create") startCreator(Number(button.dataset.slot));
  if (action === "next") nextStep();
  if (action === "back") previousStep();
  if (action === "finish") finishCreation();
  if (action === "world") selectWorld(button.dataset.value);
  if (action === "career") selectCareer(button.dataset.value);
  if (action === "personality") selectPersonality(button.dataset.value);
  if (action === "continue") openLife(Number(button.dataset.slot));
  if (action === "switch") showLives();
  if (action === "day") advanceDay(Number(button.dataset.slot));
});

function showLives() {
  hero.innerHTML = `
    <p class="eyebrow">YOUR STORY STARTS HERE</p>
    <h1>Choose your <em>life.</em></h1>
    <p class="intro">Five separate lives. Five different destinies.</p>
    <div class="save-grid">
      ${Array.from({length: 5}, (_, i) => {
        const life = saves[i];
        return `
          <div class="save-card">
            <span class="save-number">LIFE 0${i + 1}</span>
            <h2>${life ? escapeHTML(life.name) : "Empty Universe"}</h2>
            <p>${life
              ? escapeHTML(life.world) + " · " + escapeHTML(life.career)
              : "A new story is waiting."}</p>
            <button data-action="${life ? "continue" : "create"}"
              data-slot="${i}">
              ${life ? "CONTINUE ↗" : "CREATE LIFE +"}
            </button>
          </div>
        `;
      }).join("")}
    </div>
    <p class="save-note">FIVE LIVES · INFINITE POSSIBILITIES</p>
  `;
}

function startCreator(slot) {
  activeSlot = slot;
  wizard = {
    step: 1, name: "", hometown: "",
    world: "", career: "",
    personality: "", background: ""
  };
  renderWizard();
}

function renderWizard() {
  const steps = ["IDENTITY", "UNIVERSE", "DESTINY", "BACKGROUND"];

  hero.innerHTML = `
    <p class="eyebrow">CREATE YOUR NEW REALITY</p>
    <div class="wizard-progress">
      ${steps.map((step, i) => `
        <div class="progress-step ${wizard.step >= i + 1 ? "active" : ""}">
          <span>0${i + 1}</span>${step}
        </div>
      `).join("")}
    </div>
    <div class="creator-content">
      ${wizard.step === 1 ? identityScreen() : ""}
      ${wizard.step === 2 ? worldScreen() : ""}
      ${wizard.step === 3 ? careerScreen() : ""}
      ${wizard.step === 4 ? backgroundScreen() : ""}
    </div>
    <div class="creator-navigation">
      ${wizard.step > 1
        ? `<button class="secondary" data-action="back">← BACK</button>`
        : ""}
      <button data-action="${wizard.step === 4 ? "finish" : "next"}">
        ${wizard.step === 4 ? "CREATE MY LIFE ✦" : "CONTINUE →"}
      </button>
    </div>
  `;
}

function identityScreen() {
  return `
    <h1>Who are <em>you?</em></h1>
    <p class="intro">Every legendary story starts with someone.</p>
    <label>Your character's name</label>
    <input class="creator-input" id="playerName"
      placeholder="Enter your name..." value="${escapeHTML(wizard.name)}">
    <label>Where are you from?</label>
    <input class="creator-input" id="playerHome"
      placeholder="e.g. Seoul, London, Kuala Lumpur..."
      value="${escapeHTML(wizard.hometown)}">
  `;
}

function worldScreen() {
  return `
    <h1>Choose your <em>universe.</em></h1>
    <p class="intro">Where will your story unfold?</p>
    <div class="choice-grid">
      ${worlds.map((world, i) => `
        <button class="choice-card ${wizard.world === world ? "selected" : ""}"
          data-action="world" data-value="${world}">
          <span>0${i + 1}</span>
          <strong>${world}</strong>
          <small>${world === "Custom Universe"
            ? "Build your own world"
            : "Enter this universe"}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function careerScreen() {
  return `
    <h1>Choose your <em>destiny.</em></h1>
    <p class="intro">What kind of life do you want to live?</p>
    <div class="choice-grid">
      ${careers.map((career, i) => `
        <button class="choice-card ${wizard.career === career ? "selected" : ""}"
          data-action="career" data-value="${career}">
          <span>0${i + 1}</span>
          <strong>${career}</strong>
        </button>
      `).join("")}
    </div>
  `;
}

function backgroundScreen() {
  return `
    <h1>Define your <em>character.</em></h1>
    <p class="intro">Give your story its own personality.</p>
    <label>Personality</label>
    <div class="choice-grid">
      ${personalities.map(personality => `
        <button class="choice-card ${wizard.personality === personality ? "selected" : ""}"
          data-action="personality" data-value="${personality}">
          <strong>${personality}</strong>
        </button>
      `).join("")}
    </div>
    <label>Your background (optional)</label>
    <textarea class="creator-input" id="playerBackground"
      placeholder="Tell us about your character's past, dreams or family...">${escapeHTML(wizard.background)}</textarea>
  `;
}

function nextStep() {
  if (wizard.step === 1) {
    wizard.name = document.getElementById("playerName").value.trim();
    wizard.hometown = document.getElementById("playerHome").value.trim();

    if (!wizard.name) {
      alert("Your character needs a name!");
      return;
    }
  }

  if (wizard.step === 2 && !wizard.world) {
    alert("Choose your universe first!");
    return;
  }

  if (wizard.step === 3 && !wizard.career) {
    alert("Choose your destiny first!");
    return;
  }

  wizard.step++;
  renderWizard();
}

function previousStep() {
  if (wizard.step > 1) {
    if (wizard.step === 4) {
      wizard.background =
        document.getElementById("playerBackground").value;
    }
    wizard.step--;
    renderWizard();
  }
}

function selectWorld(value) {
  wizard.world = value;
  renderWizard();
}

function selectCareer(value) {
  wizard.career = value;
  renderWizard();
}

function selectPersonality(value) {
  wizard.personality = value;
  renderWizard();
}

function finishCreation() {
  wizard.background =
    document.getElementById("playerBackground").value.trim();

  if (!wizard.personality) {
    alert("Choose your personality first!");
    return;
  }

  saves[activeSlot] = {
    id: Date.now().toString(),
    name: wizard.name,
    hometown: wizard.hometown,
    world: wizard.world,
    career: wizard.career,
    personality: wizard.personality,
    background: wizard.background,
    day: 1,
    money: 10000,
    fame: 0,
    reputation: 50,
    createdAt: new Date().toISOString()
  };

  saveData();
  openLife(activeSlot);
}

function openLife(index) {
  const life = saves[index];

  hero.innerHTML = `
    <p class="eyebrow">WELCOME TO YOUR NEW REALITY</p>
    <h1>${escapeHTML(life.name)}'s <em>story.</em></h1>
    <p class="intro">${escapeHTML(life.personality)} · ${escapeHTML(life.hometown || "Unknown hometown")}</p>
    <div class="life-dashboard">
      ${[
        ["WORLD", life.world],
        ["CAREER", life.career],
        ["IN-GAME DAY", life.day],
        ["MONEY", "$" + life.money.toLocaleString()],
        ["FAME", life.fame],
        ["REPUTATION", life.reputation]
      ].map(([label, value]) => `
        <div class="stat">
          <span>${label}</span>
          <h2>${escapeHTML(value)}</h2>
        </div>
      `).join("")}
    </div>
    <p class="intro">${escapeHTML(life.background || "Your journey begins today.")}</p>
    <button data-action="day" data-slot="${index}">START YOUR DAY ↗</button>
    <button class="secondary" data-action="switch">SWITCH LIFE</button>
  `;
}

function advanceDay(index) {
  saves[index].day++;
  saveData();
  openLife(index);
  }
