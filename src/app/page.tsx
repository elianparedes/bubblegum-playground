"use client";

import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import createCompilerModule from "../compiler/Compiler";
import BubblegumLogo from "@/components/logo";
import { PlayIcon } from "lucide-react";

const editorOptions = {
    fontSize: 13,
};

function wrapParse(Module: any) {
    return function (code: string, callback: Function): void {
        let codePtr = Module.stringToNewUTF8(code);

        // Call the C function using ccall
        let result = Module.ccall("getCode", "number", ["number"], [codePtr]);
        let parsedCode = Module.UTF8ToString(result);

        Module._free(result);
        Module._free(codePtr);

        callback(parsedCode);
    };
}

export default function Home() {
    const [value, setValue] = useState<string | undefined>(
        "Rectangle(width: 300, height: 300, fill-color: #00ff00)"
    );
    const [parse, setParse] = useState<Function>();

    const [code, setCode] = useState("");

    useEffect(() => {
        createCompilerModule().then((Module: any) => {
            setParse(() => wrapParse(Module));
        });
        console.log("adg");
    }, [code]);

    function handleParse() {
        if (!parse) {
            return;
        }

        parse(value, (code: string) => setCode(code));
    }

    function handleEditorChange(value: string | undefined, ev: any) {
        setValue(value);
    }

    useEffect(() => {
        console.log(code);
    });

    if (!parse) return <div>Loading environment...</div>;

    return (
        <div className="grid grid-cols-[1fr_100vh] grid-rows-[48px_1fr] h-[100vh] bg-white dark:bg-neutral-900">
            <header
                data-tauri-drag-region
                className="col-start-1 col-end-3 row-start-1 row-end-2 border-b dark:border-neutral-800 border-neutral-200 flex justify-between items-center pl-7 pr-2"
            >
                <BubblegumLogo className="hover:scale-125 duration-150" />
                <div
                    onClick={handleParse}
                    className="h-full px-4 bg-neutral-900 hover:bg-[#D73FB9] duration-100 border border-neutral-800 flex items-center cursor-pointer"
                >
                    <PlayIcon size={16} />
                </div>
            </header>

            <section className="col-start-1 col-end-2 row-start-2 row-end-3 border-r dark:border-neutral-800 border-neutral-200 flex flex-col overflow-y-hidden ">
                <Editor
                    defaultLanguage="dart"
                    value={value}
                    theme="vs-dark"
                    options={editorOptions}
                    onChange={handleEditorChange}
                />
            </section>

            <main className="flex-grow overflow-y-auto transition-colors duration-300">
                <iframe
                    srcDoc={code.replace(/(\r\n|\n|\r|\t)/gm, "")}
                    className="w-full h-full"
                />
            </main>
        </div>
    );
}
