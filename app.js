// KotlinDroid Studio Prep - Main Application Logic

function safeGetStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Ignore storage errors in restricted file:// contexts
  }
}

function safeRemoveStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // Ignore
  }
}

// --- State Management ---
const state = {
  activeMode: "reviewer", // reviewer | flashcards | quiz | matcher
  reviewerFilter: "all",
  reviewerSearch: "",
  // Flashcards state
  fcTopic: "all",
  fcList: [...FLASHCARDS],
  fcIndex: 0,
  fcFlipped: false,
  fcMastered: safeGetStorage("kd_fc_mastered", []),
  fcNeedsReview: safeGetStorage("kd_fc_review", []),
  // Quiz state
  quizTopic: "all",
  quizCount: "all",
  quizQuestions: [],
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false,
  quizMissedIds: [],
  quizFinished: false,
  // Matcher state
  matchRoundPairs: [],
  selectedTask: null,
  selectedCode: null,
  matchedIds: [],
  matchScore: 0,
  matchStreak: 0,
  // Sandbox Simulator state
  simRecyclerItems: [
    { name: "Hans Valentino", course: "BS Computer Engineering" },
    { name: "Maria Santos", course: "BS Computer Science" }
  ],
  simSharedPrefs: safeGetStorage("kd_sim_prefs", { KEY_USER: "Hans", KEY_DARK: true })
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initReviewer();
  initSimulator();
  initFlashcards();
  initQuiz();
  initMatcher();
  updateGlobalProgressBadge();
});

function updateGlobalProgressBadge() {
  const badge = document.getElementById("masteryBadge");
  if (badge) {
    badge.textContent = `${state.fcMastered.length} / ${FLASHCARDS.length} Cards Mastered`;
  }
}

// --- Mode Switching ---
function initNavigation() {
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const mode = tab.getAttribute("data-mode");
      switchMode(mode);
    });
  });
}

