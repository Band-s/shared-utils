import _ from "lodash";

export type RenderOptions = _.TemplateOptions;

/**
 * Renders a lodash template with the given data.
 *
 * Callers may pass lodash template options straight through (custom
 * delimiters, `variable`, `imports`, ...).
 */
export function renderTemplate(tpl: string, data: object, options?: RenderOptions): string {
  return _.template(tpl, options)(data);
}
