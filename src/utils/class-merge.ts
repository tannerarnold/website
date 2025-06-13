export const cx = (...classes: string[]) =>
  classes.reduce((clazz, curr) => (curr + ' ' + clazz).trim(), '');
