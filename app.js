
const app = document.getElementById("app");
/* ==========================================
   IDOLVERSE — NAVIGATION SYSTEM 2.0
========================================== */

let navigationHistory = [];


function navigateTo(screenFunction, ...args) {
  navigationHistory.push({
    screen: currentScreen,
    slot: selectedSlot,
    step: currentStep,
    wizard: wizard
      ? {
          ...wizard,
          appearance: { ...wizard.appearance }
        }
      : null
  });

  screenFunction(...args);
}


function goBack() {
  if (navigationHistory.length === 0) {
    showWelcome();
    return;
  }

  const previous = navigationHistory.pop();

  selectedSlot = previous.slot;

  switch (previous.screen) {
    case "welcome":
      showWelcome();
      break;

    case "lives":
      showLives();
      break;

    case "creator":
      currentScreen = "creator";
      wizard = previous.wizard;
      currentStep = previous.step || 1;
      renderWizard();
      break;

    case "dashboard":
      openLife(selectedSlot);
      break;

    default:
      showWelcome();
  }
}


let currentScreen = "welcome";


const STORAGE_KEY = "idolverse_reborn_saves";
const TOTAL_SLOTS = 5;

const worlds = [
  "Hollywood",
  "K-pop",
  "Japanese Entertainment",
  "Music Industry",
  "Fashion",
  "Sports",
  "Digital & Media",
  "Everyday Life",
  "Custom Universe"
];

const careers = {
  "Hollywood": ["Actor", "Singer", "Director", "Influencer"],
  "K-pop": ["K-pop Idol", "Solo Artist", "Producer", "Dancer"],
  "Japanese Entertainment": ["Actor", "Idol", "Singer", "Model"],
  "Music Industry": ["Singer", "Songwriter", "Producer", "Musician"],
  "Fashion": ["Model", "Designer", "Stylist", "Brand Owner"],
  "Sports": ["Footballer", "F1 Driver", "Basketball Player", "Tennis Player", "Other Athlete"],
  "Digital & Media": ["YouTuber", "Streamer", "TikToker", "Influencer"],
  "Everyday Life": ["Student", "Doctor", "Teacher", "Lawyer", "Chef", "Entrepreneur"],
  "Custom Universe": ["Create Your Own Career"]
};

const careerPaths = {
  "Footballer": ["Striker", "Midfielder", "Defender", "Goalkeeper"],
  "F1 Driver": ["Rookie Driver", "Reserve Driver", "Professional Driver"],
  "Basketball Player": ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
  "Tennis Player": ["Singles", "Doubles"],
  "K-pop Idol": ["Vocalist", "Main Dancer", "Rapper", "Leader", "All-Rounder"],
  "Actor": ["Film Actor", "TV Actor", "Action", "Drama", "Comedy", "Theatre"],
  "Singer": ["Pop", "R&B", "Rock", "Hip-Hop", "Independent"],
  "Model": ["Runway", "Commercial", "Editorial"],
  "Create Your Own Career": ["Independent", "Professional", "Founder"]
};
/* ==========================================
   IDOLVERSE — CAREER SYSTEM 2.0
========================================== */

