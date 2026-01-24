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
    },
};

export const defaultElements = [
    '@erudit-js/prose/elements/math',
    '@erudit-js/prose/elements/diagram',
    '@open-math/shared/elements/term',
    '@open-math/shared/elements/statement',
    '@open-math/shared/elements/important',
];

export const defaultCountElements = [
    [
        'accent_term',
        'accent_statement',
        'accent_important',
        ['problem', 'problems'],
    ],
];
