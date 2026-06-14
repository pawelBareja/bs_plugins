---
description: "SCSS and CSS Modules styling standards for component stylesheet files"
applyTo: "**/*.module.scss"
---

## General

- Never use inline styles — define all styles in `.module.scss` files.
- Never use `!important` — fix specificity by using more specific selectors or refactoring SCSS structure.

## Units

- Use `rem` for font sizes, margins, and padding. Use `px` only for borders and elements that must not scale.
- Animate `transform` and `opacity` only — avoid animating `width`, `height`, `top`, or `left` (causes reflows).