const careerSystemV2 = {

  "Footballer": {
    category: "Athlete",
    title: "Professional Footballer",
    stats: [
      { key: "appearances", label: "Appearances" },
      { key: "goals", label: "Goals" },
      { key: "assists", label: "Assists" },
      { key: "trophies", label: "Trophies" },
      { key: "team", label: "Current Club", type: "text", initial: "Unattached" }
    ],
    milestones: [
      "Make your professional debut",
      "Score your first goal",
      "Win your first trophy",
      "Become a club legend"
    ]
  },

  "F1 Driver": {
    category: "Motorsport",
    title: "Professional Racing Driver",
    stats: [
      { key: "races", label: "Race Starts" },
      { key: "wins", label: "Race Wins" },
      { key: "podiums", label: "Podiums" },
      { key: "poles", label: "Pole Positions" },
      { key: "championships", label: "World Championships" },
      { key: "team", label: "Current Team", type: "text", initial: "Unattached" }
    ],
    milestones: [
      "Make your F1 debut",
      "Score your first points",
      "Achieve your first podium",
      "Win your first Grand Prix",
      "Become World Champion"
    ]
  },

  "Basketball Player": {
    category: "Athlete",
    title: "Professional Basketball Player",
    stats: [
      { key: "games", label: "Games Played" },
      { key: "points", label: "Points" },
      { key: "assists", label: "Assists" },
      { key: "rebounds", label: "Rebounds" },
      { key: "championships", label: "Championships" },
      { key: "team", label: "Current Team", type: "text", initial: "Unattached" }
    ],
    milestones: [
      "Make your professional debut",
      "Score 100 career points",
      "Become an All-Star",
      "Win your first championship"
    ]
  },

  "Tennis Player": {
    category: "Athlete",
    title: "Professional Tennis Player",
    stats: [
      { key: "matches", label: "Matches Played" },
      { key: "wins", label: "Match Wins" },
      { key: "titles", label: "Career Titles" },
      { key: "grandSlams", label: "Grand Slam Titles" },
      { key: "ranking", label: "World Ranking", initial: 1000 }
    ],
    milestones: [
      "Win your first professional match",
      "Enter the world top 100",
      "Win your first tournament",
      "Win a Grand Slam"
    ]
  },

  "K-pop Idol": {
    category: "Music",
    title: "K-pop Idol",
    stats: [
      { key: "debuted", label: "Debut Status", type: "text", initial: "Pre-debut" },
      { key: "releases", label: "Music Releases" },
      { key: "performances", label: "Performances" },
      { key: "fans", label: "Fanbase" },
      { key: "awards", label: "Awards" },
      { key: "group", label: "Group", type: "text", initial: "Solo / Independent" },
      { key: "agency", label: "Agency", type: "text", initial: "Independent" }
    ],
    milestones: [
      "Complete trainee training",
      "Make your official debut",
      "Release your first comeback",
      "Win your first music show",
      "Hold your first world tour"
    ]
  },

  "Actor": {
    category: "Entertainment",
    title: "Professional Actor",
    stats: [
      { key: "projects", label: "Acting Projects" },
      { key: "films", label: "Films" },
      { key: "series", label: "TV Series" },
      { key: "awards", label: "Awards" },
      { key: "boxOffice", label: "Box Office Earnings" }
    ],
    milestones: [
      "Land your first acting role",
      "Star in your first film",
      "Receive your first award nomination",
      "Win your first acting award"
    ]
  },

  "Singer": {
    category: "Music",
    title: "Professional Singer",
    stats: [
      { key: "songs", label: "Songs Released" },
      { key: "albums", label: "Albums" },
      { key: "streams", label: "Total Streams" },
      { key: "concerts", label: "Concerts" },
      { key: "awards", label: "Music Awards" }
    ],
    milestones: [
      "Release your first single",
      "Reach one million streams",
      "Release your first album",
      "Sell out your first concert"
    ]
  },

  "Model": {
    category: "Fashion",
    title: "Professional Model",
    stats: [
      { key: "campaigns", label: "Brand Campaigns" },
      { key: "runways", label: "Runway Shows" },
      { key: "covers", label: "Magazine Covers" },
      { key: "contracts", label: "Brand Contracts" }
    ],
    milestones: [
      "Book your first photoshoot",
      "Walk your first runway",
      "Land your first major campaign",
      "Become a global fashion ambassador"
    ]
  }

};


/* ---------- CAREER PROFILE CREATION ---------- */

function createCareerProgress(character) {
  const career = careerSystemV2[character.career];

  if (!career) {
    return {
      level: 1,
      xp: 0,
      stats: {},
      achievements: []
    };
  }

  const stats = {};

  career.stats.forEach(stat => {
    stats[stat.key] = stat.initial !== undefined
      ? stat.initial
      : stat.type === "text"
        ? "Not set"
        : 0;
  });

  return {
    level: 1,
    xp: 0,
    stats,
    achievements: []
  };
}


/* ---------- CAREER PROFILE VALIDATION ---------- */

function ensureCareerProgress(character) {
  if (!character.careerProgress) {
    character.careerProgress = createCareerProgress(character);
  }

  const career = careerSystemV2[character.career];

  if (career) {
    if (!character.careerProgress.stats) {
      character.careerProgress.stats = {};
    }

    career.stats.forEach(stat => {
      if (character.careerProgress.stats[stat.key] === undefined) {
        character.careerProgress.stats[stat.key] =
          stat.initial !== undefined
            ? stat.initial
            : stat.type === "text"
              ? "Not set"
              : 0;
      }
    });
  }

  character.careerProgress.level =
    Math.max(1, Number(character.careerProgress.level) || 1);

  character.careerProgress.xp =
    Math.max(0, Number(character.careerProgress.xp) || 0);

  if (!Array.isArray(character.careerProgress.achievements)) {
    character.careerProgress.achievements = [];
  }

  return character.careerProgress;
}


