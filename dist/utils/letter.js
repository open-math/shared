export function getRandomLatinLetter(random, casing = 'any') {
    const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letters = casing === 'lower'
        ? lowerLetters
        : casing === 'upper'
            ? upperLetters
            : lowerLetters + upperLetters;
    return random.arrayElement(letters.split(''));
}
