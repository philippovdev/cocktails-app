export default function (str: string) {
  if (!str) {
    throw new Error('String is required');
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}
