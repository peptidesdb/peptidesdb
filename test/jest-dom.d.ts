/* =========================================================
   Type augmentation: extend Bun's expect with jest-dom matchers
   so test/components/*.test.tsx can call .toBeInTheDocument(),
   .toHaveAttribute(), etc. Runtime registration is in setup.ts.
   ========================================================= */
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "bun:test" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Matchers<T = unknown>
    extends TestingLibraryMatchers<unknown, T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchers extends TestingLibraryMatchers<unknown, void> {}
}
