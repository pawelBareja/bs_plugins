---
description: "React coding standards, hooks usage, and performance patterns for component files"
applyTo: "**/*.tsx"
---

- Use functional components with hooks instead of class components.
- Implement `React.memo()` for expensive components that render often with the same props.
- Utilize `React.lazy()` and `Suspense` for code-splitting and performance optimization.
- Use `useCallback` for event handlers passed to child components to prevent unnecessary re-renders.
- Prefer `useMemo` for expensive calculations to avoid recomputation on every render.
- Implement `useId()` for generating unique IDs for accessibility attributes.
- Use the `use` hook for data fetching in React 19+ projects.
- Consider `useOptimistic` for optimistic UI updates in forms.
- Use `useTransition` for non-urgent state updates to keep the UI responsive.
- Use custom hooks to separate business logic from the view layer and reduce component complexity.
- Never use `any` — define strict TypeScript types.
- Minimize logic in JSX — move conditionals and derived values to JS above the `return`.