const personalities = [
  "Ambitious",
  "Confident",
  "Quiet",
  "Friendly",
  "Mysterious",
  "Funny",
  "Competitive",
  "Creative"
];

const appearances = {
  skin: ["Fair", "Light", "Medium", "Olive", "Tan", "Brown", "Deep"],
  hair: ["Short", "Medium", "Long", "Curly", "Wavy", "Braids", "Bun", "Ponytail"],
  hairColor: ["Black", "Brown", "Blonde", "Red", "Silver", "White", "Pink", "Blue"],
  eyes: ["Brown", "Dark Brown", "Blue", "Green", "Grey", "Hazel"],
  body: ["Slim", "Athletic", "Average", "Muscular", "Curvy"],
  outfit: ["Casual", "Streetwear", "Luxury", "Formal", "Sporty"],
  face: ["Oval", "Round", "Square", "Heart", "Diamond"],
  accessory: ["None", "Glasses", "Earrings", "Necklace", "Luxury Watch"]
};

const defaultAppearance = {
  skin: "Medium",
  hair: "Medium",
  hairColor: "Black",
  eyes: "Brown",
  body: "Average",
  outfit: "Casual",
  face: "Oval",
  accessory: "None"
};

const stepNames = [
  "IDENTITY",
  "FACE",
  "STYLE",
  "UNIVERSE",
  "YOUR NEW LIFE"
];

let saves = loadSaves();
let selectedSlot = null;
let currentStep = 1;
let wizard = null;
let toastTimer = null;

/* ---------- STORAGE ---------- */

function loadSaves() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.from({ length: TOTAL_SLOTS }, (_, i) =>
      normalizeCharacter(saved?.[i] || null)
    );
  } catch {
    return Array(TOTAL_SLOTS).fill(null);
  }
}

function saveSaves() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}


function normalizeCharacter(character) {
  if (!character) return null;

  const normalized = {
    ...character,
    gender: character.gender || "Prefer not to say",
    pronouns: character.pronouns || "They / Them",
    customPronouns: character.customPronouns || "",
    appearance: {
      ...defaultAppearance,
      ...(character.appearance || {})
    },
    level: Number(character.level) || 1,
    xp: Number(character.xp) || 0,
    money: Number(character.money) || 0,
    fame: Number(character.fame) || 0,
    reputation: Number(character.reputation) || 0,
    day: Number(character.day) || 1
  };

  ensureCareerProgress(normalized);

  return normalized;
}


