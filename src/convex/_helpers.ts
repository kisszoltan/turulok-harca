export function normalizeString(input: string) {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // remove accents
    .toLowerCase();
}
