// Screens
const home = document.getElementById("home");
const password = document.getElementById("password");
const welcome = document.getElementById("welcome");

// Buttons / UI
const logoBtn = document.getElementById("logoBtn");
const backBtn = document.getElementById("backBtn");
const errorEl = document.getElementById("error");

// Top bar (welcome screen)
const kissBtn = document.getElementById("kissBtn");
const hintBtn = document.getElementById("hintBtn");
const hintCard = document.getElementById("hintCard");

// Hint card (top bar)

const hintInputWrap = document.getElementById("hintInputWrap");
const hintMsgWrap = document.getElementById("hintMsgWrap");
const hintMsg = document.getElementById("hintMsg");
const hintBack = document.getElementById("hintBack");
const hintUnlockBtn = document.getElementById("hintUnlockBtn");

// Final msg reveal
const puzzle7InputWrap = document.getElementById("puzzle7InputWrap");
const puzzle7SuccessMsg = document.getElementById("puzzle7SuccessMsg");

// Error msg timer
let errorTimer = null;

// Sound effect and confetti anim
const kissSound = document.getElementById("kissSound");
const fanfareSound = document.getElementById("fanfareSound");
const confettiEl = document.getElementById("confetti");
const errorSound = document.getElementById("errorSound");
const applaudSound = document.getElementById("applaudSound");

// alert msg
const toastEl = document.getElementById("toast");

/* ---------------------------
   Screen navigation
---------------------------- */
function showScreen(screenToShow) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.add("hidden");
  });
  screenToShow.classList.remove("hidden");
}

/* ---------------------------
   Switch puzzle views inside Home -screen
---------------------------- */

function showWelcomeViewById(viewId) {
  // Hide all views inside welcome
  document.querySelectorAll("#welcome .welcome-view").forEach((el) => {
    el.classList.add("hidden");
  });

  // Show the one we want
  document.getElementById(viewId)?.classList.remove("hidden");
}

/* ---------------------------
   Password error helpers
---------------------------- */
function showError(msg, duration = 8000) {
  if (!errorEl) return;

  // Set text + show
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");

  // Clear any existing timer
  if (errorTimer) {
    clearTimeout(errorTimer);
  }

  // Auto-hide after duration
  errorTimer = setTimeout(() => {
    hideError();
    errorTimer = null;
  }, duration);
}

function hideError() {
  if (!errorEl) return;
  errorEl.classList.add("hidden");

  if (errorTimer) {
    clearTimeout(errorTimer);
    errorTimer = null;
  }
}

/* ---------------------------
   Kiss alert msg
---------------------------- */

function showToast(message, duration = 2200) {
  if (!toastEl) return;

  toastEl.querySelector(".toast-text").textContent = message;

  toastEl.classList.remove("hidden");
  toastEl.classList.add("show");

  setTimeout(() => {
    toastEl.classList.remove("show");
    setTimeout(() => toastEl.classList.add("hidden"), 300);
  }, duration);
}

/* sound helper */
function unlockAudioOnce() {
  if (!fanfareSound) return;

  const prevVol = fanfareSound.volume;
  fanfareSound.volume = 0; // silent unlock

  fanfareSound.play()
    .then(() => {
      fanfareSound.pause();
      fanfareSound.currentTime = 0;
      fanfareSound.volume = prevVol ?? 1;
    })
    .catch(() => {
      fanfareSound.volume = prevVol ?? 1;
    });
}

// Unlock on the first user click anywhere
window.addEventListener("click", unlockAudioOnce, { once: true });

function unlockAudioOnce() {
  const audios = [fanfareSound, errorSound, applaudSound, kissSound].filter(Boolean);

  audios.forEach((a) => {
    const prevVol = a.volume;
    a.volume = 0;
    a.play().then(() => {
      a.pause();
      a.currentTime = 0;
      a.volume = prevVol ?? 1;
    }).catch(() => {
      a.volume = prevVol ?? 1;
    });
  });
}

window.addEventListener("click", unlockAudioOnce, { once: true });

/* LAST SUCCESS SOUND helper */
function playApplause() {
  if (!applaudSound) return;
  applaudSound.pause();
  applaudSound.currentTime = 0;
  applaudSound.volume = 1;
  applaudSound.play().catch(() => {});
}

