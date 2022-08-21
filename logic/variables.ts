import {
    AnalysisTable,
    Grammar,
    Lexem,
    Production,
} from "@ronico.billy/ll/lib/interface";

export const lexems: Lexem[] = [
    {
        name: "OpenBrace",
        value: "^\\{$",
    },
    {
        name: "CloseBrace",
        value: "^\\}$",
    },
    {
        name: "TwoPoint",
        value: "^\\:$",
    },
    {
        name: "InterogationTwoPoint",
        value: "^\\?\\:$",
    },
    {
        name: "Separator",
        value: "^\\;$",
    },
    {
        name: "Blank",
        value: "^(( +)|(\\n+)|(\\t+))$",
        extensible: true,
    },
    {
        name: "TypeBase",
        value: "^(number|string|boolean|null|undefined)$",
    },
    {
        name: "Key",
        value: "^((_[a-zA-Z0-9_]*)|([a-zA-Z][a-zA-Z0-9_]*))$",
        extensible: true,
    },
    {
        name: "Array",
        value: "^\\[\\]$",
        extensible: true,
    },
    {
        name: "Pipe",
        value: "^\\|$",
    },
    {
        name: "OpenParenthesis",
        value: "^\\($",
    },
    {
        name: "CloseParenthesis",
        value: "^\\)$",
    },
];

export const terms: string[] = [
    "OpenBrace",
    "CloseBrace",
    "TwoPoint",
    "InterogationTwoPoint",
    "Separator",
    "Blank",
    "TypeBase",
    "Key",
    "Array",
    "Pipe",
    "OpenParenthesis",
    "CloseParenthesis",
];

export const noTerms: string[] = [
    "S",
    "Decla",
    "Value",
    "B",
    "C",
    "T",
    "E",
    "A",
];

export const productions: Production[] = [
    { noTerm: "S", sequence: ["OpenBrace", "Decla", "CloseBrace"] },
    {
        noTerm: "Decla",
        sequence: ["Key", "B", "Value", "Separator", "Decla"],
    },
    { noTerm: "B", sequence: ["TwoPoint"] },
    { noTerm: "B", sequence: ["InterogationTwoPoint"] },
    { noTerm: "Decla", sequence: [""] },
    { noTerm: "Value", sequence: ["T", "E"] },
    { noTerm: "T", sequence: ["C", "A"] },
    { noTerm: "C", sequence: ["TypeBase"] },
    { noTerm: "C", sequence: ["S"] },
    {
        noTerm: "C",
        sequence: ["OpenParenthesis", "Value", "CloseParenthesis"],
    },
    { noTerm: "E", sequence: ["Pipe", "T", "E"] },
    { noTerm: "E", sequence: [""] },
    { noTerm: "A", sequence: ["Array", "A"] },
    { noTerm: "A", sequence: [""] },
];

export const grammar: Grammar = {
    terms,
    noTerms,
    productions,
    firstSymbol: "S",
};