/* ---------- HELPERS ---------- */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function showToast(message, type = "success") {
  document.querySelector(".iv-toast")?.remove();

  const toast = document.createElement("div");
  toast.className = `iv-toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.remove(), 2800);
}

function buttonChoices(options, selected, attribute) {
  return `
    <div class="choice-grid">
      ${options.map(option => `
        <button type="button"
          class="choice-card ${selected === option ? "selected" : ""}"
          ${attribute}="${escapeHTML(option)}">
          ${escapeHTML(option)}
        </button>
      `).join("")}
    </div>
  `;
}

function fieldHeading(title, description = "") {
  return `
    <div class="creator-heading">
      <h3>${escapeHTML(title)}</h3>
      ${description ? `<p>${escapeHTML(description)}</p>` : ""}
    </div>
  `;
}

function avatarPreview(character) {
  const a = character.appearance || defaultAppearance;

  const skinColors = {
    Fair: "#f3d2bd",
    Light: "#e8bd9e",
    Medium: "#c88e6b",
    Olive: "#b9825e",
    Tan: "#a96f4c",
    Brown: "#805039",
    Deep: "#503126"
  };

  const hairColors = {
    Black: "#17151a",
    Brown: "#493022",
    Blonde: "#d4b36d",
    Red: "#9d3d32",
    Silver: "#aaaab4",
    White: "#e5e1df",
    Pink: "#d77eae",
    Blue: "#557ab9"
  };

  const skin = skinColors[a.skin] || skinColors.Medium;
  const hair = hairColors[a.hairColor] || hairColors.Black;

  return `
    <div class="avatar-preview">
      <svg viewBox="0 0 220 250" width="220" height="250"
        role="img" aria-label="Character appearance preview">
        <ellipse cx="110" cy="232" rx="75" ry="9" fill="#000" opacity=".2"/>
        <path d="M53 220 Q52 169 82 158 L138 158 Q168 169 167 220 Z"
          fill="${a.outfit === "Luxury" ? "#b89a62" : a.outfit === "Sporty" ? "#526d91" : "#373c50"}"/>
        <rect x="96" y="137" width="28" height="35" rx="10" fill="${skin}"/>
        <ellipse cx="110" cy="96" rx="48" ry="61" fill="${skin}"/>
        <path d="M62 104 Q50 28 110 30 Q173 29 158 111
          Q151 68 132 58 Q100 78 66 67 Z" fill="${hair}"/>
        <path d="M63 91 Q54 127 72 151 L57 151 Q39 103 63 91"
          fill="${hair}"/>
        <path d="M157 91 Q174 125 150 151 L164 151 Q185 104 157 91"
          fill="${hair}"/>
        <ellipse cx="91" cy="103" rx="5" ry="3" fill="#34251f"/>
        <ellipse cx="129" cy="103" rx="5" ry="3" fill="#34251f"/>
        <path d="M108 108 L103 126 L112 128" fill="none"
          stroke="#8d5d48" stroke-width="2" stroke-linecap="round"/>
        <path d="M99 140 Q110 147 121 140" fill="none"
          stroke="#934e4e" stroke-width="2.5" stroke-linecap="round"/>
        ${a.accessory === "Glasses" ? `
          <g fill="none" stroke="#d8c18d" stroke-width="2.5">
            <rect x="77" y="93" width="28" height="20" rx="7"/>
            <rect x="115" y="93" width="28" height="20" rx="7"/>
            <path d="M105 102 L115 102"/>
          </g>` : ""}
        ${a.accessory === "Earrings" ? `
          <circle cx="61" cy="127" r="4" fill="#e8cc8e"/>
          <circle cx="159" cy="127" r="4" fill="#e8cc8e"/>` : ""}
      </svg>
      <div class="avatar-label">
        ${escapeHTML(a.hairColor)} HAIR · ${escapeHTML(a.outfit)} STYLE
      </div>
    </div>
  `;
}

/* ---------- WELCOME AND SAVE SLOTS ---------- */

function showWelcome() {currentScreen = "welcome";
  app.innerHTML = `
    <main class="welcome">
      <div class="brand">IDOL<span>VERSE</span></div>
      <div class="edition">THE REBORN EXPERIENCE</div>
      <section class="hero">
        <p class="eyebrow">A UNIVERSE WITHOUT LIMITS</p>
        <h1>Your life.<br><em>Your story.</em><br>Your universe.</h1>
        <p class="intro">
          Become anyone. Live anywhere. Build relationships,
          chase your dreams and create a life that is entirely yours.
        </p>
        <button id="begin">ENTER IDOLVERSE <span>↗</span></button>
      </section>
      <footer>
        <span>FIVE LIVES. INFINITE POSSIBILITIES.</span>
        <span>EST. 2026</span>
      </footer>
    </main>
  `;
}

function showLives() {currentScreen = "lives";
  app.innerHTML = `
    <main class="welcome lives-screen"><div class="game-navigation">
  <button data-nav-back>← BACK</button>
  <button data-nav-home>⌂ HOME</button>
  <button data-nav-lives>MY LIVES</button>
</div>
      <div class="brand">IDOL<span>VERSE</span></div>
      <p class="eyebrow">YOUR JOURNEY STARTS HERE</p>
      <h1>Choose your <em>life.</em></h1>
      <p class="intro">Every slot is a different identity, a different world and a different story.</p>

      <div class="save-grid">
        ${saves.map((character, index) => `
          <div class="save-slot ${character ? "occupied" : "empty"}">
            <button class="save-card" data-slot="${index}">
              <span class="save-number">LIFE ${String(index + 1).padStart(2, "0")}</span>
              ${character ? `
                <strong>${escapeHTML(character.name)}</strong>
                <span>${escapeHTML(character.world)} · ${escapeHTML(character.career)}</span>
                <span class="save-career">LEVEL ${character.level} · DAY ${character.day}</span>
              ` : `
                <strong>New Life</strong>
                <span>An empty universe awaits.</span>
                <span class="save-plus">＋</span>
              `}
            </button>
            ${character ? `
              <button class="delete-slot-button" data-delete-slot="${index}">
                DELETE LIFE
              </button>
            ` : ""}
          </div>
        `).join("")}
      </div>

      <button class="secondary-button" id="home">← BACK TO WELCOME</button>
    </main>
  `;
}

/* ---------- CHARACTER CREATOR ---------- */

function startCreator(slot) {currentScreen = "creator";
  selectedSlot = slot;
  currentStep = 1;

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
    appearance: { ...defaultAppearance }
  };

  renderWizard();
}

function renderWizard() {
  let content = "";

  if (currentStep === 1) {
    content = `
      ${fieldHeading("Who are you?", "Every great story begins with an identity.")}

      <div class="creator-field">
        <label>Character name</label>
        <input class="creator-input" data-field="name"
          value="${escapeHTML(wizard.name)}" placeholder="Enter your name">
      </div>

      <div class="creator-field">
        <label>Hometown</label>
        <input class="creator-input" data-field="hometown"
          value="${escapeHTML(wizard.hometown)}" placeholder="Where are you from?">
      </div>

      ${fieldHeading("Gender")}
      ${buttonChoices(
        ["Male", "Female", "Non-binary", "Other", "Prefer not to say"],
        wizard.gender,
        "data-gender"
      )}

      ${fieldHeading("Pronouns")}
      ${buttonChoices(
        ["He / Him", "She / Her", "They / Them", "Custom"],
        wizard.pronouns,
        "data-pronouns"
      )}

      ${wizard.pronouns === "Custom" ? `
        <label>Custom pronouns</label>
        <input class="creator-input" data-field="customPronouns"
          value="${escapeHTML(wizard.customPronouns)}"
          placeholder="Enter your pronouns">
      ` : ""}
      <p class="creator-note">Your gender and pronouns never restrict your career, clothing, appearance or relationships.</p>
    `;
  }

  if (currentStep === 2) {
    content = `
      ${fieldHeading("Your face", "Choose the features that make your character unique.")}

      ${fieldHeading("Skin tone")}
      ${buttonChoices(appearances.skin, wizard.appearance.skin, "data-appearance-skin")}

      ${fieldHeading("Face shape")}
      ${buttonChoices(appearances.face, wizard.appearance.face, "data-appearance-face")}

      ${avatarPreview(wizard)}
    `;
  }

  if (currentStep === 3) {
    content = `
      ${fieldHeading("Your personal style", "Build a look that represents you.")}

      ${Object.entries({
        hair: "Hairstyle",
        hairColor: "Hair colour",
        eyes: "Eye colour",
        body: "Body type",
        outfit: "Clothing style",
        accessory: "Accessories"
      }).map(([key, label]) => `
        ${fieldHeading(label)}
        ${buttonChoices(
          appearances[key],
          wizard.appearance[key],
          `data-appearance-${key}`
        )}
      `).join("")}

      ${avatarPreview(wizard)}
    `;
  }

  if (currentStep === 4) {
    const careerOptions = careers[wizard.world] || ["Create Your Own Career"];
    if (!careerOptions.includes(wizard.career)) {
      wizard.career = careerOptions[0];
    }

    const paths = careerPaths[wizard.career] || ["Independent", "Professional", "Specialist"];
    if (!paths.includes(wizard.careerPath)) {
      wizard.careerPath = paths[0];
    }

    content = `
      ${fieldHeading("Choose your universe", "Where will your story begin?")}
      ${buttonChoices(worlds, wizard.world, "data-world")}

      ${fieldHeading("Choose your career")}
      ${buttonChoices(careerOptions, wizard.career, "data-career")}

      ${fieldHeading("Choose your specialisation")}
      ${buttonChoices(paths, wizard.careerPath, "data-path")}

      ${fieldHeading("Your personality")}
      ${buttonChoices(personalities, wizard.personality, "data-personality")}
    `;
  }

  if (currentStep === 5) {
    content = `
      ${fieldHeading("Your new life awaits", "Review your identity before entering the universe.")}

      ${avatarPreview(wizard)}

      <div class="character-review">
        <h2>${escapeHTML(wizard.name || "Your Character")}</h2>
        <p>${escapeHTML(wizard.world)} · ${escapeHTML(wizard.career)}</p>

        <div class="review-line"><span>Gender</span><strong>${escapeHTML(wizard.gender)}</strong></div>
        <div class="review-line"><span>Pronouns</span><strong>${escapeHTML(wizard.pronouns === "Custom" ? wizard.customPronouns : wizard.pronouns)}</strong></div>
        <div class="review-line"><span>Hometown</span><strong>${escapeHTML(wizard.hometown || "Not specified")}</strong></div>
        <div class="review-line"><span>Career path</span><strong>${escapeHTML(wizard.careerPath)}</strong></div>
        <div class="review-line"><span>Personality</span><strong>${escapeHTML(wizard.personality)}</strong></div>
      </div>
    `;
  }

  
app.innerHTML = `
    <main class="welcome creator-screen">

      <div class="game-navigation">
        <button data-navBack>← BACK</button>
        <button data-navHome>⌂ HOME</button>
        <button data-navLives>MY LIVES</button>
      </div>

      <div class="brand">IDOL<span>VERSE</span></div>

      <p class="eyebrow">CREATE YOUR IDENTITY · STEP ${currentStep} OF 5</p>
      <div class="wizard-progress">
        <div class="progress-step" style="width:${currentStep * 20}%"></div>
      </div>
      <p class="step-name">${stepNames[currentStep - 1]}</p>
      <section class="creator-content">${content}</section>
      <div class="creator-navigation">
        <button class="secondary-button" data-back>BACK</button>
        ${currentStep < 5
          ? `<button data-next>CONTINUE →</button>`
          : `<button data-finish>CREATE MY LIFE ✨</button>`}
      </div>
    </main>
  `;
}

function captureFields() {
  document.querySelectorAll("[data-field]").forEach(input => {
    wizard[input.dataset.field] = input.value.trim();
  });
}

function nextStep() {
  captureFields();

  if (currentStep === 1 && !wizard.name) {
    showToast("Please enter your character's name.", "error");
    return;
  }

  if (currentStep === 1 && wizard.pronouns === "Custom" && !wizard.customPronouns) {
    showToast("Please enter your custom pronouns.", "error");
    return;
  }

  if (currentStep < 5) {
    currentStep++;
    renderWizard();
  }
}

function previousStep() {
  captureFields();

  if (currentStep > 1) {
    currentStep--;
    renderWizard();
  } else {
    showLives();
  }
}

function finishCreation() {
  captureFields();

  if (!wizard.name) {
    showToast("Please enter your character's name.", "error");
    currentStep = 1;
    renderWizard();
    return;
  }

  const character = {
    ...wizard,
    appearance: { ...wizard.appearance },
    level: 1,
    xp: 0,
    money: 1000,
    fame: 0,
    reputation: 0,
    day: 1,
    rank: "Beginner",
    createdAt: new Date().toISOString()
  };

  saves[selectedSlot] = character;
  saveSaves();

  showToast("Your new life has begun!");
  openLife(selectedSlot);
}

/* ---------- CHARACTER PROFILE ---------- */

function openLife(slot) {currentScreen = "dashboard";
  selectedSlot = slot;
  const character = saves[slot];

  if (!character) {
    startCreator(slot);
    return;
  }

  const level = Math.max(1, Number(character.level) || 1);
  const xp = Math.max(0, Number(character.xp) || 0);
  const threshold = level * 100;
  const progress = Math.min(100, (xp / threshold) * 100);
  const remainingXP = Math.max(0, threshold - xp);
  const career = careerSystemV2[character.career];
  const careerProgress = ensureCareerProgress(character);

  const careerStatsHTML = career
    ? career.stats.map(stat => {
        const value = careerProgress.stats[stat.key];

        return `
          <div class="stat">
            ${escapeHTML(stat.label.toUpperCase())}
            <strong>
              ${typeof value === "number"
                ? value.toLocaleString()
                : escapeHTML(String(value))}
            </strong>
          </div>
        `;
      }).join("")
    : `<p class="creator-note">Career statistics coming soon!</p>`;

  const careerMilestonesHTML = career
    ? career.milestones.map(milestone => `
        <div class="career-milestone">
          <span>◇</span>
          ${escapeHTML(milestone)}
        </div>
      `).join("")
    : "";


  app.innerHTML = `
    <main class="welcome life-dashboard dashboard-v2">

   <div class="game-navigation">
  <button data-nav-back>← BACK</button>
  <button data-nav-home>⌂ HOME</button>
  <button data-nav-lives>MY LIVES</button>
</div>   <div class="brand">IDOL<span>VERSE</span></div>
      <p class="eyebrow">YOUR LIFE · YOUR STORY</p>

      <section class="dashboard-identity">
        ${avatarPreview(character)}

        <div class="dashboard-intro">
          <span class="dashboard-label">PLAYER PROFILE</span>
          <h1>${escapeHTML(character.name)}</h1>

          <div class="character-details">
            <span>${escapeHTML(character.world)}</span>
            <span>${escapeHTML(character.career)}</span>
            <span>${escapeHTML(character.careerPath)}</span>
          </div>
        </div>
      </section>

      <section class="dashboard-level">
        <div class="level-heading">
          <div>
            <span class="dashboard-label">CURRENT RANK</span>
            <h2>${escapeHTML(character.rank || "Beginner")}</h2>
          </div>

          <div class="level-number">
            <span>LEVEL</span>
            <strong>${level}</strong>
          </div>
        </div>

        <div class="xp-information">
          <span>EXPERIENCE PROGRESS</span>
          <strong>${xp} / ${threshold} XP</strong>
        </div>

        <div
          class="xp-track"
          role="progressbar"
          aria-valuenow="${Math.round(progress)}"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Experience progress"
        >
          <div
            class="xp-fill"
            style="width: ${progress}%"
          ></div>
        </div>

        <p class="xp-remaining">
          ${remainingXP} XP remaining until your next level
        </p>
      </section>

      <section class="dashboard-stats">
        <div class="dashboard-section-heading">
          <span class="dashboard-label">YOUR PROGRESS</span>
          <h3>Life Statistics</h3>
        </div>

        <div class="grid">
          <div class="stat">
            EXPERIENCE
            <strong>${xp} XP</strong>
          </div>

          <div class="stat">
            MONEY
            <strong>$${Number(character.money || 0).toLocaleString()}</strong>
          </div>

          <div class="stat">
            FAME
            <strong>${character.fame || 0}</strong>
          </div>

          <div class="stat">
            REPUTATION
            <strong>${character.reputation || 0}</strong>
          </div>
        </div>
      </section>

      <section class="dashboard-personal">
<section class="dashboard-career">
  <div class="dashboard-section-heading">
    <span class="dashboard-label">YOUR PROFESSION</span>
    <h3>Career Statistics</h3>
    <p>${escapeHTML(career ? career.title : character.career)}</p>
  </div>

  <div class="grid">
    ${careerStatsHTML}
  </div>

  ${career ? `
    <div class="career-progression">
      <span class="dashboard-label">CAREER PROGRESSION</span>
      <h3>Career Level ${careerProgress.level}</h3>
      <p>${careerProgress.xp} Career XP</p>
    </div>

    <div class="career-milestones">
      <span class="dashboard-label">CAREER MILESTONES</span>
      ${careerMilestonesHTML}
    </div>
  ` : ""}
</section>

        <div class="dashboard-section-heading">
          <span class="dashboard-label">GET TO KNOW YOU</span>
          <h3>Personal Information</h3>
        </div>

        <div class="profile-info">
          <div>
            <span>GENDER</span>
            <strong>${escapeHTML(character.gender)}</strong>
          </div>

          <div>
            <span>PRONOUNS</span>
            <strong>${escapeHTML(
              character.pronouns === "Custom"
                ? character.customPronouns
                : character.pronouns
            )}</strong>
          </div>

          <div>
            <span>HOMETOWN</span>
            <strong>${escapeHTML(character.hometown || "Not specified")}</strong>
          </div>

          <div>
            <span>PERSONALITY</span>
            <strong>${escapeHTML(character.personality)}</strong>
          </div>

          <div>
            <span>IN-GAME DAY</span>
            <strong>DAY ${character.day}</strong>
          </div>
        </div>
      </section>

      <section class="profile-actions">
        <button id="advance-day">
          CONTINUE YOUR STORY →
        </button>

        <button class="secondary-button" id="switch-life">
          SWITCH LIFE
        </button>

        <button class="danger-button" id="delete-current">
          DELETE THIS LIFE
        </button>
      </section>

    </main>
  `;
}



/* ---------- GAME PROGRESSION ---------- */

function advanceDay() {
  const character = saves[selectedSlot];
  if (!character) return;

  character.day++;
  character.xp += 50;
  character.money += 100;

  const threshold = character.level * 100;

  if (character.xp >= threshold) {
    character.xp -= threshold;
    character.level++;
    character.rank = character.level >= 10
      ? "Rising Star"
      : character.level >= 5
        ? "Professional"
        : "Rising Talent";

    showToast(`LEVEL UP! You are now level ${character.level}!`);
  } else {
    showToast("A new day begins. +50 XP · +$100");
  }

  saveSaves();
  openLife(selectedSlot);
}

/* ---------- DELETE CONFIRMATION ---------- */

function deleteLife(slot) {
  const character = saves[slot];
  if (!character) return;

  document.querySelector(".delete-modal-backdrop")?.remove();

  const backdrop = document.createElement("div");
  backdrop.className = "delete-modal-backdrop";

  backdrop.innerHTML = `
    <div class="delete-modal" role="dialog" aria-modal="true">
      <div class="delete-modal-symbol">!</div>
      <p class="eyebrow">ARE YOU ABSOLUTELY SURE?</p>
      <h2>Delete this life?</h2>
      <div class="delete-character-name">${escapeHTML(character.name)}</div>
      <p class="delete-warning">
        This will permanently erase this character and their saved progress
        from this device. This action cannot be undone.
      </p>
      <div class="delete-protection">
        Your other save slots will not be affected.
      </div>
      <div class="delete-modal-actions">
        <button class="secondary-button" data-cancel-delete>KEEP MY LIFE</button>
        <button class="danger-button" data-confirm-delete="${slot}">DELETE PERMANENTLY</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.classList.add("modal-open");
}