window.switchMode = function(mode) {
  state.activeMode = mode;
  document.querySelectorAll(".nav-tab").forEach(t => {
    t.classList.toggle("active", t.getAttribute("data-mode") === mode);
  });
  document.querySelectorAll(".mode-section").forEach(sec => {
    sec.classList.toggle("hidden", sec.id !== `mode-${mode}`);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ==========================================
// MODE 1: REVIEWER & CODE GUIDE
// ==========================================
function initReviewer() {
  const pillContainer = document.getElementById("topicFilterPills");
  const searchInput = document.getElementById("reviewerSearchInput");

  const pillsHtml = [
    `<button type="button" data-topic="all" class="topic-pill px-3.5 py-1.5 rounded-full text-xs font-semibold transition bg-purple-600 text-white">All 8 Topics</button>`,
    ...TOPICS.map(t => `<button type="button" data-topic="${t.id}" class="topic-pill px-3.5 py-1.5 rounded-full text-xs font-semibold transition bg-slate-800 text-slate-300 hover:bg-slate-700">${t.title}</button>`)
  ].join("");
  pillContainer.innerHTML = pillsHtml;

  pillContainer.querySelectorAll(".topic-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      state.reviewerFilter = btn.getAttribute("data-topic");
      pillContainer.querySelectorAll(".topic-pill").forEach(b => {
        const active = b.getAttribute("data-topic") === state.reviewerFilter;
        b.className = `topic-pill px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
          active ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`;
      });
      renderReviewerCards();
    });
  });

  searchInput.addEventListener("input", (e) => {
    state.reviewerSearch = e.target.value.trim().toLowerCase();
    renderReviewerCards();
  });

  renderReviewerCards();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderReviewerCards() {
  const container = document.getElementById("reviewerCardsContainer");
  const filtered = TOPICS.filter(t => {
    const matchesTopic = state.reviewerFilter === "all" || t.id === state.reviewerFilter;
    if (!matchesTopic) return false;
    if (!state.reviewerSearch) return true;
    const haystack = `${t.title} ${t.badge} ${t.summary} ${t.keyPoints.join(" ")} ${t.apis.map(a => a.name + " " + a.desc).join(" ")} ${t.kotlinCode} ${t.xmlCode}`.toLowerCase();
    return haystack.includes(state.reviewerSearch);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center">
        <p class="text-slate-400 text-sm">No Android Studio topics matched your search query. Try searching for <code>onBindViewHolder</code>, <code>isChecked</code>, <code>putExtra</code>, or <code>apply()</code>.</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map((topic, idx) => `
    <article class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg transition hover:border-slate-700">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold flex items-center justify-center text-sm">${idx + 1}</span>
          <div>
            <h3 class="text-xl font-bold text-white">${escapeHtml(topic.title)}</h3>
            <span class="text-xs text-emerald-400 font-medium">${escapeHtml(topic.badge)}</span>
          </div>
        </div>
        <button type="button" data-quiz-topic="${topic.id}" class="jump-quiz-btn text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-600/30 border border-slate-700 hover:border-purple-500 text-slate-200 transition">
          Quiz This Topic →
        </button>
      </div>

      <p class="text-slate-300 text-sm leading-relaxed mb-4">${escapeHtml(topic.summary)}</p>

      <!-- Key Takeaways -->
      <div class="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 mb-5">
        <h4 class="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2.5">Key Exam Takeaways</h4>
        <ul class="space-y-1.5 text-sm text-slate-300">
          ${topic.keyPoints.map(kp => `<li class="flex items-start gap-2"><span class="text-emerald-400 mt-0.5">✔</span><span>${escapeHtml(kp)}</span></li>`).join("")}
        </ul>
      </div>

      <!-- Important APIs Table -->
      <div class="mb-5 overflow-x-auto">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Essential Properties, Methods & Attributes</h4>
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-800 text-slate-400">
              <th class="py-2 pr-4 font-semibold">API / Method / Attribute</th>
              <th class="py-2 font-semibold">Purpose</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            ${topic.apis.map(api => `
              <tr>
                <td class="py-2 pr-4 font-mono text-amber-300 whitespace-nowrap">${escapeHtml(api.name)}</td>
                <td class="py-2 text-slate-300">${escapeHtml(api.desc)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <!-- Side-by-Side XML & Kotlin Snippets -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="code-container">
          <div class="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800">
            <span class="text-xs font-mono text-sky-400 font-semibold">XML Layout / Resource</span>
            <button type="button" data-code="${encodeURIComponent(topic.xmlCode)}" class="copy-code-btn text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition">Copy XML</button>
          </div>
          <pre class="p-3.5 text-xs font-mono text-slate-200 code-scroll overflow-x-auto"><code>${escapeHtml(topic.xmlCode)}</code></pre>
        </div>

        <div class="code-container">
          <div class="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800">
            <span class="text-xs font-mono text-purple-400 font-semibold">Kotlin Implementation</span>
            <button type="button" data-code="${encodeURIComponent(topic.kotlinCode)}" class="copy-code-btn text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition">Copy Kotlin</button>
          </div>
          <pre class="p-3.5 text-xs font-mono text-slate-200 code-scroll overflow-x-auto"><code>${escapeHtml(topic.kotlinCode)}</code></pre>
        </div>
      </div>
    </article>
  `).join("");

  // Bind "Quiz This Topic" buttons
  container.querySelectorAll(".jump-quiz-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const topicId = btn.getAttribute("data-quiz-topic");
      jumpToTopicQuiz(topicId);
    });
  });

  // Bind "Copy" buttons with fallback for file:// protocol
  container.querySelectorAll(".copy-code-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      copyCode(btn);
    });
  });
}

window.copyCode = function(btn) {
  const code = decodeURIComponent(btn.getAttribute("data-code"));
  const showCopied = () => {
    const original = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("text-emerald-400");
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("text-emerald-400");
    }, 1500);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(showCopied).catch(() => fallbackCopy(code, showCopied));
  } else {
    fallbackCopy(code, showCopied);
  }
};

function fallbackCopy(text, callback) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    if (callback) callback();
  } catch (e) {
    // Ignore
  }
  document.body.removeChild(ta);
}

window.jumpToTopicQuiz = function(topicId) {
  switchMode("quiz");
  const select = document.getElementById("quizTopicSelect");
  if (select) {
    select.value = topicId;
    startNewQuiz();
  }
};

// ==========================================
// LIVE WIDGET & LOGCAT SANDBOX SIMULATOR
// ==========================================
function initSimulator() {
  const logBox = document.getElementById("logcatOutput");
  function appendLog(tag, message, level = "D") {
    const now = new Date();
    const time = now.toTimeString().split(" ")[0] + "." + String(now.getMilliseconds()).padStart(3, "0");
    const color = level === "I" ? "text-emerald-400" : level === "W" ? "text-amber-400" : "text-sky-400";
    const line = document.createElement("div");
    line.className = `font-mono text-xs ${color}`;
    line.textContent = `${time}  ${level}/${tag}: ${message}`;
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
  }

  document.getElementById("btnClearLogcat").addEventListener("click", () => {
    logBox.innerHTML = `<div class="text-xs font-mono text-slate-500">-- Logcat cleared --</div>`;
  });

  // 1. Toolbar Menu Simulator
  document.querySelectorAll(".sim-menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-menu-id");
      appendLog("MenusToolbar", `onOptionsItemSelected -> item.itemId == R.id.${id} (returned true)`, "I");
    });
  });

  // 2. CheckBox Simulator
  document.querySelectorAll(".sim-cb").forEach(cb => {
    cb.addEventListener("change", () => {
      appendLog("CheckBox", `${cb.id}.setOnCheckedChangeListener -> isChecked = ${cb.checked}`);
    });
  });

  // 3. RadioGroup Simulator
  document.querySelectorAll("input[name='simRadioYear']").forEach(rb => {
    rb.addEventListener("change", () => {
      if (rb.checked) {
        appendLog("RadioGroup", `rgYear.setOnCheckedChangeListener -> checkedId = R.id.${rb.value}`);
      }
    });
  });

  document.getElementById("simClearRadio").addEventListener("click", () => {
    document.querySelectorAll("input[name='simRadioYear']").forEach(rb => {
      rb.checked = false;
    });
    appendLog("RadioGroup", `rgYear.clearCheck() -> checkedRadioButtonId is now -1`, "W");
  });

  // 4. Spinner Simulator
  const simSpinner = document.getElementById("simSpinner");
  simSpinner.addEventListener("change", () => {
    const pos = simSpinner.selectedIndex;
    const val = simSpinner.value;
    appendLog("Spinner", `onItemSelected(pos=${pos}) -> parent.getItemAtPosition(${pos}) = "${val}"`);
  });

  // 5. Switch Simulator
  const simSwitch = document.getElementById("simSwitchDark");
  simSwitch.addEventListener("change", () => {
    appendLog("MaterialSwitch", `switchDark.setOnCheckedChangeListener -> isChecked = ${simSwitch.checked}`, "I");
  });

  // 6. Intent Simulator
  document.getElementById("simSendIntentBtn").addEventListener("click", () => {
    const extraVal = document.getElementById("simIntentInput").value || "GuestUser";
    document.getElementById("simIntentResult").textContent = `SecondActivity received: "${extraVal}"`;
    appendLog("IntentExtras", `Intent(this, SecondActivity::class.java).putExtra("EXTRA_USER", "${extraVal}") -> startActivity()`, "I");
  });

  // 7. SharedPreferences Simulator
  function renderSimPrefs() {
    document.getElementById("simPrefsXmlPreview").textContent =
      `<map>\n  <string name="KEY_USER">${state.simSharedPrefs.KEY_USER}</string>\n  <boolean name="KEY_DARK" value="${state.simSharedPrefs.KEY_DARK}" />\n</map>`;
  }
  renderSimPrefs();

  document.getElementById("simSavePrefsBtn").addEventListener("click", () => {
    const userVal = document.getElementById("simIntentInput").value || "Hans";
    const darkVal = simSwitch.checked;
    state.simSharedPrefs = { KEY_USER: userVal, KEY_DARK: darkVal };
    safeSetStorage("kd_sim_prefs", state.simSharedPrefs);
    renderSimPrefs();
    appendLog("SharedPrefs", `prefs.edit().putString("KEY_USER", "${userVal}").putBoolean("KEY_DARK", ${darkVal}).apply()`, "I");
  });

  // 8. RecyclerView Simulator
  function renderSimRecycler() {
    const container = document.getElementById("simRecyclerList");
    container.innerHTML = state.simRecyclerItems.map((item, idx) => `
      <div data-idx="${idx}" class="sim-rv-row cursor-pointer p-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 flex items-center justify-between transition">
        <div>
          <div class="text-xs font-bold text-white">${escapeHtml(item.name)}</div>
          <div class="text-[11px] text-slate-400">${escapeHtml(item.course)}</div>
        </div>
        <span class="text-[10px] font-mono text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded">pos: ${idx}</span>
      </div>
    `).join("");

    container.querySelectorAll(".sim-rv-row").forEach(row => {
      row.addEventListener("click", () => {
        const i = parseInt(row.getAttribute("data-idx"), 10);
        const student = state.simRecyclerItems[i];
        appendLog("RecyclerView", `onBindViewHolder click lambda -> pos=${i}, name="${student.name}"`);
      });
    });
  }
  renderSimRecycler();

  document.getElementById("simAddRvBtn").addEventListener("click", () => {
    const nameInput = document.getElementById("simRvNameInput");
    const name = nameInput.value.trim() || `Student #${state.simRecyclerItems.length + 1}`;
    const course = simSpinner.value;
    state.simRecyclerItems.push({ name, course });
    nameInput.value = "";
    renderSimRecycler();
    appendLog("RecyclerView", `adapter.notifyItemInserted(${state.simRecyclerItems.length - 1}) -> getItemCount() = ${state.simRecyclerItems.length}`, "I");
  });
}

// ==========================================
// MODE 2: INTERACTIVE 3D FLASHCARDS
// ==========================================
function initFlashcards() {
  const topicSelect = document.getElementById("fcTopicSelect");
  topicSelect.innerHTML = `<option value="all">All Topics (${FLASHCARDS.length} Cards)</option>` +
    TOPICS.map(t => `<option value="${t.id}">${t.title}</option>`).join("");

  topicSelect.addEventListener("change", () => {
    state.fcTopic = topicSelect.value;
    filterFlashcards();
  });

  document.getElementById("flashcardContainer").addEventListener("click", flipFlashcard);
  document.getElementById("fcPrevBtn").addEventListener("click", prevFlashcard);
  document.getElementById("fcNextBtn").addEventListener("click", nextFlashcard);
  document.getElementById("fcShuffleBtn").addEventListener("click", shuffleFlashcards);
  document.getElementById("fcResetBtn").addEventListener("click", resetFlashcardProgress);
  document.getElementById("fcGotItBtn").addEventListener("click", () => markFlashcard(true));
  document.getElementById("fcReviewBtn").addEventListener("click", () => markFlashcard(false));

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (state.activeMode !== "flashcards") return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
    if (e.code === "Space") {
      e.preventDefault();
      flipFlashcard();
    } else if (e.code === "ArrowRight") {
      nextFlashcard();
    } else if (e.code === "ArrowLeft") {
      prevFlashcard();
    } else if (e.key === "1") {
      markFlashcard(true);
    } else if (e.key === "2") {
      markFlashcard(false);
    }
  });

  filterFlashcards();
}

function filterFlashcards() {
  state.fcList = state.fcTopic === "all"
    ? [...FLASHCARDS]
    : FLASHCARDS.filter(c => c.topic === state.fcTopic);
  state.fcIndex = 0;
  state.fcFlipped = false;
  renderFlashcard();
}

function renderFlashcard() {
  const inner = document.getElementById("flashcardInner");
  inner.classList.toggle("is-flipped", state.fcFlipped);

  const card = state.fcList[state.fcIndex];
  if (!card) return;

  document.getElementById("fcCounter").textContent = `Card ${state.fcIndex + 1} of ${state.fcList.length}`;
  document.getElementById("fcFrontTopic").textContent = card.topicName;
  document.getElementById("fcBackTopic").textContent = card.topicName;
  document.getElementById("fcQuestionText").textContent = card.q;
  document.getElementById("fcAnswerText").textContent = card.a;

  const statusEl = document.getElementById("fcCardStatus");
  if (state.fcMastered.includes(card.id)) {
    statusEl.textContent = "✔ Mastered";
    statusEl.className = "text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
  } else if (state.fcNeedsReview.includes(card.id)) {
    statusEl.textContent = "⟳ Needs Review";
    statusEl.className = "text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40";
  } else {
    statusEl.textContent = "Unseen";
    statusEl.className = "text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400";
  }

  document.getElementById("fcMasteredCount").textContent = state.fcMastered.length;
  document.getElementById("fcReviewCount").textContent = state.fcNeedsReview.length;
  updateGlobalProgressBadge();
}

function flipFlashcard() {
  state.fcFlipped = !state.fcFlipped;
  document.getElementById("flashcardInner").classList.toggle("is-flipped", state.fcFlipped);
}

function nextFlashcard() {
  state.fcFlipped = false;
  state.fcIndex = (state.fcIndex + 1) % state.fcList.length;
  renderFlashcard();
}

function prevFlashcard() {
  state.fcFlipped = false;
  state.fcIndex = (state.fcIndex - 1 + state.fcList.length) % state.fcList.length;
  renderFlashcard();
}

function shuffleFlashcards() {
  for (let i = state.fcList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.fcList[i], state.fcList[j]] = [state.fcList[j], state.fcList[i]];
  }
  state.fcIndex = 0;
  state.fcFlipped = false;
  renderFlashcard();
}

