export declare const termAccent: {
    _sectionNames: [];
    accent: {
        schema: Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"term">, "SectionNames"> & {
            SectionNames: [];
        };
        tag: import("@erudit-js/prose").ToEruditTag<Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"term">, "SectionNames"> & {
            SectionNames: [];
        }, "Term", {
            title: string;
        } & ({
            row?: true;
            column?: undefined;
        } | {
            row?: undefined;
            column?: true;
        })>;
        coreElement: {
            readonly schema: Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"term">, "SectionNames"> & {
                SectionNames: [];
            };
            readonly tags: [import("@erudit-js/prose").ToEruditTag<Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"term">, "SectionNames"> & {
                SectionNames: [];
            }, "Term", {
                title: string;
            } & ({
                row?: true;
                column?: undefined;
            } | {
                row?: undefined;
                column?: true;
            })>];
        };
    };
    main: {
        schema: import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"term">;
        tag: import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"term">, "TermMain", unknown>;
        coreElement: {
            readonly schema: import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"term">;
            readonly tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"term">, "TermMain", unknown>];
        };
    };
    section: {
        schema: import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"term">;
        tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"term">, "TermSection", {
            title: string;
        }>, ...never[]];
        coreElement: {
            readonly schema: import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"term">;
            readonly tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"term">, "TermSection", {
                title: string;
            }>, ...never[]];
        };
    };
};
declare const _default: [{
    readonly schema: Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"term">, "SectionNames"> & {
        SectionNames: [];
    };
    readonly tags: [import("@erudit-js/prose").ToEruditTag<Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"term">, "SectionNames"> & {
        SectionNames: [];
    }, "Term", {
        title: string;
    } & ({
        row?: true;
        column?: undefined;
    } | {
        row?: undefined;
        column?: true;
    })>];
}, {
    readonly schema: import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"term">;
    readonly tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"term">, "TermMain", unknown>];
}];
export default _default;
