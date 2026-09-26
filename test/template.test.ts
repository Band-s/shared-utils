import { test } from "node:test";
import assert from "node:assert/strict";
import { renderTemplate, formatCents } from "../src/index.js";

test("renders interpolated values", () => {
  assert.equal(renderTemplate("Hello <%= name %>!", { name: "Ada" }), "Hello Ada!");
});

test("escapes HTML with <%- %>", () => {
  assert.equal(renderTemplate("<p><%- note %></p>", { note: "<b>hi</b>" }), "<p>&lt;b&gt;hi&lt;/b&gt;</p>");
});

test("supports a named data variable", () => {
  assert.equal(renderTemplate("Total: <%= r.total %>", { total: "$5.00" }, { variable: "r" }), "Total: $5.00");
});

test("formats cents as currency", () => {
  assert.equal(formatCents(1999), "$19.99");
});