function markFlashcard(gotIt) {
  const card = state.fcList[state.fcIndex];
  if (!card) return;
  if (gotIt) {
    if (!state.fcMastered.includes(card.id)) state.fcMastered.push(card.id);
    state.fcNeedsReview = state.fcNeedsReview.filter(id => id !== card.id);
  } else {
    if (!state.fcNeedsReview.includes(card.id)) state.fcNeedsReview.push(card.id);
    state.fcMastered = state.fcMastered.filter(id => id !== card.id);
  }
  safeSetStorage("kd_fc_mastered", state.fcMastered);
  safeSetStorage("kd_fc_review", state.fcNeedsReview);
  nextFlashcard();
}

function resetFlashcardProgress() {
  state.fcMastered = [];
  state.fcNeedsReview = [];
  safeRemoveStorage("kd_fc_mastered");
  safeRemoveStorage("kd_fc_review");
  renderFlashcard();
}

// ==========================================
// MODE 3: PRACTICE QUIZ & EXAM MODE
// ==========================================
function initQuiz() {
  const topicSelect = document.getElementById("quizTopicSelect");
  topicSelect.innerHTML = `<option value="all">All 8 Topics (Comprehensive)</option>` +
    TOPICS.map(t => `<option value="${t.id}">${t.title}</option>`).join("");

  topicSelect.addEventListener("change", startNewQuiz);
  document.getElementById("quizLengthSelect").addEventListener("change", startNewQuiz);
  document.getElementById("quizRestartBtn").addEventListener("click", startNewQuiz);
  document.getElementById("quizNextBtn").addEventListener("click", nextQuizQuestion);
  document.getElementById("quizRetryMissedBtn").addEventListener("click", retryMissedQuestions);
  const freshBtn = document.getElementById("quizFreshStartBtn");
  if (freshBtn) freshBtn.addEventListener("click", startNewQuiz);

  startNewQuiz();
}

