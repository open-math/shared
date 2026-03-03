const DEFAULT_SKIP = ['i', 'f', 'g', 'e', 'z'];
export function getRandomLatinLetter(random, options) {
    const { casing = 'any', skip = DEFAULT_SKIP } = options ?? {};
    const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const skipLower = new Set(skip.map((l) => l.toLowerCase()));
    const pool = casing === 'lower'
        ? lowerLetters
        : casing === 'upper'
            ? upperLetters
            : lowerLetters + upperLetters;
    const filtered = pool
        .split('')
        .filter((ch) => !skipLower.has(ch.toLowerCase()));
    return random.arrayElement(filtered);
}
