## 2025-05-18 - Dark Theme Implementation
**Learning:** Implemented a new dark theme based on #0D0D12, accent #6366F1, and text #F3F4F6 while maintaining the overall structural integrity. The importance of updating secondary variables (like surface colors, borders) to maintain a cohesive UI when radically changing core colors.
**Action:** Replaced existing variables in `style.css`'s `:root` selector with appropriate dark-theme counterparts and integrated the 'Plus Jakarta Sans' font via a Google Fonts link in `index.html`.

## 2025-05-18 - Header and Mobile Drawer Refactor
**Learning:** Improved mobile UX and rendering performance by converting the mobile navigation menu from a layout-shifting animation (`right` property) to a hardware-accelerated transform (`translateX`). Dark theme glassmorphism requires fine-tuning of background opacities to remain legible.
**Action:** Updated `.navbar` to use refined glassmorphism for the dark theme. Refactored `.mobile-nav` to use `transform: translateX(100%)` for its hidden state and a smooth sliding animation.