window.startNewQuiz = function() {
  const topic = document.getElementById("quizTopicSelect").value;
  const lengthMode = document.getElementById("quizLengthSelect").value;

  let pool = topic === "all"
    ? [...QUIZ_QUESTIONS]
    : QUIZ_QUESTIONS.filter(q => q.topic === topic);

  pool.sort(() => Math.random() - 0.5);

  if (lengthMode === "10" && pool.length > 10) {
    pool = pool.slice(0, 10);
  }

  state.quizQuestions = pool;
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizMissedIds = [];
  state.quizFinished = false;

  document.getElementById("quizSummaryPanel").classList.add("hidden");
  document.getElementById("quizActivePanel").classList.remove("hidden");
  renderQuizQuestion();
};

function retryMissedQuestions() {
  const missedPool = QUIZ_QUESTIONS.filter(q => state.quizMissedIds.includes(q.id));
  if (missedPool.length === 0) {
    startNewQuiz();
    return;
  }
  state.quizQuestions = missedPool;
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizMissedIds = [];
  state.quizFinished = false;

  document.getElementById("quizSummaryPanel").classList.add("hidden");
  document.getElementById("quizActivePanel").classList.remove("hidden");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const qObj = state.quizQuestions[state.quizIndex];
  if (!qObj) return;

  state.quizAnswered = false;
  document.getElementById("quizProgressText").textContent = `Question ${state.quizIndex + 1} of ${state.quizQuestions.length}`;
  document.getElementById("quizScoreLive").textContent = `Score: ${state.quizScore}`;
  document.getElementById("quizTopicBadge").textContent = qObj.topicName;
  document.getElementById("quizQuestionText").textContent = qObj.q;

  const pct = Math.round(((state.quizIndex) / state.quizQuestions.length) * 100);
  document.getElementById("quizProgressBar").style.width = `${pct}%`;

  const optionsContainer = document.getElementById("quizOptionsContainer");
  optionsContainer.innerHTML = qObj.options.map((opt, i) => `
    <button type="button" data-idx="${i}" class="quiz-opt-btn w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-800 hover:border-purple-500 transition flex items-start gap-3">
      <span class="w-6 h-6 rounded-md bg-slate-900 border border-slate-700 text-xs font-mono font-bold flex items-center justify-center text-slate-300 shrink-0">${String.fromCharCode(65 + i)}</span>
      <span class="text-sm text-slate-100 font-medium">${escapeHtml(opt)}</span>
    </button>
  `).join("");

  optionsContainer.querySelectorAll(".quiz-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => handleQuizAnswer(parseInt(btn.getAttribute("data-idx"), 10)));
  });

  document.getElementById("quizFeedbackBox").classList.add("hidden");
  document.getElementById("quizNextBtn").classList.add("hidden");
}

