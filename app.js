const beginButton = document.getElementById("begin");

beginButton.addEventListener("click", () => {
  document.querySelector(".hero").innerHTML = `
    <p class="eyebrow">WELCOME TO YOUR NEW REALITY</p>
    <h1>Choose your <em>universe.</em></h1>
    <p class="intro">
      Five lives are waiting for you.
      Every choice creates a different story.
    </p>
    <div class="world-preview">
      <div class="world-card">
        <span>01</span>
        <h2>Hollywood</h2>
        <p>Lights. Cameras. Stardom.</p>
      </div>
      <div class="world-card">
        <span>02</span>
        <h2>K-Pop</h2>
        <p>Music. Fame. Your stage.</p>
      </div>
      <div class="world-card">
        <span>03</span>
        <h2>Beyond</h2>
        <p>Create your own universe.</p>
      </div>
    </div>
    <button onclick="showComingSoon()">EXPLORE YOUR LIFE ↗</button>
  `;
});

function showComingSoon() {
  alert("Your universe is being prepared. The adventure begins soon!");
}
