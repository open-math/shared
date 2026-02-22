export declare const importantAccent: {
    _sectionNames: [];
    accent: {
        schema: Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"important">, "SectionNames"> & {
            SectionNames: [];
        };
        tag: import("@erudit-js/prose").ToEruditTag<Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"important">, "SectionNames"> & {
            SectionNames: [];
        }, "Important", {
            title: string;
        } & ({
            row?: true;
            column?: undefined;
        } | {
            row?: undefined;
            column?: true;
        })>;
        coreElement: {
            readonly schema: Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"important">, "SectionNames"> & {
                SectionNames: [];
            };
            readonly tags: [import("@erudit-js/prose").ToEruditTag<Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"important">, "SectionNames"> & {
                SectionNames: [];
            }, "Important", {
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
        schema: import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"important">;
        tag: import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"important">, "ImportantMain", unknown>;
        coreElement: {
            readonly schema: import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"important">;
            readonly tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"important">, "ImportantMain", unknown>];
        };
    };
    section: {
        schema: import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"important">;
        tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"important">, "ImportantSection", {
            title: string;
        }>, ...never[]];
        coreElement: {
            readonly schema: import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"important">;
            readonly tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"important">, "ImportantSection", {
                title: string;
            }>, ...never[]];
        };
    };
};
declare const _default: [{
    readonly schema: Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"important">, "SectionNames"> & {
        SectionNames: [];
    };
    readonly tags: [import("@erudit-js/prose").ToEruditTag<Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"important">, "SectionNames"> & {
        SectionNames: [];
    }, "Important", {
        title: string;
    } & ({
        row?: true;
        column?: undefined;
    } | {
        row?: undefined;
        column?: true;
    })>];
}, {
    readonly schema: import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"important">;
    readonly tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"important">, "ImportantMain", unknown>];
}];
export default _default;
