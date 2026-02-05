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
function showError(msg) {
  if (!errorEl) return;
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
}

function hideError() {
  if (!errorEl) return;
  errorEl.classList.add("hidden");
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
    onFail?.(`${length} characters required`);
    return;
  }

  const entered = caseInsensitive ? enteredRaw.toUpperCase() : enteredRaw;

  // NEW: support either a single string OR a map of codes -> payload/message
  if (typeof correct === "object" && correct !== null) {
    const key = entered;
    if (Object.prototype.hasOwnProperty.call(correct, key)) {
      const payload = correct[key]; // could be a message string
      clear();
      onSuccess?.(payload, key);
    } else {
      clear();
      focusFirst();
      onFail?.("Wrong code");
    }
    return;
  }

  // Old single-code behavior
  const expected = caseInsensitive
    ? String(correct).toUpperCase()
    : String(correct);

  if (entered === expected) {
    clear();
    onSuccess?.();
  } else {
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
   boxesId must match your HTML: id="pinBoxes"
   buttonId must match your HTML: id="unlockBtn"
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
    // Keep your original hint behavior
    showError("Forgot your password? Hint: Dog’s Birthday");
  },
});

/* ---------------------------
   Welcome screen top bar actions
---------------------------- */

// KISS BUTTON (mock)
kissBtn?.addEventListener("click", () => {
  alert("💋 The mastermind has been notified.");
});

// TOGGLE HINT CARD
hintBtn?.addEventListener("click", () => {
  const willShow = hintCard?.classList.contains("hidden");
  hintCard?.classList.toggle("hidden");

  if (willShow) {
    resetHintCard();
    hintLock?.focusFirst();
  }
});

/* ---------------------------
   HINT CARD UI helpers
---------------------------- */
const hintMsg = document.getElementById("hintMsg");
const hintInputWrap = document.getElementById("hintInputWrap");

function showHintMessage(text) {
  if (hintMsg) {
    hintMsg.textContent = text;
    hintMsg.classList.remove("hidden");
  }
  if (hintInputWrap) hintInputWrap.classList.add("hidden");
}

function resetHintCard() {
  if (hintMsg) {
    hintMsg.textContent = "";
    hintMsg.classList.add("hidden");
  }
  if (hintInputWrap) hintInputWrap.classList.remove("hidden");
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

  // Map of codes -> hint text
  correct: {
    COLD: "There might be a useful item on the table.",
    // add more here...
  },

  onSuccess: (hintText, codeUsed) => {
    showHintMessage(hintText);
  },

  onFail: () => {
    // optional: show a gentle message, or do nothing
    if (hintMsg) {
      hintMsg.textContent = "No hint for that code.";
      hintMsg.classList.remove("hidden");
    }
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
    hideError();
    alert("✅ Puzzle 1 solved! Next puzzle unlocked.");
    // showScreen(puzzle2); // when you have it
  },
  onFail: () => {
    showError("Not quite. Use coupon code from the card for a hint.");
  },
});
