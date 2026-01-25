export const translations = {
    en: {
        name: 'English',
        link: 'https://en.omath.net',
    },
    ru: {
        name: 'Русский',
        link: 'https://omath.ru',
    },
};

export const defaultAssets = {
    logotype:
        'https://raw.githubusercontent.com/open-math/shared/refs/heads/main/assets/logotype.svg',
    favicon: {
        default:
            'https://raw.githubusercontent.com/open-math/shared/refs/heads/main/assets/favicons/default.svg',
        group: 'https://raw.githubusercontent.com/open-math/shared/refs/heads/main/assets/favicons/group.svg',
        book: 'https://raw.githubusercontent.com/open-math/shared/refs/heads/main/assets/favicons/book.svg',
        page: 'https://raw.githubusercontent.com/open-math/shared/refs/heads/main/assets/favicons/page-article.svg',
        article:
            'https://raw.githubusercontent.com/open-math/shared/refs/heads/main/assets/favicons/page-article.svg',
        summary:
            'https://raw.githubusercontent.com/open-math/shared/refs/heads/main/assets/favicons/summary.svg',
        practice:
            'https://raw.githubusercontent.com/open-math/shared/refs/heads/main/assets/favicons/practice.svg',
    },
    ogImage: {
        src: 'https://raw.githubusercontent.com/open-math/shared/refs/heads/main/assets/og.png',
        width: 500,
        height: 500,
    },
    indexPageBanner: {
        src: 'https://raw.githubusercontent.com/open-math/shared/refs/heads/main/assets/index-page-banner.png',
        maxWidth: '100%',
        invert: 'dark',
    } as const,
    loadingSvg: `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;"  viewBox="10 10 80 80" preserveAspectRatio="xMidYMid">
            <path fill="none" stroke="currentColor" stroke-width="10" stroke-dasharray="230.93003540039064 25.658892822265614" d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z" stroke-linecap="round" style="transform:scale(0.8);transform-origin:50px 50px">
                <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1.25s" keyTimes="0;1" values="0;256.58892822265625"></animate>
            </path>
        </svg>
    `,
};

export const defaultElements = [
    '@erudit-js/prose/elements/math',
    '@erudit-js/prose/elements/diagram',
    '@open-math/shared/elements/term',
    '@open-math/shared/elements/statement',
    '@open-math/shared/elements/important',
];

export const defaultCountElements = [
    'accent_term',
    'accent_statement',
    'accent_important',
    ['problem', 'problems'],
];
