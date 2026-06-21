import React, { useRef, useState } from "react";
import { useTheme } from "../theme/ThemeContext";

import { FiBold, FiItalic, FiList, FiCode, FiEye, FiEdit3 } from "react-icons/fi";
import { MdFormatListNumbered } from "react-icons/md";
import { BiFontFamily } from "react-icons/bi";

interface DescriptionInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    name?: string;
    placeholder?: string;
    maxLength?: number;
    rows?: number;
    label?: string;
    required?: boolean;
}

// HTML માં ખતરનાક કેરેક્ટર escape કરે છે, જેથી યુઝરનું ટાઇપ કરેલું < > & વગેરે
// ભૂલથી HTML ટેગ તરીકે ઇન્ટરપ્રેટ ન થાય (XSS સામે રક્ષણ)
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// **bold** અને *italic* ને ઇનલાઇન HTML ટેગમાં ફેરવે છે
// (escape પછી ચાલે છે એટલે markup ઇન્જેક્શન શક્ય નથી)
function renderInline(text: string): string {
    let out = escapeHtml(text);
    // bold પહેલા (** **), પછી italic (* *) — જેથી **x** ની અંદરના * ભૂલથી italic ન બને
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return out;
}

// આખા description ટેક્સ્ટને markdown-like syntax માંથી HTML preview માં ફેરવે છે.
// સપોર્ટેડ: **bold**, *italic*, ```code block```, "- " bullet, "1. " numbered, "a. " alphabetical
function renderMarkdownPreview(text: string): string {
    if (!text) return "";

    const lines = text.split("\n");
    const htmlParts: string[] = [];
    let i = 0;
    let listBuffer: string[] = [];
    let listTag: "ul" | "ol" | null = null;

    const flushList = () => {
        if (listBuffer.length > 0 && listTag) {
            htmlParts.push(`<${listTag}>${listBuffer.join("")}</${listTag}>`);
        }
        listBuffer = [];
        listTag = null;
    };

    while (i < lines.length) {
        const line = lines[i];

        // કોડ બ્લોક: ``` થી શરૂ થાય અને ``` થી પૂરો થાય
        if (line.trim().startsWith("```")) {
            flushList();
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith("```")) {
                codeLines.push(lines[i]);
                i++;
            }
            htmlParts.push(
                `<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`
            );
            i++; // closing ``` skip કરો
            continue;
        }

        const bulletMatch = line.match(/^-\s+(.*)$/);
        const numMatch = line.match(/^\d+\.\s+(.*)$/);
        const alphaMatch = line.match(/^[a-z]+\.\s+(.*)$/);

        if (bulletMatch) {
            if (listTag !== "ul") {
                flushList();
                listTag = "ul";
            }
            listBuffer.push(`<li>${renderInline(bulletMatch[1])}</li>`);
        } else if (numMatch || alphaMatch) {
            const content = (numMatch ?? alphaMatch)![1];
            if (listTag !== "ol") {
                flushList();
                listTag = "ol";
            }
            listBuffer.push(`<li>${renderInline(content)}</li>`);
        } else {
            flushList();
            if (line.trim().length === 0) {
                htmlParts.push("<br/>");
            } else {
                htmlParts.push(`<p>${renderInline(line)}</p>`);
            }
        }
        i++;
    }
    flushList();

    return htmlParts.join("");
}

// આંકડાને અક્ષરમાં ફેરવે છે: 0 -> a, 1 -> b ... 25 -> z, 26 -> aa, 27 -> ab ...
function toAlphaIndex(n: number): string {
    let result = "";
    let num = n;
    do {
        result = String.fromCharCode(97 + (num % 26)) + result;
        num = Math.floor(num / 26) - 1;
    } while (num >= 0);
    return result;
}

