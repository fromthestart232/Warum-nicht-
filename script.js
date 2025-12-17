const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Sterne
const stars = Array.from({ length: 120 }, () => {
  const isRose = Math.random() < 0.25;
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4,
    s: Math.random() * 0.35 + 0.15,
    color: isRose ? "#F7CAC9" : "#5DADE2"
  };
});

let particleList = [];

// Zeichnen
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sterne
  stars.forEach(star => {
    star.y += star.s;
    if (star.y > canvas.height) star.y = 0;
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Partikel
  for (let i = particleList.length - 1; i >= 0; i--) {
    const p = particleList[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.008;        // langsam verblassen
    if (p.alpha < 0) p.alpha = 0;
    drawParticle(p);
    if (p.alpha === 0) particleList.splice(i, 1);
  }

  requestAnimationFrame(draw);
}

// Zeichne Herz
function drawParticle(p) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.translate(p.x, p.y);
  ctx.fillStyle = p.color;

  const topCurveHeight = p.r * 0.3;
  ctx.beginPath();
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(0, topCurveHeight - p.r / 2, -p.r, topCurveHeight - p.r / 2, -p.r, topCurveHeight);
  ctx.bezierCurveTo(-p.r, topCurveHeight + p.r / 2, 0, topCurveHeight + p.r, 0, topCurveHeight + p.r);
  ctx.bezierCurveTo(0, topCurveHeight + p.r, p.r, topCurveHeight + p.r / 2, p.r, topCurveHeight);
  ctx.bezierCurveTo(p.r, topCurveHeight - p.r / 2, 0, topCurveHeight - p.r / 2, 0, topCurveHeight);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Klick-Logik
const envelope = document.querySelector(".envelope");
const steps = document.querySelectorAll(".step");
const tap = document.querySelector(".tap");
const music = document.getElementById("music");

let currentStep = -1;
let started = false;

document.body.addEventListener("click", (e) => {
  if (!started) {
    started = true;
    tap.style.display = "none";
    envelope.classList.remove("hidden");
    envelope.classList.add("fly-in");
    music.volume = 0.35;
    music.play();
    return;
  }

  if (currentStep < steps.length - 1) {
    currentStep++;
    steps[currentStep].classList.add("show");
    createHeartParticles(e.clientX, e.clientY);
  }
});

// Herz-Partikel erzeugen
function createHeartParticles(x, y) {
  const count = 8;
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 6 + 4;
    const color = Math.random() < 0.5 ? "#F7CAC9" : "#5DADE2";
    particleList.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 1.8 - 0.5,
      r: size,
      color: color,
      alpha: 1,
      shape: "heart"
    });
  }
}

draw();