function handleQuizAnswer(chosenIndex) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;

  const qObj = state.quizQuestions[state.quizIndex];
  const isCorrect = chosenIndex === qObj.answer;

  if (isCorrect) {
    state.quizScore++;
  } else {
    if (!state.quizMissedIds.includes(qObj.id)) {
      state.quizMissedIds.push(qObj.id);
    }
  }

  document.getElementById("quizScoreLive").textContent = `Score: ${state.quizScore}`;

  const buttons = document.querySelectorAll(".quiz-opt-btn");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === qObj.answer) {
      btn.className = "quiz-opt-btn w-full text-left p-4 rounded-xl border-2 border-emerald-500 bg-emerald-950/40 flex items-start gap-3";
    } else if (idx === chosenIndex && !isCorrect) {
      btn.className = "quiz-opt-btn w-full text-left p-4 rounded-xl border-2 border-rose-500 bg-rose-950/40 flex items-start gap-3";
    } else {
      btn.classList.add("opacity-50");
    }
  });

  const feedbackBox = document.getElementById("quizFeedbackBox");
  feedbackBox.classList.remove("hidden");
  feedbackBox.className = `mt-5 p-4 rounded-xl border ${
    isCorrect ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200" : "bg-rose-950/30 border-rose-500/50 text-rose-200"
  }`;
  document.getElementById("quizFeedbackTitle").textContent = isCorrect ? "✔ Correct!" : "✘ Incorrect";
  document.getElementById("quizFeedbackExplanation").textContent = qObj.explanation;

  const nextBtn = document.getElementById("quizNextBtn");
  nextBtn.textContent = state.quizIndex + 1 === state.quizQuestions.length ? "Finish Quiz & View Results →" : "Next Question →";
  nextBtn.classList.remove("hidden");
}

