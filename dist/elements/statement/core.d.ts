export declare const statementAccent: {
    _sectionNames: ["proof"];
    accent: {
        schema: Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"statement">, "SectionNames"> & {
            SectionNames: ["proof"];
        };
        tag: import("@erudit-js/prose").ToEruditTag<Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"statement">, "SectionNames"> & {
            SectionNames: ["proof"];
        }, "Statement", {
            title: string;
        } & ({
            row?: true;
            column?: undefined;
        } | {
            row?: undefined;
            column?: true;
        })>;
        coreElement: {
            readonly schema: Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"statement">, "SectionNames"> & {
                SectionNames: ["proof"];
            };
            readonly tags: [import("@erudit-js/prose").ToEruditTag<Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"statement">, "SectionNames"> & {
                SectionNames: ["proof"];
            }, "Statement", {
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
        schema: import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"statement">;
        tag: import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"statement">, "StatementMain", unknown>;
        coreElement: {
            readonly schema: import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"statement">;
            readonly tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"statement">, "StatementMain", unknown>];
        };
    };
    section: {
        schema: import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"statement">;
        tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"statement">, "StatementSection", {
            title: string;
        }>, ...import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"statement">, "StatementProof", unknown>[]];
        coreElement: {
            readonly schema: import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"statement">;
            readonly tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"statement">, "StatementSection", {
                title: string;
            }>, ...import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"statement">, "StatementProof", unknown>[]];
        };
    };
};
declare const _default: [{
    readonly schema: Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"statement">, "SectionNames"> & {
        SectionNames: ["proof"];
    };
    readonly tags: [import("@erudit-js/prose").ToEruditTag<Omit<import("@erudit-js/prose/elements/accent/core").AccentSchema<"statement">, "SectionNames"> & {
        SectionNames: ["proof"];
    }, "Statement", {
        title: string;
    } & ({
        row?: true;
        column?: undefined;
    } | {
        row?: undefined;
        column?: true;
    })>];
}, {
    readonly schema: import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"statement">;
    readonly tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentMainSchema<"statement">, "StatementMain", unknown>];
}, {
    readonly schema: import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"statement">;
    readonly tags: [import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"statement">, "StatementSection", {
        title: string;
    }>, ...import("@erudit-js/prose").ToEruditTag<import("@erudit-js/prose/elements/accent/core").AccentSectionSchema<"statement">, "StatementProof", unknown>[]];
}];
export default _default;
