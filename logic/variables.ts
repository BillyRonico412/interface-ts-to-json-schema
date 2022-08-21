import { AnalysisTable, Grammar, Lexem, Production } from "@ronico.billy/ll/lib/interface";

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
        value: "^number|string|boolean|null|undefined$",
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
    "Separator",
    "Blank",
    "TypeBase",
    "Key",
    "Array",
    "Pipe",
    "OpenParenthesis",
    "CloseParenthesis",
];

export const noTerms: string[] = ["S", "Decla", "Value", "T", "E", "A"];

export const productions: Production[] = [
    { noTerm: "S", sequence: ["OpenBrace", "Decla", "CloseBrace"] },
    {
        noTerm: "Decla",
        sequence: ["Key", "TwoPoint", "Value", "Separator", "Decla"],
    },
    { noTerm: "Decla", sequence: [""] },
    { noTerm: "Value", sequence: ["T", "E"] },
    { noTerm: "T", sequence: ["TypeBase", "A"] },
    { noTerm: "T", sequence: ["S", "A"] },
    {
        noTerm: "T",
        sequence: ["OpenParenthesis", "Value", "CloseParenthesis", "A"],
    },
    { noTerm: "E", sequence: ["Pipe", "T", "E"] },
    { noTerm: "E", sequence: [""] },
    { noTerm: "A", sequence: ["Array", "A"] },
    { noTerm: "A", sequence: [""] },
];

export const analysisTables: AnalysisTable[] = [
    {
        noTerm: "S",
        terms: ["OpenBrace"],
        production: productions[0],
    },
    {
        noTerm: "Decla",
        terms: ["Key"],
        production: productions[1],
    },
    {
        noTerm: "Decla",
        terms: ["CloseBrace"],
        production: productions[2],
    },
    {
        noTerm: "Value",
        terms: ["OpenBrace"],
        production: productions[3],
    },
    {
        noTerm: "Value",
        terms: ["TypeBase"],
        production: productions[3],
    },
    {
        noTerm: "Value",
        terms: ["OpenParenthesis"],
        production: productions[3],
    },
    {
        noTerm: "T",
        terms: ["OpenBrace"],
        production: productions[5],
    },
    {
        noTerm: "T",
        terms: ["TypeBase"],
        production: productions[4],
    },
    {
        noTerm: "T",
        terms: ["OpenParenthesis"],
        production: productions[6],
    },
    {
        noTerm: "E",
        terms: ["Separator"],
        production: productions[8],
    },
    {
        noTerm: "E",
        terms: ["Pipe"],
        production: productions[7],
    },
    {
        noTerm: "E",
        terms: ["CloseParenthesis"],
        production: productions[8],
    },
    {
        noTerm: "A",
        terms: ["Separator"],
        production: productions[10],
    },
    {
        noTerm: "A",
        terms: ["Array"],
        production: productions[9],
    },
    {
        noTerm: "A",
        terms: ["Pipe"],
        production: productions[10],
    },
    {
        noTerm: "A",
        terms: ["CloseParenthesis"],
        production: productions[10],
    },
];

export const grammar: Grammar = {
    terms,
    noTerms,
    productions,
    firstSymbol: "S",
};
