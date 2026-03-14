import type { EruditConfig } from '@erudit-js/core/eruditConfig/config';
export declare const translations: {
    en: {
        name: string;
        link: string;
    };
    ru: {
        name: string;
        link: string;
    };
};
type AugmentationFn = NonNullable<EruditConfig['nuxtAugmentations']>[0];
export declare const sharedPublicAugmentation: AugmentationFn;
export declare const defaultAssets: {
    logotype: string;
    favicon: {
        default: string;
        group: string;
        book: string;
        page: string;
        article: string;
        summary: string;
        practice: string;
    };
    indexPageBanner: {
        readonly src: string;
        readonly maxWidth: "100%";
        readonly invert: "dark";
    };
    loadingSvg: string;
};
export declare const omathOgImage: {
    type: "auto";
    logotype: string;
    siteColor: string;
};
export declare const omathStyle: {
    brandColor: string;
};
export declare const defaultElements: string[];
export declare const defaultCountElements: (string | string[])[];
export declare const openMathDependencies: {
    mathjs: {
        optimize: boolean;
    };
};
export {};
