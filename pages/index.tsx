import type { NextPage } from "next";
import { SiTypescript } from "react-icons/si";
import { BsBraces } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { LL, parser, scanner } from "@ronico.billy/ll";
import { grammar, lexems } from "../logic/variables";
import {
    initNode,
    parentNode,
    pop,
    treeToJsonSchema,
} from "../logic/transformation";
import { formatStringError } from "../logic/utils";

const Home: NextPage = () => {
    const timeoutInput = useRef<number | null>(null);
    const [tscode, setTscode] = useState("{}");
    const [jsonSchemaCode, setJsonSchemaCode] = useState("");
    const [isDone, setIsDone] = useState(false);
    const [textError, setTextError] = useState("");

    useEffect(() => {
        initNode();
        const tokens = scanner(lexems, tscode);
        const k = 1;
        const ll = LL(k, grammar);
        if (ll) {
            try {
                const resultParse = parser(ll, pop, ["Blank"]);
                if (!Array.isArray(tokens)) {
                    console.log(tokens);
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
    }, [tscode]);

    return (
        <div className="container mx-auto h-screen flex items-center gap-x-12">
            <div className="h-3/4 w-full bg-editor-2 flex flex-col">
                <h2 className="font-semibold text-white flex">
                    <span className="bg-editor-1 py-2 px-4 border-4 border-editor-2 flex justify-center items-center gap-x-2">
                        <SiTypescript className="text-xl text-blue-600 bg-white" />
                        Typescript
                    </span>
                </h2>
                <textarea
                    className="bg-editor-1 w-full flex-grow resize-none outline-none px-4 py-4 font-secondaire font-semibold text-gray-300"
                    onInput={(e) => {
                        setTscode(e.currentTarget.value);
                    }}
                    value={tscode}
                ></textarea>
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
                <div className="bg-editor-1 w-full flex-grow resize-none outline-none text-white px-4 py-4 text-sm font-semibold">
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
    );
};

export default Home;
