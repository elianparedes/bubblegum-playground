"use client";

import { bubblegumTheme } from "@/compiler/editor/theme";
import BubblegumLogo from "@/components/logo";
import loader from "@monaco-editor/loader";
import { Editor } from "@monaco-editor/react";
import { CopyIcon, PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import createCompilerModule from "../compiler/Compiler";
import { useDebouncedValue } from "@mantine/hooks";
import { useRouter, useSearchParams } from "next/navigation";

const example = String`
Center() {
    Rotate(angle: 240, duration: 1000, loop: true, alternate: true) {
        Stack() {

            Rotate(angle: 360, duration: 1400, loop: true, alternate: true) {
                Stack() {

                    Rotate(angle: 360, duration: 900, loop: true, alternate: true) {
                        Stack() {
                            TranslateX(end-value: 50, duration: 500, loop: true, alternate: true) {
                                Rectangle(width: 50, height: 50, fill-color: #0ff000)
                            },
                            TranslateY(end-value: 50, duration: 500, loop: true, alternate: true) {
                                Rectangle(width: 50, height: 50, fill-color: #ff00f0)
                            },
                            TranslateX(end-value: -50, duration: 500, loop: true, alternate: true) {
                                Rectangle(width: 50, height: 50, fill-color: #0000ff)
                            },
                            TranslateY(end-value: -50, duration: 500, loop: true, alternate: true) {
                                Rectangle(width: 50, height: 50, fill-color: #0ffff0)
                            }
                        }
                    },

                    TranslateX(end-value: 200, duration: 800, loop: true, alternate: true) {
                        Rectangle(width: 100, height: 100, fill-color: #0ff000)
                    },
                    TranslateY(end-value: 200, duration: 800, loop: true, alternate: true) {
                        Rectangle(width: 100, height: 100, fill-color: #ff00f0)
                    },
                    TranslateX(end-value: -200, duration: 800, loop: true, alternate: true) {
                        Rectangle(width: 100, height: 100, fill-color: #0000ff)
                    },
                    TranslateY(end-value: -200, duration: 800, loop: true, alternate: true) {
                        Rectangle(width: 100, height: 100, fill-color: #0ffff0)
                    }
                }
            },
            
            TranslateX(end-value: 400, duration: 1000, loop: true, alternate: true) {
                Rectangle(width: 200, height: 200, fill-color: #0ff000)
            },
            TranslateY(end-value: 400, duration: 1000, loop: true, alternate: true) {
                Rectangle(width: 200, height: 200, fill-color: #ff00f0)
            },
            TranslateX(end-value: -400, duration: 1000, loop: true, alternate: true) {
                Rectangle(width: 200, height: 200, fill-color: #0000ff)
            },
            TranslateY(end-value: -400, duration: 1000, loop: true, alternate: true) {
                Rectangle(width: 200, height: 200, fill-color: #0ffff0)
            }
        }
    }
}
`;
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
    const [value, setValue] = useState<string | undefined>(example);
    const [debounced] = useDebouncedValue(value, 1000);
    const [parse, setParse] = useState<Function>();
    const [code, setCode] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        createCompilerModule().then((Module: any) => {
            setParse(() => wrapParse(Module));
        });
    }, [code]);

    useEffect(() => {
        loader.init().then((monaco) => {
            monaco.editor.defineTheme("bubblegum", bubblegumTheme);
        });

        const encodedCode = searchParams.get("c");
        console.log(encodedCode);
        encodedCode && setValue(atob(encodedCode));
    }, []);

    function handleShare() {
        toast.success("Link copied to clipboard");
        navigator.clipboard.writeText(location.href);
    }

    function handleParse() {
        if (!parse) {
            return;
        }

        parse(value, (code: string) => {
            if (code.length === 240) {
                toast.error("Failed to create animation");
                return;
            }
            history.replaceState(null, "", `/?c=${btoa(debounced!)}`);
            toast.success("Animation created");
            setCode(code);
        });
    }

    function handleEditorChange(value: string | undefined, ev: any) {
        setValue(value);
    }

    useEffect(() => {
        handleParse();
    }, [debounced]);

    if (!parse) return <div></div>;

    return (
        <>
            <Toaster
                theme="dark"
                toastOptions={{ style: { borderRadius: 0 } }}
            />
            <div className="grid grid-cols-[1fr_100vh] grid-rows-[48px_1fr] h-[100vh] bg-white dark:bg-neutral-950">
                <header
                    data-tauri-drag-region
                    className="col-start-1 col-end-2 row-start-1 row-end-2 border-b dark:border-neutral-800 border-neutral-200 flex justify-between items-center pl-7"
                >
                    <BubblegumLogo className="hover:scale-125 duration-150" />
                    <div className="flex h-full">
                        <div
                            onClick={handleShare}
                            className="px-4 hover:bg-[#D73FB9] duration-100 border-x border-neutral-800 flex items-center cursor-pointer"
                        >
                            <CopyIcon size={16} />
                        </div>
                        <div
                            onClick={handleParse}
                            className=" px-4 hover:bg-[#D73FB9] duration-100 border-x border-neutral-800 flex items-center cursor-pointer"
                        >
                            <PlayIcon size={16} />
                        </div>
                    </div>
                </header>

                <section className="col-start-1 col-end-2 row-start-2 row-end-3 border-r dark:border-neutral-800 border-neutral-200 flex flex-col overflow-y-hidden ">
                    <Editor
                        defaultLanguage="dart"
                        value={value}
                        theme="bubblegum"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                        }}
                        onChange={handleEditorChange}
                    />
                </section>

                <main className="flex-grow overflow-y-auto transition-colors duration-300 col-start-2 col-end-3 row-start-1 row-end-3">
                    <iframe
                        srcDoc={code.replace(/(\r\n|\n|\r|\t)/gm, "")}
                        className="w-full h-full"
                        style={{ overflow: "hidden" }}
                    />
                </main>
            </div>
        </>
    );
}
