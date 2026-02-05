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
    COLD: "There might be a useful item on the table.",
    GROW: "Sometimes the answer is on the other side.",
    POTS: "Do the colors and patterns look familiar?",
    DATE: "If it is valuable, it goes on the fridge.",
    HELP: "Where I see myself, you can see your words.",
    BUTT: "I wonder how many alphabets there are...?",
    CLUB: "Suddenly all the places can be found where we sit and relax.",
    KISS: "We started from somewhere, found ourselves disappearing in a moment elsewhere and ended up here.",
    GIFT: "Reading is a useful hobby, especially for solving mysteries.",
    AUER: "Now you know where to look. I'ts simply the first you see.",
    BEST: "Rakas!",
    WINE: "Tommy said it well.",
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
  hideError();
  showWelcomeViewById("puzzle4View");
  puzzle4Lock?.focusFirst();
},
  onFail: () => {
    showError("Not quite. Use coupon code from the card for a hint.");
  },
});