/*---------------------------
   Confetti animation
----------------------------*/
function celebrateSuccess(duration = 2000) {
  // Play sound
if (fanfareSound) {
  fanfareSound.pause();
  fanfareSound.currentTime = 0;
  fanfareSound.volume = 1;
  fanfareSound.play().catch(() => {});
}

  // Confetti burst
  if (!confettiEl) return;

  confettiEl.innerHTML = ""; // clear old pieces
  confettiEl.classList.remove("hidden");

  const colors = ["#ffffff", "#ffd1dc", "#ff5c8a", "#c7f9cc", "#ffd166", "#a0c4ff"];
  const pieceCount = 80;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";

    // randomize
    const left = Math.random() * 100; // vw
    const size = 6 + Math.random() * 10; // px
    const delay = Math.random() * 0.2; // seconds
    const color = colors[Math.floor(Math.random() * colors.length)];

    piece.style.left = `${left}vw`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.4}px`;
    piece.style.background = color;
    piece.style.animationDelay = `${delay}s`;

    confettiEl.appendChild(piece);
  }

  // Hide after duration
  setTimeout(() => {
    confettiEl.classList.add("hidden");
    confettiEl.innerHTML = "";
  }, duration);
}

/* LAST SUCCESS AND CONFETTI */

function celebrateFinal(duration = 2500) {
  playApplause();

  // reuse your existing confetti visuals:
  if (!confettiEl) return;

  confettiEl.innerHTML = "";
  confettiEl.classList.remove("hidden");

  const colors = ["#ffffff", "#ffd1dc", "#ff5c8a", "#c7f9cc", "#ffd166", "#a0c4ff"];
  const pieceCount = 110; // a bit more for the final!

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";

    const left = Math.random() * 100;
    const size = 6 + Math.random() * 12;
    const delay = Math.random() * 0.2;
    const color = colors[Math.floor(Math.random() * colors.length)];

    piece.style.left = `${left}vw`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.4}px`;
    piece.style.background = color;
    piece.style.animationDelay = `${delay}s`;

    confettiEl.appendChild(piece);
  }

  setTimeout(() => {
    confettiEl.classList.add("hidden");
    confettiEl.innerHTML = "";
  }, duration);
}

/* WRONG CODE / ERROR AUDIO */
function playErrorSound() {
  if (!errorSound) return;
  errorSound.pause();
  errorSound.currentTime = 0;
  errorSound.play().catch(() => {});
}

function shakeBoxes(boxesId) {
  const el = document.getElementById(boxesId);
  if (!el) return;

  // restart animation if spam-clicking
  el.classList.remove("shake");
  void el.offsetWidth; // force reflow
  el.classList.add("shake");

  setTimeout(() => el.classList.remove("shake"), 400);
}

/* ---------------------------
   Reusable code-lock setup
   Use this for every puzzle code
---------------------------- */
function setupCodeLock({
  boxesId,           // e.g. "pinBoxes" or "toastBoxes"
  buttonId,          // e.g. "unlockBtn" or "toastUnlockBtn"
  length,            // how many boxes
  allow = "alnum",   // "digits" | "letters" | "alnum"
  correct,           // string code
  caseInsensitive = true,
  onSuccess,         // function
  onFail,            // function(message)
}) {
  const inputs = Array.from(
    document.querySelectorAll(`#${boxesId} .pin-box`)
  );
  const btn = document.getElementById(buttonId);

  if (!inputs.length) return null;

  const sanitize = (val) => {
    if (allow === "digits") return val.replace(/\D/g, "");
    if (allow === "letters") return val.replace(/[^a-zA-Z]/g, "");
    return val.replace(/[^a-zA-Z0-9]/g, "");
  };

  const focusFirst = () => {
    if (inputs[0]) inputs[0].focus();
  };

  const clear = () => {
    inputs.forEach((i) => (i.value = ""));
  };

const submit = () => {
  const enteredRaw = inputs.map((i) => i.value).join("").trim();
  if (enteredRaw.length < length) {
    playErrorSound();
    shakeBoxes(boxesId);
    onFail?.(`${length} characters required`);
    return;
  }

  const entered = caseInsensitive ? enteredRaw.toUpperCase() : enteredRaw;

  if (typeof correct === "object" && correct !== null) {
    const key = entered;
    if (Object.prototype.hasOwnProperty.call(correct, key)) {
      const payload = correct[key]; // could be a message string
      clear();
      onSuccess?.(payload, key);
    } else {
      playErrorSound();
      shakeBoxes(boxesId);
      clear();
      focusFirst();
      onFail?.("Wrong code");
    }
    return;
  }

  const expected = caseInsensitive
    ? String(correct).toUpperCase()
    : String(correct);

  if (entered === expected) {
    clear();
    onSuccess?.();
  } else {
    playErrorSound();
    shakeBoxes(boxesId);
    clear();
    focusFirst();
    onFail?.("Wrong code");
  }
};

  // Input behavior: 1 char per box, auto-advance, backspace to previous
  inputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      let v = sanitize(input.value).slice(0, 1);
      if (caseInsensitive) v = v.toUpperCase();
      input.value = v;

      if (input.value && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && idx > 0) {
        inputs[idx - 1].focus();
      }
      if (e.key === "Enter") submit();
    });
  });

  // Arrow button submit
  btn?.addEventListener("click", submit);

  // Return helpers in case you want them later
  return { inputs, submit, clear, focusFirst };
}

