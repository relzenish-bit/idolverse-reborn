
const STORE = "idolverse_reborn_saves";
const saves = JSON.parse(localStorage.getItem(STORE) || "[]");

const app = document.querySelector("#app");

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

const worlds = ["Hollywood", "K-Pop", "Japanese Entertainment", "Fashion", "Sports", "Custom Universe"];
const careers = ["Actor", "K-pop Idol", "Singer", "Model", "Athlete", "Influencer", "Entrepreneur", "Student", "Ordinary Life"];
const personalities = ["Ambitious", "Charming", "Quiet", "Confident", "Rebellious", "Kind-hearted", "Mysterious"];

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

let wizard = {};
let currentSlot = 0;
let step = 1;

function save() {
  localStorage.setItem(STORE, JSON.stringify(saves));
}

function begin() {
  showLives();
}

function showLives() {
  app.innerHTML = `
    <main class="welcome">
      <div class="brand">IDOL<span>VERSE</span></div>
      <p class="eyebrow">CHOOSE YOUR LIFE</p>
      <h1>Every life has<br><em>a story.</em></h1>
      <div class="save-grid">
        ${Array.from({length:5}, (_,i) => {
          const s = saves[i];
          return `<button class="save-card" data-slot="${i}">
            <span class="save-number">LIFE 0${i+1}</span>
            <strong>${s ? escapeHTML(s.name) : "Empty Life"}</strong>
            <span>${s ? escapeHTML(s.career || "New Life") : "Create a new identity"}</span>
          </button>`;
        }).join("")}
      </div>
      <button id="home">BACK</button>
    </main>`;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[c]);
}

