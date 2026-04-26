/* =========================================================
   Test setup — runs once before any test file (per bunfig.toml
   `[test].preload`). Two responsibilities:

   1. Register happy-dom as the global DOM environment so React
      Testing Library can render components into a virtual DOM.
   2. Wire @testing-library/jest-dom matchers (toBeInTheDocument,
      toHaveAttribute, etc.) into Bun's expect.
   ========================================================= */

import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();

import { expect } from "bun:test";
import * as matchers from "@testing-library/jest-dom/matchers";

// jest-dom exports a record of matchers; bun's expect.extend accepts
// the same object shape Jest does.
expect.extend(matchers as Record<string, (...args: unknown[]) => unknown>);