function nextQuizQuestion() {
  if (state.quizIndex + 1 < state.quizQuestions.length) {
    state.quizIndex++;
    renderQuizQuestion();
  } else {
    showQuizSummary();
  }
}

function showQuizSummary() {
  document.getElementById("quizActivePanel").classList.add("hidden");
  const summaryPanel = document.getElementById("quizSummaryPanel");
  summaryPanel.classList.remove("hidden");

  const total = state.quizQuestions.length;
  const pct = Math.round((state.quizScore / total) * 100);
  document.getElementById("quizFinalScore").textContent = `${state.quizScore} / ${total} (${pct}%)`;

  let verdict = "Keep practicing! Review the code snippets and flashcards.";
  if (pct === 100) verdict = "Perfect Score! You are 100% ready for your Android Studio Kotlin exam.";
  else if (pct >= 80) verdict = "Great job! You have a strong grasp of Android Studio & Kotlin.";
  else if (pct >= 60) verdict = "Good effort! Retry your missed questions to lock in the concepts.";

  document.getElementById("quizFinalVerdict").textContent = verdict;

  const retryBtn = document.getElementById("quizRetryMissedBtn");
  if (state.quizMissedIds.length > 0) {
    retryBtn.classList.remove("hidden");
    retryBtn.textContent = `Retry ${state.quizMissedIds.length} Missed Question(s)`;
  } else {
    retryBtn.classList.add("hidden");
  }
}

