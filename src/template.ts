import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

/** Plain JavaScript identifier, e.g. "r" or "data". */
const PLAIN_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Validates input before it reaches `_.template`.
 *
 * Two arguments are `(templateString, options)`. A single string is a
 * `variable` value. Any other single argument is an options object.
 * Rejects a non-identifier `variable`, an `imports` option, and wrong types.
 */
export function validateTemplateInput(templateOrVariable: unknown, options?: unknown): void {
  if (arguments.length >= 2) {
    if (typeof templateOrVariable !== "string") {
      throw new TypeError("Invalid template string passed into `_.template`");
    }
  } else if (typeof templateOrVariable === "string") {
    if (!PLAIN_IDENTIFIER.test(templateOrVariable)) {
      throw new Error("Invalid `variable` option passed into `_.template`");
    }
    return;
  } else {
    options = templateOrVariable;
  }

  if (options === undefined) {
    return;
  }
  if (options === null || typeof options !== "object" || Array.isArray(options)) {
    throw new TypeError("Invalid template options passed into `_.template`");
  }

  const opts = options as { variable?: unknown; imports?: unknown };
  if (Object.prototype.hasOwnProperty.call(opts, "imports")) {
    throw new Error("Invalid `imports` option passed into `_.template`");
  }
  if (opts.variable !== undefined) {
    if (typeof opts.variable !== "string" || !PLAIN_IDENTIFIER.test(opts.variable)) {
      throw new Error("Invalid `variable` option passed into `_.template`");
    }
  }
}

/**
 * Renders a lodash template with the given data.
 * Safe options still work, including custom delimiters and a plain-identifier
 * `variable`. Unsafe input is rejected before compilation.
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  validateTemplateInput(tpl, options);
  return _.template(tpl, options)(data);
}
