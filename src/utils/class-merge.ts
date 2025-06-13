/**
 * Merge a list of CSS classes into a single CSS super class list.
 * @param classes
 */
export const cx = (...classes: string[]) =>
  classes.reduce((clazz, curr) => (curr + ' ' + clazz).trim(), '');
