
const STORE = "idolverse_reborn_saves";

let saves = JSON.parse(localStorage.getItem(STORE) || "[]");

const worlds = [
  "Hollywood",
  "K-Pop",
  "Japanese Entertainment",
  "Fashion",
  "Sports",
  "Custom Universe"
];

function saveData() {
  localStorage.setItem(STORE, JSON.stringify(saves));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

document.getElementById("begin").addEventListener("click", showLives);

function showLives() {
  document.querySelector(".hero").innerHTML = `
    <p class="eyebrow">YOUR STORY STARTS HERE</p>
    <h1>Choose your <em>life.</em></h1>
    <p class="intro">Five separate lives. Five different destinies. Your choices shape every universe.</p>
    <div class="save-grid" id="saveGrid"></div>
    <p class="save-note">YOUR WORLDS ARE SAVED ON THIS DEVICE</p>
  `;

  renderLives();
}

function renderLives() {
  const grid = document.getElementById("saveGrid");

  grid.innerHTML = Array.from({ length: 5 }, (_, index) => {
    const save = saves[index];

    return `
      <div class="save-card">
        <span class="save-number">LIFE 0${index + 1}</span>
        ${
          save
            ? `
              <h2>${escapeHTML(save.name)}</h2>
              <p>${escapeHTML(save.world)} · ${escapeHTML(save.career)}</p>
              <button onclick="openLife(${index})">CONTINUE ↗</button>
            `
            : `
              <h2>Empty Universe</h2>
              <p>A new story is waiting.</p>
              <button onclick="createLife(${index})">CREATE LIFE +</button>
            `
        }
      </div>
    `;
  }).join("");
}

function createLife(index) {
  const name = prompt("What is your character's name?");
  if (!name || !name.trim()) return;

  const world = prompt(
    "Choose your world:\n" +
    worlds.map((world, i) => `${i + 1}. ${world}`).join("\n")
  );

  const worldChoice = worlds[Number(world) - 1];
  if (!worldChoice) {
    alert("Please choose a valid world number.");
    return;
  }

  const career = prompt(
    "Who do you want to become?\n" +
    "Examples: Actor, K-pop Idol, Singer, Model, Athlete, Student, Entrepreneur"
  );

  if (!career || !career.trim()) return;

  saves[index] = {
    id: crypto.randomUUID(),
    name: name.trim(),
    world: worldChoice,
    career: career.trim(),
    day: 1,
    money: 10000,
    fame: 0,
    reputation: 50,
    createdAt: new Date().toISOString()
  };

  saveData();
  openLife(index);
}

function openLife(index) {
  const life = saves[index];
  if (!life) return;

  document.querySelector(".hero").innerHTML = `
    <p class="eyebrow">WELCOME TO YOUR NEW REALITY</p>
    <h1>${escapeHTML(life.name)}'s <em>story.</em></h1>
    <div class="life-dashboard">
      <div class="stat">
        <span>WORLD</span>
        <h2>${escapeHTML(life.world)}</h2>
      </div>
      <div class="stat">
        <span>CAREER</span>
        <h2>${escapeHTML(life.career)}</h2>
      </div>
      <div class="stat">
        <span>IN-GAME DAY</span>
        <h2>${life.day}</h2>
      </div>
      <div class="stat">
        <span>MONEY</span>
        <h2>$${life.money.toLocaleString()}</h2>
      </div>
      <div class="stat">
        <span>FAME</span>
        <h2>${life.fame}</h2>
      </div>
      <div class="stat">
        <span>REPUTATION</span>
        <h2>${life.reputation}</h2>
      </div>
    </div>
    <p class="intro">Your universe is waiting. This is only the beginning.</p>
    <button onclick="advanceDay(${index})">START YOUR DAY ↗</button>
    <button class="secondary" onclick="showLives()">SWITCH LIFE</button>
  `;
}

function advanceDay(index) {
  saves[index].day += 1;
  saveData();
  openLife(index);
}
