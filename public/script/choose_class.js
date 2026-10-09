const userId = new URLSearchParams(window.location.search).get("id");

const quizSection = document.getElementById("quizSection");
const resultSection = document.getElementById("resultSection");
const stepText = document.getElementById("stepText");
const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("options");
// const progressBar = document.getElementById("progressBar");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const retryBtn = document.getElementById("retryBtn");
const errorBox = document.getElementById("error");
const resultContent = document.getElementById("resultContent");
const homeLink = document.getElementById("homeLink");

let questions = [];
let current = 0;
let answers = {}; 

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

if (userId) homeLink.href = `/landingPage?id=${encodeURIComponent(userId)}`;

async function init() {
  try {
    const res = await fetch("/api/quiz");
    const data = await res.json();
    questions = data.questions;
    renderQuestion();
  } catch (err) {
    console.error(err);
    errorBox.textContent = "Gagal memuat pertanyaan.";
  }
}

function renderQuestion() {
  const q = questions[current];
  errorBox.textContent = "";

  stepText.textContent = `Pertanyaan ${current + 1} dari ${questions.length}`;
  progressBar.style.width = `${(current / questions.length) * 100}%`;
  questionText.textContent = q.text;

  optionsBox.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option" + (answers[q.id] === opt.id ? " selected" : "");
    btn.textContent = opt.text;
    btn.addEventListener("click", () => {
      answers[q.id] = opt.id;
      renderQuestion();
    });
    optionsBox.appendChild(btn);
  });

  nextBtn.disabled = !answers[q.id];
  nextBtn.textContent = current === questions.length - 1 ? "Lihat Hasil" : "Lanjut";
  backBtn.style.visibility = current === 0 ? "hidden" : "visible";
}

nextBtn.addEventListener("click", async () => {
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
    return;
  }
  await submitAnswers();
});

backBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    renderQuestion();
  }
});

retryBtn.addEventListener("click", () => {
  answers = {};
  current = 0;
  resultSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  renderQuestion();
});

async function submitAnswers() {
  nextBtn.disabled = true;
  errorBox.textContent = "";

  const payload = {
    answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId }))
  };

  try {
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.message || "Gagal menghitung rekomendasi.";
      nextBtn.disabled = false;
      return;
    }

    renderResult(data);
  } catch (err) {
    console.error(err);
    errorBox.textContent = "Tidak bisa terhubung ke server.";
    nextBtn.disabled = false;
  }
}

function buildProgramCard(program, label, isPrimary) {
  const card = document.createElement("div");
  card.className = "result-card" + (isPrimary ? " primary" : "");

  const badge = document.createElement("span");
  badge.className = "badge" + (isPrimary ? "" : " alt");
  badge.textContent = label;

  const title = document.createElement("h3");
  title.textContent = program.title;

  const desc = document.createElement("p");
  desc.textContent = program.description;

  const list = document.createElement("ul");
  program.syllabus.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `${program.duration} • ELO ${program.elo})`;

  card.append(badge, title, desc, list, meta);
  return card;
}

function renderResult({ primary, alternative }) {
  progressBar.style.width = "100%";
  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");

  resultContent.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = "Hasil Rekomendasi";
  resultContent.appendChild(heading);

  resultContent.appendChild(buildProgramCard(primary, true));
  if (alternative) {
    resultContent.appendChild(buildProgramCard(alternative, "Rekomendasi Alternatif", false));
  }
}

init();