// Global click listener to close hint card when clicking outside
document.addEventListener("click", (e) => {
  // If hint card is hidden, do nothing
  if (hintCard?.classList.contains("hidden")) return;

  const clickedInsideHint =
    hintCard.contains(e.target) || hintBtn.contains(e.target);

  if (!clickedInsideHint) {
    hintCard.classList.add("hidden");
  }
});

/* ---------------------------
   HOME -> PASSWORD
---------------------------- */
logoBtn?.addEventListener("click", () => {
  showScreen(password);
  passwordLock?.focusFirst();
});

backBtn?.addEventListener("click", () => {
  showScreen(home);
});

/* ---------------------------
   LOCK #1: Password (2702)
---------------------------- */
const passwordLock = setupCodeLock({
  boxesId: "pinBoxes",
  buttonId: "unlockBtn",
  length: 4,
  allow: "digits",
  correct: "2702",
onSuccess: () => {
  hideError();
  showScreen(welcome);
  showWelcomeViewById("welcomeContent");
  toastLock?.focusFirst();
},
  onFail: () => {
    showError("Forgot your password? Hint: Dog’s Birthday");
  },
});

/* ---------------------------
   Welcome screen top bar actions
---------------------------- */

// KISS BUTTON (mock)
kissBtn?.addEventListener("click", () => {
  if (kissSound) {
    kissSound.currentTime = 0; // allows rapid re-clicks
    kissSound.play();
  }
  showToast("The mastermind has been notified.");
});

// TOGGLE HINT CARD
hintBtn?.addEventListener("click", (e) => {
  e.stopPropagation();

  const willShow = hintCard?.classList.contains("hidden");
  hintCard?.classList.toggle("hidden");

  if (willShow) {
    resetHintCard();
    hintLock?.focusFirst();
  }
});

// Prevent clicks inside the hint card from closing it
hintCard?.addEventListener("click", (e) => {
  e.stopPropagation();
});

/* ---------------------------
   HINT CARD UI helpers
---------------------------- */

function showHintMessage(text) {
  // hide input view
  if (hintInputWrap) hintInputWrap.classList.add("hidden");

  // set + show message view (this includes the back arrow)
  if (hintMsg) hintMsg.textContent = text;
  if (hintMsgWrap) hintMsgWrap.classList.remove("hidden");
}

function resetHintCard() {
  // hide message view
  if (hintMsgWrap) hintMsgWrap.classList.add("hidden");

  // clear message text (optional)
  if (hintMsg) hintMsg.textContent = "";

  // show input view again
  if (hintInputWrap) hintInputWrap.classList.remove("hidden");
}

if (hintBack) {
  hintBack.addEventListener("click", resetHintCard);
}

/* ---------------------------
   HINT CARD logic
---------------------------- */

const hintLock = setupCodeLock({
  boxesId: "hintBoxes",
  buttonId: "hintUnlockBtn",
  length: 4,
  allow: "letters",
  caseInsensitive: true,

  // Map of hint text
  correct: {
    COLD: "There might be a useful item on this table.",
    GROW: "Sometimes the answer is on the other side.",
    POTS: "Do the colors and patterns look familiar?",
    DATE: "If it is valuable, it goes on the fridge.",
    HELP: "Where I see myself, you can see your words.",
    BUTT: "I wonder how many alphabets there are...?",
    CLUB: "Suddenly all the places can be found where we sit and relax.",
    KISS: "We started from somewhere, found ourselves disappearing in a moment elsewhere and ended up here.",
    GIFT: "Reading is a useful hobby, especially for solving mysteries.",
    LUCK: "Now you know where to look. I'ts simply the first you see.",
    MINE: "Rakas!",
    WORD: "Tommy said it well.",
    LAST: "This time there is no monsters under there.",
  },

  onSuccess: (hintText, codeUsed) => {
    showHintMessage(hintText);
  },

  onFail: () => {
    showHintMessage("No hint for that code.");
  },

});

