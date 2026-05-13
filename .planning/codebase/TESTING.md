# Testing

## Test Framework
- **Unit/Integration:** Jest 29 + `jest-environment-jsdom` + `@testing-library/react` + `jest-axe` (installed as devDependencies)
- **E2E:** Cypress 14 (installed as devDependency)

## Test Types Present
- **None** — frameworks are installed but no tests have been written

## Coverage
- **0%** — zero test files exist anywhere in the codebase
- No `.test.tsx`, `.spec.ts`, or `__tests__/` directories found
- No `jest.config.*` or `cypress.config.*` configuration files exist
- Testing infrastructure installed but never configured or used

## Test Organization
- N/A — no tests exist

## Key Test Patterns
- N/A — no tests exist

## Notes
- `jest-axe` being installed suggests accessibility testing was intended
- Cypress suggests E2E user flow testing was planned
- This is a significant gap — the entire codebase has zero test coverage
- Setting up Jest config and writing initial tests would be a high-priority improvement