// ==========================================
// MODE 4: QUICK SYNTAX & METHOD MATCHER
// ==========================================
function initMatcher() {
  document.getElementById("matcherNewRoundBtn").addEventListener("click", startNewMatcherRound);
  startNewMatcherRound();
}

function startNewMatcherRound() {
  const shuffled = [...SYNTAX_MATCH_PAIRS].sort(() => Math.random() - 0.5).slice(0, 6);
  state.matchRoundPairs = shuffled;
  state.selectedTask = null;
  state.selectedCode = null;
  state.matchedIds = [];
  document.getElementById("matcherStatusMsg").textContent = "Select an Android task on the left, then click its matching Kotlin method or property on the right.";
  renderMatcherBoard();
}

function renderMatcherBoard() {
  const tasksCol = document.getElementById("matcherTasksCol");
  const codesCol = document.getElementById("matcherCodesCol");

  const tasks = [...state.matchRoundPairs];
  const codes = [...state.matchRoundPairs].sort((a, b) => a.code.localeCompare(b.code));

  tasksCol.innerHTML = tasks.map(item => {
    const isMatched = state.matchedIds.includes(item.id);
    const isSelected = state.selectedTask === item.id;
    return `
      <button type="button" data-id="${item.id}" ${isMatched ? "disabled" : ""} class="match-card w-full text-left p-3.5 rounded-xl border border-slate-700 bg-slate-800/80 text-sm text-slate-200 font-medium ${isMatched ? "matched" : ""} ${isSelected ? "selected" : ""}">
        ${escapeHtml(item.task)}
      </button>
    `;
  }).join("");

  codesCol.innerHTML = codes.map(item => {
    const isMatched = state.matchedIds.includes(item.id);
    const isSelected = state.selectedCode === item.id;
    return `
      <button type="button" data-id="${item.id}" ${isMatched ? "disabled" : ""} class="match-card w-full text-left p-3.5 rounded-xl border border-slate-700 bg-slate-900 font-mono text-xs text-purple-300 ${isMatched ? "matched" : ""} ${isSelected ? "selected" : ""}">
        ${escapeHtml(item.code)}
      </button>
    `;
  }).join("");

  tasksCol.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      state.selectedTask = btn.getAttribute("data-id");
      checkMatchSelection();
    });
  });

  codesCol.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      state.selectedCode = btn.getAttribute("data-id");
      checkMatchSelection();
    });
  });

  document.getElementById("matcherScore").textContent = state.matchScore;
  document.getElementById("matcherStreak").textContent = state.matchStreak;
}

function checkMatchSelection() {
  renderMatcherBoard();
  if (!state.selectedTask || !state.selectedCode) return;

  if (state.selectedTask === state.selectedCode) {
    state.matchedIds.push(state.selectedTask);
    state.matchScore += 10;
    state.matchStreak += 1;
    state.selectedTask = null;
    state.selectedCode = null;
    renderMatcherBoard();

    if (state.matchedIds.length === state.matchRoundPairs.length) {
      document.getElementById("matcherStatusMsg").textContent = "🎉 Round Cleared! Click 'New 6-Pair Drill' to continue.";
    } else {
      document.getElementById("matcherStatusMsg").textContent = "✔ Match! Keep the streak going.";
    }
  } else {
    state.matchStreak = 0;
    document.getElementById("matcherStatusMsg").textContent = "✘ Not a match — try again!";
    const taskBtn = document.querySelector(`#matcherTasksCol button[data-id="${state.selectedTask}"]`);
    const codeBtn = document.querySelector(`#matcherCodesCol button[data-id="${state.selectedCode}"]`);
    if (taskBtn) taskBtn.classList.add("wrong");
    if (codeBtn) codeBtn.classList.add("wrong");

    state.selectedTask = null;
    state.selectedCode = null;
    setTimeout(() => renderMatcherBoard(), 450);
  }
}
