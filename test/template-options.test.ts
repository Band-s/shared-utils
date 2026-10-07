import { test } from "node:test";
import assert from "node:assert/strict";
import _ from "lodash";
import { renderTemplate } from "../src/index.js";

test("rejects an unsafe template variable option at compile time", () => {
  // CVE-2021-23337: `variable` is written into the generated function source.
  // Compile only — never call a template built from this option.
  assert.throws(() => {
    _.template("hello", { variable: "a = 0" });
  });
});

test("rejects caller-supplied template variable and imports options", () => {
  const realTemplate = _.template;
  // Stand-in so an unfixed renderTemplate cannot compile or call untrusted options.
  _.template = (() => () => "blocked") as typeof _.template;
  try {
    assert.throws(
      () => renderTemplate("hello", {}, { variable: "a = 0" }),
      /Invalid template option/,
    );
    assert.throws(
      () => renderTemplate("hello", {}, { imports: { ok: true } }),
      /Invalid template option/,
    );
  } finally {
    _.template = realTemplate;
  }
});