function closeDeleteModal() {
  document.querySelector(".delete-modal-backdrop")?.remove();
  document.body.classList.remove("modal-open");
}

function confirmDelete(slot) {
  if (!saves[slot]) return;

  saves[slot] = null;
  saveSaves();
  closeDeleteModal();
  showLives();
  showToast("Life deleted. Your other lives are safe.");
}

/* ---------- EVENT HANDLING ---------- */
document.addEventListener("click", event => {
  const target = event.target.closest("button");
  if (!target) return;


if (target.dataset.navBack !== undefined) {
  goBack();
  return;
}
if (target.dataset.navHome !== undefined) {
  navigateTo(showWelcome);
  return;

}

if (target.dataset.navLives !== undefined) {
  navigateTo(showLives);
  return;
}

if (target.id === "begin") {
  navigateTo(showLives);
  return;
}

if (target.id === "home") {
  navigationHistory = [];
  showWelcome();
  return;
}

if (target.dataset.slot !== undefined) {
  const slot = Number(target.dataset.slot);

  if (saves[slot]) {
    navigateTo(openLife, slot);
  } else {
    navigateTo(startCreator, slot);
  }
  return;
}


  if (target.dataset.deleteSlot !== undefined) {
    deleteLife(Number(target.dataset.deleteSlot));
    return;
  }

  if (target.dataset.back !== undefined) {
    previousStep();
    return;
  }

  if (target.dataset.next !== undefined) {
    nextStep();
    return;
  }

  if (target.dataset.finish !== undefined) {
    finishCreation();
    return;
  }

  if (target.dataset.gender) {
    wizard.gender = target.dataset.gender;
    renderWizard();
    return;
  }

  if (target.dataset.pronouns) {
    wizard.pronouns = target.dataset.pronouns;
    renderWizard();
    return;
  }

  if (target.dataset.world) {
    wizard.world = target.dataset.world;
    wizard.career = (careers[wizard.world] || ["Create Your Own Career"])[0];
    wizard.careerPath = (careerPaths[wizard.career] || ["Independent"])[0];
    renderWizard();
    return;
  }

  if (target.dataset.career) {
    wizard.career = target.dataset.career;
    wizard.careerPath = (careerPaths[wizard.career] || ["Independent"])[0];
    renderWizard();
    return;
  }

  if (target.dataset.path) {
    wizard.careerPath = target.dataset.path;
    renderWizard();
    return;
  }

  if (target.dataset.personality) {
    wizard.personality = target.dataset.personality;
    renderWizard();
    return;
  }

  if (target.dataset.appearanceSkin) {
    wizard.appearance.skin = target.dataset.appearanceSkin;
    renderWizard();
    return;
  }

  if (target.dataset.appearanceFace) {
    wizard.appearance.face = target.dataset.appearanceFace;
    renderWizard();
    return;
  }

  for (const key of Object.keys(appearances)) {
    const attribute = `appearance${key.charAt(0).toUpperCase()}${key.slice(1)}`;

    if (target.dataset[attribute]) {
      wizard.appearance[key] = target.dataset[attribute];
      renderWizard();
      return;
    }
  }

  if (target.id === "advance-day") {
    advanceDay();
  }

  if (target.id === "switch-life") {
    showLives();
    return;
  }

  if (target.id === "delete-current") {
    deleteLife(selectedSlot);
    return;
  }

  if (target.dataset.cancelDelete !== undefined) {
    closeDeleteModal();
    return;
  }

  if (target.dataset.confirmDelete !== undefined) {
    confirmDelete(Number(target.dataset.confirmDelete));
  }
});

document.addEventListener("input", event => {
  if (event.target.matches("[data-field]") && wizard) {
    wizard[event.target.dataset.field] = event.target.value.trim();
  }
});

document.addEventListener("click", event => {
  const backdrop = event.target;
  if (backdrop.classList?.contains("delete-modal-backdrop")) {
    closeDeleteModal();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeDeleteModal();
  }
});

/* ---------- START APP ---------- */

showWelcome();