export default function DescriptionInput({
    value,
    onChange,
    name = "description",
    placeholder = "Enter description or additional details...",
    maxLength = 500,
    rows = 4,
    label = "Description (Optional)",
    required = false,
}: DescriptionInputProps) {
    const { theme } = useTheme();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showPreview, setShowPreview] = useState(false);

    const fireChange = (newText: string) => {
        const syntheticEvent = {
            target: {
                name: name,
                value: newText,
            },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(syntheticEvent);
    };

    // 🌟 Inline formatting: Bold / Italic — સિલેક્ટ કરેલ ટેક્સ્ટની આજુબાજુ
    // પ્રિફિક્સ-સફિક્સ લગાવે છે, અને જો એ જ ફોર્મેટિંગ પહેલેથી હોય તો ટૉગલ ઑફ કરે છે
    const handleInlineFormat = (
        e: React.MouseEvent,
        marker: string,
        defaultText: string
    ) => {
        e.preventDefault(); // બ્રાઉઝરને કર્સર પોઝિશન ગુમાવતા અટકાવે છે

        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const markerLen = marker.length;

        // ટૉગલ ચેક: શું સિલેક્શનની બરાબર બહાર પહેલેથી જ આ જ માર્કર છે?
        const before = value.substring(Math.max(0, start - markerLen), start);
        const after = value.substring(end, end + markerLen);
        const alreadyWrapped =
            selectedText.length > 0 && before === marker && after === marker;

        let newText: string;
        let newStart: number;
        let newEnd: number;

        if (alreadyWrapped) {
            // ટૉગલ ઑફ: માર્કર કાઢી નાખો
            newText =
                value.substring(0, start - markerLen) +
                selectedText +
                value.substring(end + markerLen);
            newStart = start - markerLen;
            newEnd = end - markerLen;
        } else if (selectedText.length > 0) {
            // સિલેક્ટ કરેલ ટેક્સ્ટની આજુબાજુ ફોર્મેટિંગ લાગુ કરો
            newText =
                value.substring(0, start) +
                marker +
                selectedText +
                marker +
                value.substring(end);
            newStart = start + markerLen;
            newEnd = end + markerLen;
        } else {
            // કંઈ સિલેક્ટ નથી: ડિફોલ્ટ ટેક્સ્ટ સાથે દાખલ કરો અને એને સિલેક્ટ કરો
            const insertText = marker + defaultText + marker;
            newText = value.substring(0, start) + insertText + value.substring(end);
            newStart = start + markerLen;
            newEnd = newStart + defaultText.length;
        }

        fireChange(newText);

        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(newStart, newEnd);
        });
    };

    // 🌟 List formatting: Bullet / Numbered / Alphabetical
    // - કર્સર જે લાઇન પર છે એ લાઇનની શરૂઆતમાં માર્કર નાખે છે (વચ્ચે વધારાની ખાલી લાઇન નથી બનતી)
    // - મલ્ટિ-લાઇન સિલેક્શન હોય તો દરેક લાઇનને નંબર આપીને લિસ્ટ બનાવે છે
    // - નંબરિંગ/અક્ષર એ લાઇનની ઉપર પહેલેથી લિસ્ટ ચાલતું હોય તો ત્યાંથી આગળ વધે છે (1,2,3... અથવા a,b,c...)
    const handleListFormat = (
        e: React.MouseEvent,
        kind: "bullet" | "numbered" | "alpha"
    ) => {
        e.preventDefault();

        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // પસંદ કરેલ રેન્જને આવરી લેતી પૂરી લાઇનોની સીમા શોધો
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        let lineEnd = value.indexOf("\n", end);
        if (lineEnd === -1) lineEnd = value.length;

        const targetBlock = value.substring(lineStart, lineEnd);
        const lines = targetBlock.length > 0 ? targetBlock.split("\n") : [""];

        // આ બ્લોકની ઉપર પહેલેથી ચાલતું નંબરિંગ/અક્ષર ક્રમ હોય તો એનો પ્રારંભ-આંકડો શોધો
        let startIndex = 0;
        if (kind !== "bullet" && lineStart > 0) {
            const prevLineStart = value.lastIndexOf(
                "\n",
                lineStart - 2 >= 0 ? lineStart - 2 : -1
            ) + 1;
            const prevLine = value.substring(
                prevLineStart,
                lineStart - 1 >= prevLineStart ? lineStart - 1 : prevLineStart
            );

            const numMatch = prevLine.match(/^(\d+)\.\s/);
            const alphaMatch = prevLine.match(/^([a-z]+)\.\s/);

            if (kind === "numbered" && numMatch) {
                startIndex = parseInt(numMatch[1], 10);
            } else if (kind === "alpha" && alphaMatch) {
                // a->1, b->2 ... પછીનો ઇન્ડેક્સ આપવા માટે રિવર્સ કન્વર્ટ
                let n = 0;
                for (const ch of alphaMatch[1]) {
                    n = n * 26 + (ch.charCodeAt(0) - 97 + 1);
                }
                startIndex = n; // પહેલેથી જ "પછીનો" ઇન્ડેક્સ (0-based) છે
            }
        }

        const formattedLines = lines.map((line, i) => {
            let marker = "";
            if (kind === "bullet") marker = "- ";
            else if (kind === "numbered") marker = `${startIndex + i + 1}. `;
            else marker = `${toAlphaIndex(startIndex + i)}. `;

            // જે-તે લાઇન પર પહેલેથી આ જ પ્રકારનું માર્કર હોય તો ડુપ્લિકેટ ન કરો
            const alreadyMarked =
                (kind === "bullet" && /^-\s/.test(line)) ||
                (kind === "numbered" && /^\d+\.\s/.test(line)) ||
                (kind === "alpha" && /^[a-z]+\.\s/.test(line));

            if (alreadyMarked) return line;
            return marker + (line.length > 0 ? line : "List Item");
        });

        const newBlock = formattedLines.join("\n");
        const newText =
            value.substring(0, lineStart) + newBlock + value.substring(lineEnd);

        fireChange(newText);

        const newCursorPos = lineStart + newBlock.length;
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        });
    };

    // 🌟 Code block formatting
    const handleCodeBlock = (e: React.MouseEvent) => {
        e.preventDefault();

        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const prefix = "```\n";
        const suffix = "\n```";

        let newText: string;
        let newStart: number;
        let newEnd: number;

        if (selectedText.length > 0) {
            newText =
                value.substring(0, start) +
                prefix +
                selectedText +
                suffix +
                value.substring(end);
            newStart = start + prefix.length;
            newEnd = newStart + selectedText.length;
        } else {
            const defaultText = "Your code here";
            const insertText = prefix + defaultText + suffix;
            newText = value.substring(0, start) + insertText + value.substring(end);
            newStart = start + prefix.length;
            newEnd = newStart + defaultText.length;
        }

        fireChange(newText);

        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(newStart, newEnd);
        });
    };

    return (
        <div className="w-full flex flex-col space-y-1.5">
            <div className="flex justify-between items-center px-0.5">
                <label className={`text-sm font-medium ${theme ? "text-gray-300" : "text-neutral-700"}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                <span
                    className={`text-xs font-medium ${value.length >= maxLength
                            ? "text-red-500 font-semibold"
                            : theme
                                ? "text-gray-500"
                                : "text-neutral-400"
                        }`}
                >
                    {value.length}/{maxLength}
                </span>
            </div>

            <div
                className={`w-full flex flex-col rounded-xl border transition-all duration-200 overflow-hidden ${theme
                        ? "bg-gray-800 border-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30"
                        : "bg-neutral-50 border-neutral-300 focus-within:border-[#9b001c] focus-within:ring-1 focus-within:ring-[#9b001c]/20"
                    }`}
            >
                <div
                    className={`flex items-center gap-1 p-2 border-b ${theme ? "border-gray-700 bg-gray-800/80" : "border-neutral-200 bg-neutral-100/50"
                        }`}
                >
                    {/* 🌟 બધા બટન્સમાં onClick ના બદલે onMouseDown વાપર્યું છે જેથી ટેક્સ્ટએરિયા ફોકસ/સિલેક્શન ગુમાવે નહીં.
                        Preview મોડમાં edit buttons disable કર્યા છે — preview માં ફોર્મેટિંગ લાગુ કરવાનો કોઈ અર્થ નથી. */}
                    <button
                        type="button"
                        disabled={showPreview}
                        onMouseDown={(e) => handleInlineFormat(e, "**", "Bold Text")}
                        className={`p-1.5 rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${theme ? "hover:bg-gray-700 text-gray-300" : "hover:bg-neutral-200 text-neutral-600"}`}
                        title="Bold"
                    >
                        <FiBold size={16} />
                    </button>

                    <button
                        type="button"
                        disabled={showPreview}
                        onMouseDown={(e) => handleInlineFormat(e, "*", "Italic Text")}
                        className={`p-1.5 rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${theme ? "hover:bg-gray-700 text-gray-300" : "hover:bg-neutral-200 text-neutral-600"}`}
                        title="Italic"
                    >
                        <FiItalic size={16} />
                    </button>

                    <div className={`w-px h-4 mx-1 ${theme ? "bg-gray-700" : "bg-neutral-300"}`}></div>

                    <button
                        type="button"
                        disabled={showPreview}
                        onMouseDown={(e) => handleListFormat(e, "bullet")}
                        className={`p-1.5 rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${theme ? "hover:bg-gray-700 text-gray-300" : "hover:bg-neutral-200 text-neutral-600"}`}
                        title="Bullet List"
                    >
                        <FiList size={16} />
                    </button>

                    <button
                        type="button"
                        disabled={showPreview}
                        onMouseDown={(e) => handleListFormat(e, "numbered")}
                        className={`p-1.5 rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${theme ? "hover:bg-gray-700 text-gray-300" : "hover:bg-neutral-200 text-neutral-600"}`}
                        title="Numbered List"
                    >
                        <MdFormatListNumbered size={18} />
                    </button>

                    <button
                        type="button"
                        disabled={showPreview}
                        onMouseDown={(e) => handleListFormat(e, "alpha")}
                        className={`p-1.5 rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${theme ? "hover:bg-gray-700 text-gray-300" : "hover:bg-neutral-200 text-neutral-600"}`}
                        title="Alphabetical List"
                    >
                        <BiFontFamily size={18} />
                    </button>

                    <div className={`w-px h-4 mx-1 ${theme ? "bg-gray-700" : "bg-neutral-300"}`}></div>

                    <button
                        type="button"
                        disabled={showPreview}
                        onMouseDown={handleCodeBlock}
                        className={`p-1.5 rounded transition disabled:opacity-30 disabled:cursor-not-allowed ${theme ? "hover:bg-gray-700 text-gray-300" : "hover:bg-neutral-200 text-neutral-600"}`}
                        title="Code Block"
                    >
                        <FiCode size={16} />
                    </button>

                    <div className="flex-1" />

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setShowPreview((p) => {
                                const next = !p;
                                if (!next) {
                                    // Edit પર પાછા જઈએ ત્યારે textarea ફરી DOM માં
                                    // mount થાય એ પછી જ ફોકસ આપો
                                    requestAnimationFrame(() => {
                                        textareaRef.current?.focus();
                                    });
                                }
                                return next;
                            });
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition ${theme ? "hover:bg-gray-700 text-gray-300" : "hover:bg-neutral-200 text-neutral-600"}`}
                        title={showPreview ? "Edit" : "Preview"}
                    >
                        {showPreview ? <FiEdit3 size={14} /> : <FiEye size={14} />}
                        {showPreview ? "Edit" : "Preview"}
                    </button>
                </div>

                {showPreview ? (
                    <div
                        className={`w-full px-4 py-3 text-sm min-h-[96px] [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:rounded-lg [&_pre]:p-2 [&_pre]:my-1 [&_pre]:overflow-x-auto [&_code]:font-mono [&_code]:text-xs ${theme
                                ? "text-white [&_pre]:bg-gray-900"
                                : "text-neutral-900 [&_pre]:bg-neutral-200"
                            }`}
                        style={{ minHeight: `${rows * 1.5}rem` }}
                        dangerouslySetInnerHTML={{
                            __html:
                                renderMarkdownPreview(value) ||
                                `<p class="opacity-50">${escapeHtml(placeholder)}</p>`,
                        }}
                    />
                ) : (
                    <textarea
                        ref={textareaRef}
                        name={name}
                        value={value}
                        onChange={onChange}
                        maxLength={maxLength}
                        rows={rows}
                        placeholder={placeholder}
                        required={required}
                        className={`w-full px-4 py-3 text-sm bg-transparent outline-none resize-none shadow-inner ${theme ? "text-white" : "text-neutral-900"
                            }`}
                    />
                )}
            </div>
        </div>
    );
}