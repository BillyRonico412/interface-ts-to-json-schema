import type { NextPage } from "next";
import { SiTypescript } from "react-icons/si";
import { BsBraces, BsFillTrashFill } from "react-icons/bs";
import { useEffect, useMemo, useRef, useState } from "react";
import { LL, parser, scanner } from "@ronico.billy/ll";
import { grammar, lexems } from "../logic/variables";
import {
    initNode,
    parentNode,
    pop,
    treeToJsonSchema,
} from "../logic/transformation";
import { formatStringError } from "../logic/utils";
import range from "@ronico.billy/range";
import Head from "next/head";

const Home: NextPage = () => {
    const timeoutInput = useRef<number | null>(null);
    const [tscode, setTscode] = useState("{}");
    const numberAlineaInTscode = useMemo(
        () => tscode.split("").filter((s) => s === "\n").length + 1,
        [tscode]
    );
    const [jsonSchemaCode, setJsonSchemaCode] = useState("");
    const [isDone, setIsDone] = useState(false);
    const [textError, setTextError] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const lineRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.value = "{}";
        }
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js");
        }
    }, []);

    useEffect(() => {
        console.log(numberAlineaInTscode);
        initNode();
        const tokens = scanner(lexems, tscode);
        const k = 1;
        const ll = LL(k, grammar);
        if (ll) {
            try {
                const resultParse = parser(ll, pop, ["Blank"]);
                if (!Array.isArray(tokens)) {
                    setIsDone(false);
                    setTextError(
                        `Lexical Error: Unknown Token [${tokens.unknownChar}] at ${tokens.line}:${tokens.col}`
                    );
                } else {
                    const result = resultParse(tokens);
                    if (typeof result === "boolean") {
                        const jsonSchema = treeToJsonSchema(parentNode);
                        const jsonSchemaStringify = JSON.stringify(
                            jsonSchema,
                            null,
                            "  "
                        );
                        setJsonSchemaCode(jsonSchemaStringify);
                        setIsDone(true);
                    } else {
                        setTextError(
                            `${result.message} at ${result.line}:${result.col}\n${result.stringWithColored}`
                        );
                        setIsDone(false);
                    }
                }
            } catch (e) {
                setIsDone(false);
                console.log(e);
            }
        } else {
            throw new Error("Not LL(" + k + ")");
        }
    }, [numberAlineaInTscode, tscode]);

    return (
        <>
            <Head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/favicon/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>
            <div className="container mx-auto px-4 h-screen flex items-center gap-x-12">
                <div className="h-3/4 w-full bg-editor-2 flex flex-col">
                    <h2 className="font-semibold text-white flex">
                        <span className="bg-editor-1 py-2 px-4 border-4 border-editor-2 flex justify-center items-center gap-x-2">
                            <SiTypescript className="text-xl text-blue-600 bg-white" />
                            Typescript
                        </span>
                        <button
                            className="ml-auto mr-4 text-gray-300"
                            onClick={() => {
                                if (textareaRef.current) {
                                    textareaRef.current.value = "";
                                }
                                setTscode("");
                            }}
                        >
                            <BsFillTrashFill />
                        </button>
                    </h2>
                    <div className="flex flex-grow overflow-hidden">
                        <div
                            className="text-gray-300 px-2 py-4 font-black overflow-hidden"
                            ref={lineRef}
                        >
                            <pre className="text-right">
                                {range
                                    .range(numberAlineaInTscode)
                                    .map((it) => it + 1 + "\n")}
                            </pre>
                        </div>
                        <textarea
                            ref={textareaRef}
                            className="bg-editor-1 w-full flex-grow resize-none outline-none px-4 py-4 font-secondaire font-semibold text-gray-300"
                            onChange={(e) => {
                                if (lineRef.current) {
                                    lineRef.current.scrollTop =
                                        e.currentTarget.scrollTop;
                                }
                                if (timeoutInput.current !== null) {
                                    window.clearTimeout(timeoutInput.current);
                                }
                                const value = e.currentTarget.value;
                                timeoutInput.current = window.setTimeout(() => {
                                    setTscode(value);
                                    timeoutInput.current = null;
                                }, 1000);
                            }}
                            onPaste={(e) => {
                                if (lineRef.current) {
                                    lineRef.current.scrollTop =
                                        e.currentTarget.scrollTop;
                                }
                                setTscode(e.currentTarget.value);
                            }}
                            onScroll={(e) => {
                                if (lineRef.current) {
                                    lineRef.current.scrollTop =
                                        e.currentTarget.scrollTop;
                                }
                            }}
                        ></textarea>
                    </div>
                </div>
                <div className="h-3/4 w-full bg-editor-2 flex flex-col">
                    <h2 className="font-semibold text-white flex items-center">
                        <span className="bg-editor-1 py-2 px-4 border-4 border-editor-2 flex justify-center items-center gap-x-2">
                            <BsBraces className="text-xl text-white" />
                            JsonSchema
                        </span>
                        {isDone ? (
                            <span className="bg-green-600 py-1 px-4 border-4 border-editor-2 flex justify-center items-center gap-x-2 rounded-xl font-black ml-auto mr-4">
                                DONE
                            </span>
                        ) : (
                            <span className="bg-red-600 py-1 px-4 border-4 border-editor-2 flex justify-center items-center gap-x-2 rounded-xl font-black ml-auto mr-4">
                                ERROR
                            </span>
                        )}
                    </h2>
                    <div className="bg-editor-1 w-full flex-grow overflow-auto resize-none outline-none text-white px-4 py-4 text-sm font-semibold">
                        {isDone ? (
                            <pre>{jsonSchemaCode}</pre>
                        ) : (
                            <div className="bg-editor-2 px-4 py-4">
                                <pre
                                    dangerouslySetInnerHTML={{
                                        __html: formatStringError(textError),
                                    }}
                                ></pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
