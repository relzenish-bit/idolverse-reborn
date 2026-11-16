const STORE = "idolverse_reborn_saves";
const app = document.querySelector("#app");

let saves = [];
let wizard = {};
let currentSlot = 0;
let step = 1;
let pendingDeleteSlot = null;
let toastTimer = null;

// ---------- SAVE DATA ----------

try {
  const stored = JSON.parse(localStorage.getItem(STORE) || "[]");
  saves = Array.from({ length: 5 }, (_, i) =>
    Array.isArray(stored) ? stored[i] || null : null
  );
} catch {
  saves = Array(5).fill(null);
}

function save() {
  localStorage.setItem(STORE, JSON.stringify(saves));
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

// Add new fields to older characters without removing their existing data.
function normalizeCharacter(character) {
  if (!character) return null;

  return {
    ...character,
    gender: character.gender || "Not specified",
    pronouns: character.pronouns || "Not specified",
    appearance: {
      skin: "Tan",
      face: "Oval",
      hair: "Long Straight",
      hairColor: "Black",
      eyes: "Brown",
      body: "Average",
      outfit: "Casual",
      accessory: "None",
      ...(character.appearance || {})
    },
    level: safeNumber(character.level, 1),
    xp: safeNumber(character.xp),
    fame: safeNumber(character.fame),
    money: safeNumber(character.money, 10000),
    reputation: safeNumber(character.reputation, 50),
    day: safeNumber(character.day, 1),
    rank: character.rank || "Beginner"
  };
}

saves = saves.map(normalizeCharacter);

// ---------- CREATOR OPTIONS ----------

const options = {
  skin: ["Porcelain", "Fair", "Light", "Olive", "Tan", "Caramel", "Brown", "Deep Brown", "Dark"],
  face: ["Oval", "Round", "Heart", "Square", "Diamond", "Oblong"],
  hair: ["Long Straight", "Short Bob", "Wavy", "Curly", "Coily", "Braids", "Locs", "Ponytail", "Bun", "Pixie", "Wolf Cut", "Buzz Cut", "Fade", "Undercut"],
  hairColor: ["Black", "Dark Brown", "Chocolate", "Chestnut", "Blonde", "Platinum", "Silver", "Red", "Auburn", "Pink", "Blue", "Purple", "Green", "Rainbow"],
  eyes: ["Brown", "Dark Brown", "Blue", "Green", "Hazel", "Grey", "Amber", "Violet"],
  body: ["Slim", "Athletic", "Average", "Curvy", "Muscular", "Plus Size"],
  outfit: ["Casual", "Streetwear", "Luxury", "Formal", "Sporty", "K-pop Stage", "Elegant"],
  accessory: ["None", "Glasses", "Sunglasses", "Earrings", "Necklace", "Cap", "Headphones"]
};

const genders = [
  "Male", "Female", "Non-binary", "Other", "Prefer not to say"
];

const pronouns = [
  "He / Him", "She / Her", "They / Them", "Custom"
];

const worlds = [
  "Hollywood", "K-Pop", "Japanese Entertainment",
  "Fashion", "Sports", "Custom Universe"
];

const careers = [
  "Actor", "K-pop Idol", "Singer", "Model", "Athlete",
  "Influencer", "Entrepreneur", "Student", "Ordinary Life"
];

const personalities = [
  "Ambitious", "Charming", "Quiet", "Confident",
  "Rebellious", "Kind-hearted", "Mysterious"
];

const careerPaths = {
  Athlete: ["Footballer", "F1 Driver", "Basketball Player", "Tennis Player", "Badminton Player", "Boxer", "MMA Fighter", "Swimmer", "Athletics", "Custom Sport"],
  Actor: ["Film Actor", "TV Actor", "Action Star", "Drama Actor", "Comedy Actor", "Theatre Actor"],
  "K-pop Idol": ["Vocalist", "Main Dancer", "Rapper", "Leader", "All-Rounder"],
  Singer: ["Pop", "R&B", "Rock", "Hip-Hop", "Classical", "Independent Artist"],
  Model: ["Runway", "Commercial", "Editorial", "Fitness", "Luxury Fashion"],
  Influencer: ["YouTuber", "TikToker", "Streamer", "Gaming Creator", "Lifestyle Creator"],
  Entrepreneur: ["Fashion Founder", "Music Label Owner", "Tech Founder", "Restaurant Owner", "Investor"],
  Student: ["High School", "University", "Arts School", "Sports Academy"],
  "Ordinary Life": ["Explore Freely"]
};

const skinColors = {
  Porcelain: "#f5dfd1",
  Fair: "#edc5a8",
  Light: "#dca77e",
  Olive: "#c68b60",
  Tan: "#b8794e",
  Caramel: "#a66a43",
  Brown: "#805034",
  "Deep Brown": "#603b2c",
  Dark: "#40271f"
};

const hairColors = {
  Black: "#171514",
  "Dark Brown": "#38251d",
  Chocolate: "#51301f",
  Chestnut: "#81472b",
  Blonde: "#d7b45f",
  Platinum: "#e8e1cf",
  Silver: "#a9abb4",
  Red: "#a42d28",
  Auburn: "#9b4d2e",
  Pink: "#e78eb9",
  Blue: "#3976bd",
  Purple: "#8757b6",
  Green: "#4b9468",
  Rainbow: "#b65ba9"
};

const eyeColors = {
  Brown: "#75452b",
  "Dark Brown": "#352019",
  Blue: "#4286c7",
  Green: "#43875a",
  Hazel: "#9a7942",
  Grey: "#8b929c",
  Amber: "#c18a31",
  Violet: "#8d64bd"
};

const faceShapes = {
  Oval: "M130 51 C169 51 181 82 176 120 C172 158 152 179 130 179 C108 179 88 158 84 120 C79 82 91 51 130 51Z",
  Round: "M130 54 C171 54 181 88 178 124 C175 158 153 178 130 178 C107 178 85 158 82 124 C79 88 89 54 130 54Z",
  Heart: "M130 52 C165 49 180 78 175 112 C170 148 151 172 130 180 C109 172 90 148 85 112 C80 78 95 49 130 52Z",
  Square: "M91 60 Q130 43 169 60 L177 130 Q174 169 130 177 Q86 169 83 130Z",
  Diamond: "M130 48 Q171 62 178 105 L153 163 Q130 185 107 163 L82 105 Q89 62 130 48Z",
  Oblong: "M130 45 C169 45 179 82 174 128 C170 166 152 185 130 185 C108 185 90 166 86 128 C81 82 91 45 130 45Z"
};

const hairShapes = {
  "Long Straight": {
    back: "M67 104 Q57 48 130 34 Q203 48 193 104 L190 235 Q172 250 176 130 L84 130 Q88 250 70 235Z",
    front: "M69 100 Q61 31 130 32 Q199 31 191 100 Q173 73 158 72 Q117 87 69 100Z"
  },
  "Short Bob": {
    back: "M68 111 Q59 38 130 34 Q201 38 192 111 L183 179 Q169 190 174 116 L86 116 Q91 190 77 179Z",
    front: "M69 101 Q62 32 130 32 Q198 32 191 101 Q165 73 130 78 Q95 73 69 101Z"
  },
  Wavy: {
    back: "M68 104 Q50 49 130 34 Q210 49 192 104 Q210 133 190 176 L180 225 Q164 220 176 120 L84 120 Q96 220 80 225 L70 176 Q50 133 68 104Z",
    front: "M68 102 Q54 32 130 33 Q206 32 192 102 Q178 83 164 77 Q146 95 130 77 Q105 91 91 78Z"
  },
  Curly: {
    back: "M67 112 Q48 48 130 30 Q212 48 193 112 Q214 145 185 188 L177 120 L83 120 L75 188 Q46 145 67 112Z",
    front: "M67 100 Q48 30 130 30 Q212 30 193 100 Q178 75 163 79 Q150 59 135 78 Q115 56 99 79 Q81 70 67 100Z"
  },
  Coily: {
    back: "M66 112 Q47 50 130 29 Q213 50 194 112 L188 180 L174 125 L86 125 L72 180Z",
    front: "M65 103 Q48 25 130 27 Q212 25 195 103 Q180 78 166 80 Q151 53 136 78 Q116 54 99 80 Q80 70 65 103Z"
  },
  Braids: {
    back: "M69 98 Q61 35 130 32 Q199 35 191 98 L190 225 L176 225 L178 117 L82 117 L84 225 L70 225Z",
    front: "M69 98 Q62 32 130 32 Q198 32 191 98 Q169 72 130 75 Q91 72 69 98Z"
  },
  Locs: {
    back: "M67 105 Q55 35 130 30 Q205 35 193 105 L190 232 L176 232 L174 112 L86 112 L84 232 L70 232Z",
    front: "M67 100 Q57 29 130 29 Q203 29 193 100 Q173 78 130 77 Q87 78 67 100Z"
  },
  Ponytail: {
    back: "M67 102 Q59 34 130 31 Q201 34 193 102 L185 153 Q177 140 180 103 L80 103 Q83 140 75 153Z",
    front: "M68 99 Q60 31 130 31 Q200 31 192 99 Q173 76 130 78 Q87 76 68 99Z"
  },
  Bun: {
    back: "M70 104 Q61 38 130 35 Q199 38 190 104 L181 143 L79 143Z",
    front: "M69 98 Q61 34 130 34 Q199 34 191 98 Q174 75 130 76 Q86 75 69 98Z"
  },
  Pixie: {
    back: "M78 104 Q73 48 130 40 Q187 48 182 104 L174 135 L86 135Z",
    front: "M75 96 Q72 39 130 38 Q188 39 185 96 Q165 74 144 76 Q113 60 75 96Z"
  },
  "Wolf Cut": {
    back: "M67 104 Q56 35 130 30 Q204 35 193 104 L190 204 L174 174 L174 116 L86 116 L86 174 L70 204Z",
    front: "M68 100 Q59 31 130 31 Q201 31 192 100 Q172 76 155 79 Q131 93 108 78 Q84 77 68 100Z"
  },
  "Buzz Cut": {
    back: "M79 88 Q80 42 130 40 Q180 42 181 88 L175 105 L85 105Z",
    front: "M79 83 Q82 40 130 40 Q178 40 181 83 Q157 63 130 65 Q103 63 79 83Z"
  },
  Fade: {
    back: "M80 94 Q83 47 130 42 Q177 47 180 94 L172 112 L88 112Z",
    front: "M79 86 Q83 42 130 41 Q177 42 181 86 Q158 66 130 67 Q102 66 79 86Z"
  },
  Undercut: {
    back: "M78 94 Q78 45 130 39 Q182 45 182 94 L174 115 L86 115Z",
    front: "M77 86 Q77 38 130 38 Q183 38 183 86 Q157 62 130 68 Q101 65 77 86Z"
  }
};

// ---------- SMALL UI HELPERS ----------

function showToast(message, type = "success") {
  document.querySelector(".iv-toast")?.remove();

  const toast = document.createElement("div");
  toast.className = `iv-toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), 2600);
}

function choiceButtons(values, selected, attribute) {
  return `
    <div class="choice-grid">
      ${values.map(value => `
        <button type="button"
          class="choice-card ${selected === value ? "selected" : ""}"
          ${attribute}="${escapeHTML(value)}">
          ${escapeHTML(value)}
        </button>
      `).join("")}
    </div>`;
}

function fieldHeading(title, subtitle = "") {
  return `
    <div class="creator-heading">
      <h3>${title}</h3>
      ${subtitle ? `<p>${subtitle}</p>` : ""}
    </div>`;
}

function selectOptions(key, label) {
  return `
    <div class="creator-field">
      <label>${label}</label>
      ${choiceButtons(options[key], wizard.appearance[key], `data-appearance="${key}" data-value`)}
    </div>`;
}

// ---------- AVATAR PREVIEW ----------

function avatarPreview() {
  const a = wizard.appearance;
  const skin = skinColors[a.skin] || skinColors.Tan;
  const hair = hairColors[a.hairColor] || hairColors.Black;
  const eyes = eyeColors[a.eyes] || eyeColors.Brown;
  const face = faceShapes[a.face] || faceShapes.Oval;
  const hairstyle = hairShapes[a.hair] || hairShapes["Long Straight"];

  const outfitColors = {
    Casual: "#53677c",
    Streetwear: "#343b50",
    Luxury: "#8b7045",
    Formal: "#252b3b",
    Sporty: "#417b78",
    "K-pop Stage": "#895b9b",
    Elegant: "#986c78"
  };

  const outfit = outfitColors[a.outfit] || outfitColors.Casual;

  let accessory = "";

  if (a.accessory === "Glasses" || a.accessory === "Sunglasses") {
    const lens = a.accessory === "Sunglasses" ? "#222" : "none";
    accessory = `
      <g stroke="#30251f" stroke-width="3" fill="${lens}" fill-opacity=".65">
        <rect x="91" y="104" width="28" height="19" rx="7"/>
        <rect x="141" y="104" width="28" height="19" rx="7"/>
        <path d="M119 112 L141 112"/>
      </g>`;
  }

  if (a.accessory === "Earrings") {
    accessory = `<g fill="#e6c47c"><circle cx="83" cy="132" r="4"/><circle cx="177" cy="132" r="4"/></g>`;
  }

  if (a.accessory === "Necklace") {
    accessory = `<path d="M105 200 Q130 235 155 200" stroke="#e6c47c" stroke-width="3" fill="none"/>`;
  }

  if (a.accessory === "Cap") {
    accessory = `<path d="M69 77 Q130 28 191 77 L196 88 L64 88Z" fill="#333b50"/>`;
  }

  if (a.accessory === "Headphones") {
    accessory = `
      <path d="M74 109 Q74 38 130 38 Q186 38 186 109" stroke="#25252b" stroke-width="9" fill="none"/>
      <rect x="68" y="100" width="13" height="35" rx="6" fill="#25252b"/>
      <rect x="179" y="100" width="13" height="35" rx="6" fill="#25252b"/>`;
  }

  return `
    <div class="avatar-preview">
      <svg viewBox="0 0 260 310" width="100%" style="max-width:260px;height:auto" role="img" aria-label="Character appearance preview">
        <defs>
          <linearGradient id="avatarGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity=".13"/>
            <stop offset="100%" stop-color="#000000" stop-opacity=".15"/>
          </linearGradient>
        </defs>
        <path d="${hairstyle.back}" fill="${hair}"/>
        <rect x="113" y="164" width="34" height="45" rx="12" fill="${skin}"/>
        <path d="M72 291 Q75 214 110 202 L130 218 L150 202 Q185 214 188 291Z" fill="${outfit}"/>
        <path d="M110 202 L130 219 L150 202" fill="none" stroke="#ffffff" stroke-opacity=".3" stroke-width="3"/>
        <path d="${face}" fill="${skin}" stroke="#000000" stroke-opacity=".1" stroke-width="2"/>
        <path d="M94 99 Q105 91 117 98 M143 98 Q155 91 166 99" stroke="#3a2820" stroke-width="4" stroke-linecap="round" fill="none"/>
        <ellipse cx="105" cy="113" rx="8" ry="5" fill="#fff"/>
        <ellipse cx="155" cy="113" rx="8" ry="5" fill="#fff"/>
        <circle cx="105" cy="113" r="4" fill="${eyes}"/>
        <circle cx="155" cy="113" r="4" fill="${eyes}"/>
        <circle cx="106" cy="112" r="1.5" fill="#fff"/>
        <circle cx="156" cy="112" r="1.5" fill="#fff"/>
        <path d="M130 115 L125 139 Q130 143 135 139" stroke="#805b48" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M119 157 Q130 164 141 157" stroke="#944e54" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="${hairstyle.front}" fill="${hair}"/>
        ${accessory}
        <path d="M0 0 H260 V310 H0Z" fill="url(#avatarGlow)" pointer-events="none"/>
      </svg>
      <div class="avatar-label">${escapeHTML(a.hair)} · ${escapeHTML(a.body)}</div>
    </div>`;
}

// ---------- WELCOME AND SAVE SLOTS ----------

function begin() {
  showLives();
}

function showLives() {
  app.innerHTML = `
    <main class="welcome lives-screen">
      <div class="brand">IDOL<span>VERSE</span></div>
      <p class="eyebrow">YOUR UNIVERSE AWAITS</p>
      <h1>Choose your<br><em>next life.</em></h1>
      <p class="intro">Five lives. Five different stories. Which one will you live?</p>

      <div class="save-grid">
        ${Array.from({ length: 5 }, (_, i) => {
          const s = saves[i];

          return `
            <article class="save-slot ${s ? "occupied" : "empty"}">
              <button class="save-card" data-slot="${i}">
                <span class="save-number">LIFE 0${i + 1}</span>
                <strong>${s ? escapeHTML(s.name) : "Create a new life"}</strong>
                <span>${s ? escapeHTML(s.world || "Unknown Universe") : "An entirely new story awaits"}</span>
                ${s ? `<span class="save-career">${escapeHTML(s.careerPath || s.career || "New Life")}</span>` : `<span class="save-plus">＋</span>`}
              </button>
              ${s ? `<button class="delete-slot-button" data-delete-slot="${i}">DELETE LIFE</button>` : ""}
            </article>`;
        }).join("")}
      </div>
      <button class="secondary-button" id="home">BACK TO WELCOME</button>
    </main>`;
}

// ---------- CHARACTER CREATOR ----------

function startCreator(slot) {
  currentSlot = slot;
  step = 1;

  wizard = {
    name: "",
    hometown: "",
    gender: "Male",
    pronouns: "He / Him",
    customPronouns: "",
    world: "Hollywood",
    career: "Actor",
    careerPath: "Film Actor",
    personality: "Ambitious",
    appearance: {
      skin: "Tan",
      face: "Oval",
      hair: "Long Straight",
      hairColor: "Black",
      eyes: "Brown",
      body: "Average",
      outfit: "Casual",
      accessory: "None"
    }
  };

  renderWizard();
}

function captureIdentity() {
  const name = document.querySelector("#charName");
  const hometown = document.querySelector("#hometown");
  const customPronouns = document.querySelector("#customPronouns");

  if (name) wizard.name = name.value.trim();
  if (hometown) wizard.hometown = hometown.value.trim();
  if (customPronouns) wizard.customPronouns = customPronouns.value.trim();
}

function renderWizard() {
  let content = "";

  if (step === 1) {
    content = `
      ${fieldHeading("Your identity", "First, let's get to know you.")}
      <input class="creator-input" id="charName" maxlength="35" placeholder="Character name" value="${escapeHTML(wizard.name)}">
      <input class="creator-input" id="hometown" maxlength="45" placeholder="Hometown / City" value="${escapeHTML(wizard.hometown)}">

      ${fieldHeading("Gender", "Choose how your character identifies.")}
      ${choiceButtons(genders, wizard.gender, "data-gender")}

      ${fieldHeading("Pronouns", "Choose the pronouns used for your character.")}
      ${choiceButtons(pronouns, wizard.pronouns, "data-pronouns")}

      ${wizard.pronouns === "Custom" ? `
        <input class="creator-input" id="customPronouns" maxlength="30" placeholder="Enter your pronouns" value="${escapeHTML(wizard.customPronouns)}">
      ` : ""}

      <p class="creator-note">Your gender and pronouns never restrict your career, clothing, appearance or relationships.</p>
    `;
  }

  if (step === 2) {
    content = `
      ${fieldHeading("Your appearance", "Create a look that feels like you.")}
      ${avatarPreview()}
      ${selectOptions("skin", "Skin tone")}
      ${selectOptions("face", "Face shape")}
    `;
  }

  if (step === 3) {
    content = `
      ${fieldHeading("Your personal style", "Your look, your rules.")}
      ${avatarPreview()}
      ${selectOptions("hair", "Hairstyle")}
      ${selectOptions("hairColor", "Hair colour")}
      ${selectOptions("eyes", "Eye colour")}
      ${selectOptions("body", "Body type")}
      ${selectOptions("outfit", "Outfit")}
      ${selectOptions("accessory", "Accessories")}
    `;
  }

  if (step === 4) {
    content = `
      ${fieldHeading("Choose your universe", "Where will your story begin?")}
      ${choiceButtons(worlds, wizard.world, "data-world")}

      ${fieldHeading("Choose your career", "What do you want to become?")}
      ${choiceButtons(careers, wizard.career, "data-career")}

      ${fieldHeading("Choose your path", "Pick your starting specialization.")}
      ${choiceButtons(careerPaths[wizard.career] || ["Custom Path"], wizard.careerPath, "data-path")}

      ${fieldHeading("Your personality", "What kind of person are you?")}
      ${choiceButtons(personalities, wizard.personality, "data-personality")}
    `;
  }

  if (step === 5) {
    content = `
      ${fieldHeading("Your identity is ready", "Take one last look before starting your life.")}
      ${avatarPreview()}
      <div class="character-review">
        <h2>${escapeHTML(wizard.name || "Your Character")}</h2>
        <p>${escapeHTML(wizard.gender)} · ${escapeHTML(wizard.pronouns === "Custom" ? wizard.customPronouns : wizard.pronouns)}</p>
        <p>${escapeHTML(wizard.hometown || "Hometown not set")}</p>
        <div class="review-line"><span>Universe</span><strong>${escapeHTML(wizard.world)}</strong></div>
        <div class="review-line"><span>Career</span><strong>${escapeHTML(wizard.career)}</strong></div>
        <div class="review-line"><span>Specialization</span><strong>${escapeHTML(wizard.careerPath)}</strong></div>
        <div class="review-line"><span>Personality</span><strong>${escapeHTML(wizard.personality)}</strong></div>
      </div>
      <p class="creator-note">Your journey begins with a fresh identity. Your other save slots will remain untouched.</p>
    `;
  }

  const stepNames = ["IDENTITY", "FACE", "STYLE", "UNIVERSE", "REVIEW"];

  app.innerHTML = `
    <main class="welcome creator-screen">
      <div class="brand">IDOL<span>VERSE</span></div>
      <p class="eyebrow">CREATE YOUR IDENTITY · STEP ${step} OF 5</p>
      <div class="wizard-progress">
        <div class="progress-step" style="width:${step * 20}%"></div>
      </div>
      <p class="step-name">${stepNames[step - 1]}</p>
      <section class="creator-content">${content}</section>
      <div class="creator-navigation">
        <button class="secondary-button" data-back>BACK</button>
        ${step < 5
          ? `<button data-next>CONTINUE →</button>`
          : `<button data-finish>CREATE MY LIFE ✨</button>`}
      </div>
    </main>`;
}

function nextStep() {
  captureIdentity();

  if (step === 1 && !wizard.name) {
    showToast("Please enter your character's name.", "error");
    return;
  }

  if (step === 1 && wizard.pronouns === "Custom" && !wizard.customPronouns) {
    showToast("Please enter your custom pronouns.", "error");
    return;
  }

  if (step < 5) {
    step++;
    renderWizard();
  }
}

function previousStep() {
  captureIdentity();

  if (step > 1) {
    step--;
    renderWizard();
  }
}

function finishCreation() {
  captureIdentity();

  if (!wizard.name) {
    showT