function startCreator(slot) {
  currentSlot = slot;
  step = 1;
  wizard = {
    name: "",
    hometown: "",
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

function avatarPreview() {
  const a = wizard.appearance;
  const skinColors = {
    Porcelain:"#f5dfd1", Fair:"#edc5a8", Light:"#dca77e",
    Olive:"#c68b60", Tan:"#b8794e", Caramel:"#a66a43",
    Brown:"#805034", "Deep Brown":"#603b2c", "Dark":"#40271f"
  };
  const hairColors = {
    Black:"#171514", "Dark Brown":"#38251d", Chocolate:"#51301f",
    Chestnut:"#81472b", Blonde:"#d7b45f", Platinum:"#e8e1cf",
    Silver:"#a9abb4", Red:"#a42d28", Auburn:"#9b4d2e",
    Pink:"#e78eb9", Blue:"#3976bd", Purple:"#8757b6",
    Green:"#4b9468", Rainbow:"linear-gradient(90deg,#e66,#ed6,#6c9,#69e,#b7e)"
  };
  const skin = skinColors[a.skin];
  const hair = hairColors[a.hairColor];

  return `<div class="avatar-preview">
    <div class="avatar-hair" style="background:${hair}"></div>
    <div class="avatar-face" style="background:${skin};border-radius:${a.face==="Round"?"48%":a.face==="Square"?"22%":a.face==="Heart"?"45% 45% 35% 35%":"42%"}">
      <div class="avatar-eyes">●　●</div>
      <div class="avatar-nose"></div>
      <div class="avatar-mouth"></div>
    </div>
    <div class="avatar-neck" style="background:${skin}"></div>
    <div class="avatar-body">${escapeHTML(a.outfit)}</div>
    <div class="avatar-label">${escapeHTML(a.hair)} · ${escapeHTML(a.body)}</div>
  </div>`;
}

function selectOptions(key, label) {
  return `<div class="creator-field">
    <label>${label}</label>
    <div class="choice-grid">
      ${options[key].map(value => `
        <button class="choice-card ${wizard.appearance[key]===value?"selected":""}"
          data-appearance="${key}" data-value="${escapeHTML(value)}">
          ${escapeHTML(value)}
        </button>`).join("")}
    </div>
  </div>`;
}

function renderWizard() {
  let content = "";

  if (step === 1) {
    content = `
      <h2>Who are you?</h2>
      <input class="creator-input" id="charName" placeholder="Character name" value="${escapeHTML(wizard.name)}">
      <input class="creator-input" id="hometown" placeholder="Hometown / City" value="${escapeHTML(wizard.hometown)}">
      <h3>Your appearance</h3>
      ${avatarPreview()}
      ${selectOptions("skin","Skin tone")}
      ${selectOptions("face","Face shape")}
    `;
  }

  if (step === 2) {
    content = `
      <h2>Your hairstyle</h2>
      ${avatarPreview()}
      ${selectOptions("hair","Hairstyle")}
      ${selectOptions("hairColor","Hair colour")}
      ${selectOptions("eyes","Eye colour")}
    `;
  }

  if (step === 3) {
    content = `
      <h2>Your style</h2>
      ${avatarPreview()}
      ${selectOptions("body","Body type")}
      ${selectOptions("outfit","Outfit")}
      ${selectOptions("accessory","Accessories")}
    `;
  }

  if (step === 4) {
    content = `
      <h2>Choose your universe</h2>
      <div class="choice-grid">${worlds.map(w => `<button class="choice-card ${wizard.world===w?"selected":""}" data-world="${escapeHTML(w)}">${escapeHTML(w)}</button>`).join("")}</div>
      <h2>Choose your career</h2>
      <div class="choice-grid">${careers.map(c => `<button class="choice-card ${wizard.career===c?"selected":""}" data-career="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join("")}</div>
      <h3>Choose your path</h3>
      <div class="choice-grid">${(careerPaths[wizard.career] || ["Custom Path"]).map(p => `<button class="choice-card ${wizard.careerPath===p?"selected":""}" data-path="${escapeHTML(p)}">${escapeHTML(p)}</button>`).join("")}</div>
      <h3>Personality</h3>
      <div class="choice-grid">${personalities.map(p => `<button class="choice-card ${wizard.personality===p?"selected":""}" data-personality="${escapeHTML(p)}">${escapeHTML(p)}</button>`).join("")}</div>
    `;
  }

  app.innerHTML = `
    <main class="welcome creator-screen">
      <div class="brand">IDOL<span>VERSE</span></div>
      <p class="eyebrow">CREATE YOUR IDENTITY · STEP ${step} OF 4</p>
      <div class="wizard-progress"><div class="progress-step" style="width:${step*25}%"></div></div>
      <section class="creator-content">${content}</section>
      <div class="creator-navigation">
        ${step>1?'<button data-back>BACK</button>':""}
        ${step<4?'<button data-next>CONTINUE →</button>':'<button data-finish>CREATE MY LIFE ✨</button>'}
      </div>
    </main>`;
}

function finishCreation() {
  wizard.name = document.querySelector("#charName")?.value.trim() || wizard.name;
  wizard.hometown = document.querySelector("#hometown")?.value.trim() || wizard.hometown;

  if (!wizard.name) {
    alert("Please enter your character's name first.");
    return;
  }

  const character = {
    ...wizard,
    id: Date.now().toString(),
    day: 1,
    money: 10000,
    fame: 0,
    reputation: 50,
    xp: 0,
    level: 1,
    rank: "Beginner",
    createdAt: Date.now()
  };

  saves[currentSlot] = character;
  save();
  openLife(currentSlot);
}

function openLife(slot) {
  const s = saves[slot];
  app.innerHTML = `
    <main class="welcome life-dashboard">
      <div class="brand">IDOL<span>VERSE</span></div>
      ${avatarPreviewFor(s)}
      <p class="eyebrow">${escapeHTML(s.world)} · ${escapeHTML(s.careerPath)}</p>
      <h1>Welcome,<br><em>${escapeHTML(s.name)}.</em></h1>
      <div class="grid">
        <div class="stat">LEVEL<strong>${s.level}</strong></div>
        <div class="stat">XP<strong>${s.xp}</strong></div>
        <div class="stat">FAME<strong>${s.fame}</strong></div>
        <div class="stat">MONEY<strong>$${s.money.toLocaleString()}</strong></div>
      </div>
      <h3>RANK · ${escapeHTML(s.rank)}</h3>
      <p>Day ${s.day} · ${escapeHTML(s.personality)}</p>
      <button data-day>ADVANCE DAY →</button>
      <button data-lives>SWITCH LIFE</button>
    </main>`;
}

function avatarPreviewFor(s) {
  const old = wizard;
  wizard = s;
  const result = avatarPreview();
  wizard = old;
  return result;
}

function advanceDay() {
  const s = saves[currentSlot];
  s.day++;
  s.xp += 50;
  if (s.xp >= s.level * 200) {
    s.xp = 0;
    s.level++;
    s.rank = s.level >= 10 ? "Rising Star" : s.level >= 5 ? "Rookie" : "Beginner";
    alert("LEVEL UP! Welcome to level " + s.level + "!");
  }
  save();
  openLife(currentSlot);
}

app.addEventListener("click", event => {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.id === "begin") begin();
  if (target.id === "home") location.reload();

  if (target.dataset.slot !== undefined) {
    const slot = Number(target.dataset.slot);
    if (saves[slot]) {
      currentSlot = slot;
      openLife(slot);
    } else {
      startCreator(slot);
    }
  }

  if (target.hasAttribute("data-next")) {
    if (step === 1) {
      wizard.name = document.querySelector("#charName")?.value.trim() || "";
      wizard.hometown = document.querySelector("#hometown")?.value.trim() || "";
      if (!wizard.name) {
        alert("Please enter your character's name.");
        return;
      }
    }
    step++;
    renderWizard();
  }

  if (target.hasAttribute("data-back")) {
    step--;
    renderWizard();
  }

  if (target.dataset.appearance) {
    wizard.appearance[target.dataset.appearance] = target.dataset.value;
    renderWizard();
  }

  if (target.dataset.world) {
    wizard.world = target.dataset.world;
    renderWizard();
  }

  if (target.dataset.career) {
    wizard.career = target.dataset.career;
    wizard.careerPath = careerPaths[wizard.career][0];
    renderWizard();
  }

  if (target.dataset.path) {
    wizard.careerPath = target.dataset.path;
    renderWizard();
  }

  if (target.dataset.personality) {
    wizard.personality = target.dataset.personality;
    renderWizard();
  }

  if (target.hasAttribute("data-finish")) finishCreation();
  if (target.hasAttribute("data-day")) advanceDay();
  if (target.hasAttribute("data-lives")) showLives();
});
