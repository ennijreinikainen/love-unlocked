# Love Unlocked

Love Unlocked is an interactive multi-step puzzle web application built with vanilla HTML, CSS, and JavaScript.

The project guides the user through a sequence of logic-based challenges, featuring animated transitions, reusable code-lock components, audio feedback, confetti effects, and a dynamic hint system.

It was originally created as a creative puzzle experience combining real life challenges with instructions and hints given through the application, and later refined into a public demo project to showcase front-end development skills.

---

## Features

- Multi-step puzzle navigation system
- Reusable code-lock component for different puzzles
- Dynamic hint system with contextual messages
- Error handling with animations and sound feedback
- Confetti and audio celebration effects
- Responsive layout
- Custom typography and UI styling
- Tooltip system for contextual guidance
- Smooth transitions between screens

---

## Technologies Used

- HTML5
- CSS3 (Flexbox, animations, transitions)
- Vanilla JavaScript (ES6+)
- DOM manipulation
- Event handling
- Audio API
- Dynamic element generation

No frameworks or libraries were used — all logic is implemented manually.

---

## Technical Highlights

### Reusable Code Lock Component

The project uses a configurable `setupCodeLock()` function to handle:

- Character validation (digits / letters / alphanumeric)
- Auto-focus behavior between inputs
- Case-insensitive comparisons
- Success and failure callbacks
- Shake animations on error
- Sound feedback integration

This allows the same logic to power multiple puzzles with different validation rules and success behaviors.

### Dynamic Confetti Animation

Confetti pieces are dynamically generated and styled using JavaScript and CSS animations.

### Audio Unlock Strategy

Because modern browsers restrict autoplay, the app implements a one-time audio unlock mechanism triggered by the first user interaction.

---

## How to Run

### Option 1 – Directly
Open `index.html` in your browser.

### Option 2 – VS Code Live Server (Recommended)
1. Install Live Server extension
2. Right-click `index.html`
3. Select **Open with Live Server**

---

## Project Structure

love-unlocked
├── /assets     
│   ├── /audio   # Sound effects (success, error, applause, etc.)
│   └── /images  # UI graphics and puzzle-related images
├── index.html   # Main application markup and layout structure
├── style.css    # Styling, animations, and UI layout
├── script.js    # Application logic, puzzle system, and interactions
└── README.md

---

## Purpose of the Project

This project demonstrates:

- Clean DOM manipulation
- UI state switching without frameworks
- Component-style logic in vanilla JavaScript
- User feedback systems (visual + audio)
- Thoughtful UI/UX design

It focuses on interaction design and reusable front-end logic rather than backend validation or security.

---

## Future Improvements

- Refactor into modular JS structure
- Convert into a small SPA architecture
- Add scoring system
- Add time
- Add progressive difficulty scaling

---

## Author

Enni R.

Front-end oriented developer passionate about interactive experiences and UI design.