/* ---------------------------
   LOCK HOME: Toast (SALUD)
---------------------------- */
const toastLock = setupCodeLock({
  boxesId: "toastBoxes",
  buttonId: "toastUnlockBtn",
  length: 5,
  allow: "letters",
  correct: "SALUD",
  caseInsensitive: true,
onSuccess: () => {
  celebrateSuccess(); 
  hideError();
  showWelcomeViewById("puzzle1View");
  puzzle1Lock?.focusFirst();
},
  onFail: () => {
    showError("Not quite. Use coupon code from the card for a hint.");
  },
});

/* ---------------------------
   PUZZLE 1: (92731) plants
---------------------------- */

const puzzle1Lock = setupCodeLock({
  boxesId: "puzzle1Boxes",        // <-- puzzle 1 pin boxes wrapper id
  buttonId: "puzzle1UnlockBtn",   // <-- puzzle 1 arrow button id
  length: 5,
  allow: "digits",
  correct: "92731",
onSuccess: () => {
  celebrateSuccess(); 
  hideError();
  showWelcomeViewById("puzzle2View"); 
  puzzle2Lock?.focusFirst();
},
  onFail: () => {
    showError("Not quite. Use coupon code from the card for a hint.");
  },
});

/* ---------------------------
   PUZZLE 2: (14126) polaroids
---------------------------- */

const puzzle2Lock = setupCodeLock({
  boxesId: "puzzle2Boxes",
  buttonId: "puzzle2UnlockBtn",
  length: 5,
  allow: "digits",
  correct: "14126",
onSuccess: () => {
  celebrateSuccess(); 
  hideError();
  showWelcomeViewById("puzzle3View");
  puzzle3Lock?.focusFirst();
},
  onFail: () => {
    showError("Not quite. Use coupon code from the card for a hint.");
  },
});

/* ---------------------------
   PUZZLE 3: (42896) perse
---------------------------- */

const puzzle3Lock = setupCodeLock({
  boxesId: "puzzle3Boxes",
  buttonId: "puzzle3UnlockBtn",
  length: 5,
  allow: "digits",
  correct: "42896",
onSuccess: () => {
  celebrateSuccess(); 
  hideError();
  showWelcomeViewById("puzzle4View");
  puzzle4Lock?.focusFirst();
},
  onFail: () => {
    showError("Not quite. Use coupon code from the card for a hint.");
  },
});

/* ---------------------------
   PUZZLE 4: (JUPIT) places
---------------------------- */

const puzzle4Lock = setupCodeLock({
  boxesId: "puzzle4Boxes",
  buttonId: "puzzle4UnlockBtn",
  length: 5,
  allow: "letters",
  correct: "JUPIT",
onSuccess: () => {
  celebrateSuccess(); 
  hideError();
  showWelcomeViewById("puzzle5View");
  puzzle5Lock?.focusFirst();
},
  onFail: () => {
    showError("Not quite. Use coupon code from the card for a hint.");
  },
});

/* ---------------------------
   PUZZLE 5: (RAKAS) the book
---------------------------- */

const puzzle5Lock = setupCodeLock({
  boxesId: "puzzle5Boxes",
  buttonId: "puzzle5UnlockBtn",
  length: 5,
  allow: "letters",
  correct: "RAKAS",
onSuccess: () => {
  celebrateSuccess(); 
  hideError();
  showWelcomeViewById("puzzle6View");
  puzzle6Lock?.focusFirst();
},
  onFail: () => {
    showError("Not quite. Use coupon code from the card for a hint.");
  },
});

/* ---------------------------
   PUZZLE 6: (SINUN) the wine glass
---------------------------- */

const puzzle6Lock = setupCodeLock({
  boxesId: "puzzle6Boxes",
  buttonId: "puzzle6UnlockBtn",
  length: 5,
  allow: "letters",
  correct: "SINUN",
onSuccess: () => {
  celebrateSuccess(); 
  hideError();
  showWelcomeViewById("puzzle7View");
  puzzle7Lock?.focusFirst();
},
  onFail: () => {
    showError("Not quite. Use coupon code from the card for a hint.");
  },
});

/* ---------------------------
   PUZZLE 7: (ENNIR) FINAL
---------------------------- */

const puzzle7Lock = setupCodeLock({
  boxesId: "puzzle7Boxes",
  buttonId: "puzzle7UnlockBtn",
  length: 5,
  allow: "letters",
  correct: "ENNIR",
  caseInsensitive: true,

  onSuccess: () => {
    celebrateFinal(); 
    hideError();

    if (puzzle7InputWrap) puzzle7InputWrap.classList.add("hidden");
    if (puzzle7SuccessMsg) puzzle7SuccessMsg.classList.remove("hidden");
  },

  onFail: () => {
    showError("Not quite. Use coupon code from the card for a hint.");
  },
});
