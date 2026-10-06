"use client";

import { useState } from "react";
import type { ToolDefinition } from "@/lib/tools";

type Props = { tool: ToolDefinition };

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary);
}

function decodeBase64(value: string) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function makeSlug(value: string) {
  return value.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
}

export function ToolWorkbench({ tool }: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy result");
  const [minimum, setMinimum] = useState("1");
  const [maximum, setMaximum] = useState("100");
  const [paragraphCount, setParagraphCount] = useState("3");
  const [percentageMode, setPercentageMode] = useState("of");
  const [firstNumber, setFirstNumber] = useState("");
  const [secondNumber, setSecondNumber] = useState("");

  const wordCount = input.trim() ? (input.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? []).length : 0;
  const characterCount = [...input].length;
  const sentenceCount = input.trim() ? (input.match(/[^.!?]+[.!?]+|[^.!?]+$/gu) ?? []).filter((part) => part.trim()).length : 0;
  const paragraphTotal = input.trim() ? input.trim().split(/\n\s*\n/u).filter((part) => part.trim()).length : 0;

  function setResult(value: string) {
    setOutput(value);
    setError("");
  }

  function run(action: string) {
    try {
      setError("");
      switch (tool.slug) {
        case "json-formatter": {
          const value: unknown = JSON.parse(input);
          if (action === "validate") return setResult("Valid JSON");
          return setResult(JSON.stringify(value, null, action === "minify" ? undefined : 2));
        }
        case "json-minifier":
          return setResult(JSON.stringify(JSON.parse(input)));
        case "base64-encoder-decoder":
          return setResult(action === "encode" ? encodeBase64(input) : decodeBase64(input.trim()));
        case "url-encoder-decoder":
          return setResult(action === "encode" ? encodeURIComponent(input) : decodeURIComponent(input));
        case "case-converter": {
          if (action === "upper") return setResult(input.toLocaleUpperCase());
          if (action === "lower") return setResult(input.toLocaleLowerCase());
          if (action === "title") return setResult(input.toLocaleLowerCase().replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase()));
          return setResult(input.toLocaleLowerCase().replace(/(^|[.!?]\s+)\p{L}/gu, (letter) => letter.toLocaleUpperCase()));
        }
        case "slug-generator":
          return setResult(makeSlug(input));
        case "text-cleaner":
          return setResult(action === "blank-lines"
            ? input.split("\n").filter((line) => line.trim()).map((line) => line.trim()).join("\n")
            : input.split("\n").map((line) => line.trim().replace(/[\t ]+/g, " ")).join("\n").trim());
        case "uuid-generator":
          return setResult(crypto.randomUUID());
        case "random-number-generator": {
          const min = Number(minimum);
          const max = Number(maximum);
          if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max) throw new Error("Enter whole numbers, with the minimum no greater than the maximum.");
          const range = max - min + 1;
          if (!Number.isSafeInteger(range) || range <= 0) throw new Error("The range is too large. Choose smaller limits.");
          const random = new Uint32Array(1);
          crypto.getRandomValues(random);
          return setResult(String(min + Math.floor((random[0] / 2 ** 32) * range)));
        }
        case "lorem-ipsum-generator": {
          const count = Math.min(10, Math.max(1, Number(paragraphCount) || 1));
          const source = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
          return setResult(Array.from({ length: count }, () => source).join("\n\n"));
        }
        case "percentage-calculator": {
          const first = Number(firstNumber);
          const second = Number(secondNumber);
          if (firstNumber === "" || secondNumber === "" || !Number.isFinite(first) || !Number.isFinite(second)) throw new Error("Enter valid numbers in both fields.");
          if (percentageMode === "of") return setResult(`${first}% of ${second} = ${((first / 100) * second).toLocaleString(undefined, { maximumFractionDigits: 8 })}`);
          if (percentageMode === "change") {
            if (first === 0) throw new Error("The starting value must be greater than zero to calculate percentage change.");
            const change = ((second - first) / Math.abs(first)) * 100;
            return setResult(`${first} to ${second} = ${change > 0 ? "+" : ""}${change.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`);
          }
          return setResult(`${first} increased by ${second}% = ${(first * (1 + second / 100)).toLocaleString(undefined, { maximumFractionDigits: 8 })}`);
        }
      }
    } catch (cause) {
      setOutput("");
      setError(cause instanceof Error ? cause.message : "Could not process this input.");
    }
  }

  async function copyResult() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopyLabel("Copied");
    window.setTimeout(() => setCopyLabel("Copy result"), 1400);
  }

  const isWordCounter = tool.slug === "word-counter";
  const isPercentage = tool.slug === "percentage-calculator";
  const isGenerator = ["uuid-generator", "random-number-generator", "lorem-ipsum-generator"].includes(tool.slug);
  const hasInput = !isGenerator && !isPercentage;

  return (
    <section className="workbench" aria-label={`${tool.name} interface`}>
      {isWordCounter && (
        <div className="live-stats" aria-live="polite">
          <div><strong>{wordCount}</strong><span>Words</span></div>
          <div><strong>{characterCount}</strong><span>Characters</span></div>
          <div><strong>{sentenceCount}</strong><span>Sentences</span></div>
          <div><strong>{paragraphTotal}</strong><span>Paragraphs</span></div>
          <div><strong>{Math.ceil(wordCount / 200)} min</strong><span>Reading time</span></div>
        </div>
      )}

      {isPercentage && (
        <>
          <div className="mode-tabs" role="group" aria-label="Percentage calculation type">
            <button type="button" aria-pressed={percentageMode === "of"} onClick={() => setPercentageMode("of")}>Percentage of</button>
            <button type="button" aria-pressed={percentageMode === "change"} onClick={() => setPercentageMode("change")}>Percentage change</button>
            <button type="button" aria-pressed={percentageMode === "increase"} onClick={() => setPercentageMode("increase")}>Increase by</button>
          </div>
          <div className="number-fields">
            <label>{percentageMode === "change" ? "Starting value" : percentageMode === "increase" ? "Starting value" : "Percentage"}<input type="number" value={firstNumber} onChange={(event) => setFirstNumber(event.target.value)} /></label>
            <label>{percentageMode === "change" ? "New value" : percentageMode === "increase" ? "Increase percent" : "Of value"}<input type="number" value={secondNumber} onChange={(event) => setSecondNumber(event.target.value)} /></label>
          </div>
          <button className="primary-action" type="button" onClick={() => run("calculate")}>Calculate <span aria-hidden="true">→</span></button>
        </>
      )}

      {tool.slug === "random-number-generator" && (
        <div className="number-fields">
          <label>Minimum<input type="number" step="1" value={minimum} onChange={(event) => setMinimum(event.target.value)} /></label>
          <label>Maximum<input type="number" step="1" value={maximum} onChange={(event) => setMaximum(event.target.value)} /></label>
        </div>
      )}
      {tool.slug === "lorem-ipsum-generator" && (
        <label className="compact-field">Paragraphs <input type="number" min="1" max="10" value={paragraphCount} onChange={(event) => setParagraphCount(event.target.value)} /></label>
      )}

      {hasInput && (
        <label className="editor-label">{isWordCounter ? "Your text" : "Input"}
          <textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder={isWordCounter ? "Start typing or paste your text here…" : "Paste or type your input here…"} spellCheck={false} />
        </label>
      )}

      <div className="action-row">
        {tool.slug === "json-formatter" && <><button className="primary-action" type="button" onClick={() => run("format")}>Format JSON <span aria-hidden="true">→</span></button><button type="button" className="secondary-action" onClick={() => run("validate")}>Validate</button><button type="button" className="secondary-action" onClick={() => run("minify")}>Minify</button></>}
        {tool.slug === "json-minifier" && <button className="primary-action" type="button" onClick={() => run("minify")}>Minify JSON <span aria-hidden="true">→</span></button>}
        {tool.slug === "base64-encoder-decoder" && <><button className="primary-action" type="button" onClick={() => run("encode")}>Encode <span aria-hidden="true">→</span></button><button type="button" className="secondary-action" onClick={() => run("decode")}>Decode</button></>}
        {tool.slug === "url-encoder-decoder" && <><button className="primary-action" type="button" onClick={() => run("encode")}>Encode URL <span aria-hidden="true">→</span></button><button type="button" className="secondary-action" onClick={() => run("decode")}>Decode URL</button></>}
        {tool.slug === "case-converter" && <><button className="primary-action" type="button" onClick={() => run("upper")}>UPPERCASE</button><button type="button" className="secondary-action" onClick={() => run("lower")}>lowercase</button><button type="button" className="secondary-action" onClick={() => run("title")}>Title Case</button><button type="button" className="secondary-action" onClick={() => run("sentence")}>Sentence case</button></>}
        {tool.slug === "text-cleaner" && <><button className="primary-action" type="button" onClick={() => run("clean")}>Clean text <span aria-hidden="true">→</span></button><button type="button" className="secondary-action" onClick={() => run("blank-lines")}>Remove blank lines</button></>}
        {tool.slug === "slug-generator" && <button className="primary-action" type="button" onClick={() => run("slug")}>Generate slug <span aria-hidden="true">→</span></button>}
        {isGenerator && <button className="primary-action" type="button" onClick={() => run("generate")}>{tool.slug === "uuid-generator" ? "Generate UUID" : tool.slug === "lorem-ipsum-generator" ? "Generate text" : "Generate number"} <span aria-hidden="true">→</span></button>}
        {output && <button className="secondary-action copy-action" type="button" onClick={copyResult}>{copyLabel}</button>}
        {(input || output) && <button className="text-action" type="button" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>}
      </div>

      {error && <p className="tool-error" role="alert">{error}</p>}
      {output && <label className="editor-label result-label">Result
        <textarea value={output} readOnly aria-live="polite" />
      </label>}
      <p className="local-note"><span aria-hidden="true">◉</span> Runs locally in your browser. Nothing is uploaded.</p>
    </section>
  );
}