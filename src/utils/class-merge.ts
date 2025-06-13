/**
 * Merge a list of CSS classes into a single CSS super class list.
 * @param classes
 */
export const cx = (...classes: (string | undefined)[]) => {
  let clazzes = '';
  for (const clazz of classes) {
    if (!clazz) continue;
    else {
      clazzes = clazzes + ' ' + clazz;
    }
  }
  return clazzes.trim();
};
