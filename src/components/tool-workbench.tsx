"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { PDFDocument } from "pdf-lib";
import type { ToolDefinition } from "@/lib/tools";

type Props = { tool: ToolDefinition };
type ImageMimeType = "image/jpeg" | "image/png" | "image/webp";

function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function baseFilename(filename: string) {
  return filename.replace(/\.[^.]+$/u, "");
}

function pdfBlob(bytes: Uint8Array) {
  const copy = new Uint8Array(bytes);
  return new Blob([copy.buffer], { type: "application/pdf" });
}

async function renderImage(
  file: File,
  mimeType: ImageMimeType,
  quality?: number,
  targetWidth?: number,
) {
  const image = await createImageBitmap(file);
  try {
    const width = targetWidth ?? image.width;
    const height = targetWidth ? Math.round((image.height / image.width) * width) : image.height;
    if (width > 16_384 || height > 16_384 || width * height > 80_000_000) {
      throw new Error("The output dimensions are too large for reliable browser processing.");
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not prepare the image canvas.");
    if (mimeType === "image/jpeg") {
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(image, 0, 0, width, height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => result ? resolve(result) : reject(new Error("Your browser could not encode this image.")),
        mimeType,
        quality,
      );
    });
    if (blob.type !== mimeType) {
      throw new Error(`Your browser does not support exporting this image as ${mimeType.replace("image/", "").toUpperCase()}.`);
    }
    return blob;
  } finally {
    image.close();
  }
}

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
  const [files, setFiles] = useState<File[]>([]);
  const [resizeWidth, setResizeWidth] = useState("1200");
  const [imageQuality, setImageQuality] = useState("0.8");
  const [imageFormat, setImageFormat] = useState<ImageMimeType>("image/webp");
  const [splitAfterPage, setSplitAfterPage] = useState("1");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = input.trim() ? (input.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) ?? []).length : 0;
  const characterCount = [...input].length;
  const sentenceCount = input.trim() ? (input.match(/[^.!?]+[.!?]+|[^.!?]+$/gu) ?? []).filter((part) => part.trim()).length : 0;
  const paragraphTotal = input.trim() ? input.trim().split(/\n\s*\n/u).filter((part) => part.trim()).length : 0;

  function setResult(value: string) {
    setOutput(value);
    setError("");
  }

  function selectFiles(event: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(event.target.files ?? []));
    setOutput("");
    setError("");
  }

  function dropFiles(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(tool.slug === "pdf-merger" ? droppedFiles : droppedFiles.slice(0, 1));
    setOutput("");
    setError("");
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const reordered = [...current];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      return reordered;
    });
  }

  async function processFileTool() {
    try {
      setError("");
      setOutput("");
      if (!files.length) throw new Error("Choose a file before running this tool.");

      if (tool.slug === "image-resizer" || tool.slug === "image-compressor" || tool.slug === "image-converter") {
        if (files.length !== 1) throw new Error("Choose exactly one image.");
        const file = files[0];
        let mimeType: ImageMimeType;
        let quality: number | undefined;
        let targetWidth: number | undefined;
        if (tool.slug === "image-resizer") {
          targetWidth = Number(resizeWidth);
          if (!Number.isSafeInteger(targetWidth) || targetWidth < 1) {
            throw new Error("Enter a whole-number width greater than zero.");
          }
          mimeType = file.type === "image/jpeg" || file.type === "image/webp" ? file.type : "image/png";
        } else if (tool.slug === "image-compressor") {
          mimeType = "image/jpeg";
          quality = Number(imageQuality);
        } else {
          mimeType = imageFormat;
        }
        const blob = await renderImage(file, mimeType, quality, targetWidth);
        const extension = mimeType.slice("image/".length).replace("jpeg", "jpg");
        const suffix = tool.slug === "image-resizer" ? "resized" : tool.slug === "image-compressor" ? "compressed" : "converted";
        const filename = `${baseFilename(file.name)}-${suffix}.${extension}`;
        downloadFile(blob, filename);
        setOutput(`Downloaded ${filename} (${(blob.size / 1024).toLocaleString(undefined, { maximumFractionDigits: 0 })} KB).`);
        return;
      }

      if (tool.slug === "pdf-merger") {
        if (files.length < 2) throw new Error("Choose at least two PDF files to merge.");
        const merged = await PDFDocument.create();
        for (const file of files) {
          const source = await PDFDocument.load(await file.arrayBuffer());
          const pages = await merged.copyPages(source, source.getPageIndices());
          pages.forEach((page) => merged.addPage(page));
        }
        const filename = `${baseFilename(files[0].name)}-merged.pdf`;
        downloadFile(pdfBlob(await merged.save()), filename);
        setOutput(`Merged ${files.length} files and downloaded ${filename}.`);
        return;
      }

      if (tool.slug === "pdf-splitter") {
        if (files.length !== 1) throw new Error("Choose exactly one PDF file to split.");
        const source = await PDFDocument.load(await files[0].arrayBuffer());
        const pageCount = source.getPageCount();
        const splitAfter = Number(splitAfterPage);
        if (!Number.isSafeInteger(splitAfter) || splitAfter < 1 || splitAfter >= pageCount) {
          throw new Error(`Enter a page number from 1 to ${pageCount - 1}.`);
        }
        const firstPart = await PDFDocument.create();
        const secondPart = await PDFDocument.create();
        const firstPages = await firstPart.copyPages(source, Array.from({ length: splitAfter }, (_, index) => index));
        const secondPages = await secondPart.copyPages(source, Array.from({ length: pageCount - splitAfter }, (_, index) => splitAfter + index));
        firstPages.forEach((page) => firstPart.addPage(page));
        secondPages.forEach((page) => secondPart.addPage(page));
        const name = baseFilename(files[0].name);
        downloadFile(pdfBlob(await firstPart.save()), `${name}-part-1.pdf`);
        downloadFile(pdfBlob(await secondPart.save()), `${name}-part-2.pdf`);
        setOutput(`Split the ${pageCount}-page PDF after page ${splitAfter} and downloaded both parts.`);
      }
    } catch (cause) {
      setOutput("");
      setError(cause instanceof Error ? cause.message : "Could not process this file.");
    }
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
  const isImageTool = tool.categorySlug === "images";
  const isPdfTool = tool.categorySlug === "files";
  const hasInput = !isGenerator && !isPercentage && !isImageTool && !isPdfTool;
  const workbenchHeading = isImageTool || isPdfTool
    ? "Add your files"
    : isGenerator
      ? "Set up your result"
      : isPercentage
        ? "Choose a calculation"
        : "Enter your text";

  return (
    <section className="workbench" aria-label={`${tool.name} interface`}>
      <div className="workbench-heading">
        <span className="workbench-step" aria-hidden="true">01</span>
        <div>
          <h2>{workbenchHeading}</h2>
          <p>{tool.steps[0]}</p>
        </div>
      </div>
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

      {(isImageTool || isPdfTool) && (
        <>
          <label
            className="file-picker"
            data-dragging={isDragging}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={dropFiles}
          >
            <span className="file-picker-title">{files.length ? "Change your selection" : isImageTool ? "Choose an image" : tool.slug === "pdf-merger" ? "Choose PDF files" : "Choose a PDF file"}</span>
            <span className="file-picker-hint">Drop {tool.slug === "pdf-merger" ? "PDFs" : isImageTool ? "an image" : "a PDF"} here or browse from your device</span>
            <input
              ref={fileInputRef}
              type="file"
              accept={isImageTool ? "image/*" : "application/pdf,.pdf"}
              multiple={tool.slug === "pdf-merger"}
              onChange={selectFiles}
            />
          </label>
          {files.length > 0 && (
            <ul className="selected-files" aria-label="Selected files">
              {files.map((file, index) => (
                <li key={`${file.name}-${file.lastModified}-${index}`}>
                  <span>{file.name} <small>({(file.size / 1024).toLocaleString(undefined, { maximumFractionDigits: 0 })} KB)</small></span>
                  {tool.slug === "pdf-merger" && (
                    <span className="file-order-actions">
                      <button type="button" aria-label={`Move ${file.name} up`} disabled={index === 0} onClick={() => moveFile(index, -1)}>↑</button>
                      <button type="button" aria-label={`Move ${file.name} down`} disabled={index === files.length - 1} onClick={() => moveFile(index, 1)}>↓</button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {tool.slug === "image-resizer" && (
            <label className="compact-field">New width (pixels)
              <input type="number" min="1" step="1" value={resizeWidth} onChange={(event) => setResizeWidth(event.target.value)} />
              <small>Height is adjusted to preserve the image proportions.</small>
            </label>
          )}
          {tool.slug === "image-compressor" && (
            <label className="compact-field">JPEG quality: {Math.round(Number(imageQuality) * 100)}%
              <input type="range" min="0.1" max="1" step="0.05" value={imageQuality} onChange={(event) => setImageQuality(event.target.value)} />
            </label>
          )}
          {tool.slug === "image-converter" && (
            <label className="compact-field">Output format
              <select value={imageFormat} onChange={(event) => setImageFormat(event.target.value as ImageMimeType)}>
                <option value="image/webp">WebP</option>
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPEG</option>
              </select>
            </label>
          )}
          {tool.slug === "pdf-splitter" && (
            <label className="compact-field">Split after page
              <input type="number" min="1" step="1" value={splitAfterPage} onChange={(event) => setSplitAfterPage(event.target.value)} />
            </label>
          )}
        </>
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
        {(isImageTool || isPdfTool) && <button className="primary-action" type="button" onClick={processFileTool}>{tool.slug === "image-resizer" ? "Resize image" : tool.slug === "image-compressor" ? "Compress image" : tool.slug === "image-converter" ? "Convert image" : tool.slug === "pdf-merger" ? "Merge PDFs" : "Split PDF"} <span aria-hidden="true">→</span></button>}
        {output && !isImageTool && !isPdfTool && <button className="secondary-action copy-action" type="button" onClick={copyResult}>{copyLabel}</button>}
        {(input || output || files.length > 0) && <button className="text-action" type="button" onClick={() => { setInput(""); setOutput(""); setError(""); setFiles([]); if (fileInputRef.current) fileInputRef.current.value = ""; }}>Clear</button>}
      </div>

      {error && <p className="tool-error" role="alert">{error}</p>}
      {output && (isImageTool || isPdfTool) && <p className="file-tool-result" role="status">{output}</p>}
      {output && !isImageTool && !isPdfTool && <label className="editor-label result-label">Result
        <textarea value={output} readOnly aria-live="polite" />
      </label>}
      <p className="local-note"><span aria-hidden="true">◉</span> Runs locally in your browser. Nothing is uploaded.</p>
    </section>
  );
}