// script.js
// Features implemented:
// 1) Dark/Light mode toggle via a button with id="mode-toggle"
// 2) Click ingredients to toggle strikethrough
// 3) Click instructions to toggle checkmarks
// 4) Keyboard shortcuts: M = toggle mode, R = reset page styles and progress
// 5) "Bake Cookies" button appears only after every instruction is checked; clicking it alerts the user

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // ====== SELECT CORE ELEMENTS ======
    // Button to toggle dark/light mode (user will add to HTML)
    const modeBtn = document.getElementById('mode-toggle');

    // Assume the first UL is Ingredients and the first OL is Instructions
    const ingredientsList = document.querySelector('ul');
    const instructionList = document.querySelector('ol');

    // Guard clauses in case the structure changes
    if (!ingredientsList || !instructionList) {
        console.warn('Expected a <ul> for ingredients and an <ol> for instructions were not found.');
    }

    const ingredientItems = ingredientsList ? Array.from(ingredientsList.querySelectorAll('li')) : [];
    const instructionItems = instructionList ? Array.from(instructionList.querySelectorAll('li')) : [];

    // Create (but do not show yet) the "Bake Cookies" button
    const bakeBtn = document.createElement('button');
    bakeBtn.id = 'bake-btn';
    bakeBtn.textContent = 'Bake Cookies';
    bakeBtn.style.display = 'none'; // hidden until all steps are checked
    bakeBtn.addEventListener('click', () => {
        alert('Cookies are ready!');
    });

    // Insert the bake button right after the instructions list
        const buttonContainer = document.getElementById('button-container');
        if (buttonContainer) {
            // Insert before the toggle button
            const toggleBtn = document.getElementById('mode-toggle');
            buttonContainer.insertBefore(bakeBtn, toggleBtn);
        }

    // ====== DARK / LIGHT MODE ======
    // Minimal inline styling for demo purposes (you can move these to CSS later).
    function applyDarkModeStyles(isDark) {
    if (isDark) {
        body.style.background = '#1f1f1f';
        body.style.color = '#e9e6e2';

        // Headings
        document.querySelectorAll('h1, h2').forEach((el) => {
        el.style.color = '#ffcb5a';  // warm golden tone
        });
    } else {
        body.style.background = ''; // reset to CSS default
        body.style.color = '';

        // Reset headings
        document.querySelectorAll('h1, h2').forEach((el) => {
        el.style.color = ''; // let CSS stylesheet take over again
        });
    }
    }

    function toggleMode() {
        const isDark = !body.classList.contains('dark-mode');
        body.classList.toggle('dark-mode', isDark);
        applyDarkModeStyles(isDark);
    }

    // Wire the button if present
    if (modeBtn) {
        modeBtn.addEventListener('click', toggleMode);
    }

    // ====== INGREDIENTS: STRIKETHROUGH ON CLICK ======
    ingredientItems.forEach((li) => {
        li.addEventListener('click', () => {
        // Toggle a simple inline style for clarity in a single-file demo.
        const struck = li.style.textDecoration === 'line-through';
        li.style.textDecoration = struck ? '' : 'line-through';
        li.style.opacity = struck ? '' : '0.75';
        });
    });

    // ====== INSTRUCTIONS: CHECKMARKS ON CLICK ======
    // Prepare each instruction: prepend a checkmark slot (span)
    instructionItems.forEach((li) => {
        const mark = document.createElement('span');
        mark.className = 'checkmark';
        mark.textContent = '⬜ '; // empty box to start
        mark.style.userSelect = 'none';
        li.prepend(mark);

        li.addEventListener('click', (e) => {
        // If user clicks the mark or the text—toggle the state
        const isChecked = li.dataset.checked === 'true';
        li.dataset.checked = isChecked ? 'false' : 'true';

        // Update visual mark and optional styling
        const markSpan = li.querySelector('.checkmark');
        if (markSpan) markSpan.textContent = li.dataset.checked === 'true' ? '✅ ' : '⬜ ';
        li.style.fontWeight = li.dataset.checked === 'true' ? '600' : '';
        li.style.background = li.dataset.checked === 'true' ? 'rgba(153, 205, 50, 0.15)' : '';

        maybeRevealBakeButton();
        });
    });

    function allInstructionsChecked() {
        return instructionItems.length > 0 && instructionItems.every((li) => li.dataset.checked === 'true');
    }

    function maybeRevealBakeButton() {
        if (allInstructionsChecked()) {
        bakeBtn.style.display = 'inline-block';
        } else {
        bakeBtn.style.display = 'none';
        }
    }

    // ====== KEYBOARD SHORTCUTS ======
    // M = toggle mode, R = reset
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'm') {
        toggleMode();
        } else if (key === 'r') {
        resetAll();
        }
    });

    // ====== RESET EVERYTHING ======
    function resetAll() {
        // Reset mode
        body.classList.remove('dark-mode');
        applyDarkModeStyles(false);

        // Clear ingredient strikes
        ingredientItems.forEach((li) => {
        li.style.textDecoration = '';
        li.style.opacity = '';
        });

        // Clear instruction checks
        instructionItems.forEach((li) => {
        li.dataset.checked = 'false';
        li.style.fontWeight = '';
        li.style.background = '';
        const markSpan = li.querySelector('.checkmark');
        if (markSpan) markSpan.textContent = '⬜ ';
        });

        // Hide the bake button
        bakeBtn.style.display = 'none';
    }
});