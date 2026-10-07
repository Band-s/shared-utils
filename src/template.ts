import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

const SAFE_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/**
 * Renders a lodash template with the given data.
 *
 * A `variable` option is accepted only as a plain identifier and is applied by
 * binding the data object. Caller-supplied `imports` and `sourceURL` are
 * rejected and are not forwarded to `_.template`.
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  if (options?.imports != null || options?.sourceURL != null) {
    throw new Error("Invalid template option");
  }
  const variable = options?.variable;
  if (variable != null && !SAFE_IDENTIFIER.test(variable)) {
    throw new Error("Invalid template option");
  }

  const view = variable ? { [variable]: data } : data;
  const settings: RenderOptions = {};
  if (options?.escape != null) settings.escape = options.escape;
  if (options?.evaluate != null) settings.evaluate = options.evaluate;
  if (options?.interpolate != null) settings.interpolate = options.interpolate;
  return _.template(tpl, settings)(view);
}
