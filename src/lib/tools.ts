export type Category = {
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
};

export type ToolDefinition = {
  name: string;
  category: string;
  categorySlug: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  tags: string;
  title: string;
  intro: string;
  steps: string[];
  related: string[];
  faqs: { question: string; answer: string }[];
};

export const categories: Category[] = [
  { name: "Finance & Money", slug: "finance-money", icon: "€", color: "green", description: "Understand loans, interest, spending and financial decisions." },
  { name: "Business & Tax", slug: "business-tax", icon: "%", color: "yellow", description: "Practical tools for pricing, tax and running a business." },
  { name: "Salary & Work", slug: "salary-work", icon: "↗", color: "blue", description: "Plan pay, working hours and the numbers behind your work." },
  { name: "Home & Everyday Life", slug: "home-everyday", icon: "⌂", color: "pink", description: "Helpful calculators for household projects and daily life." },
  { name: "Conversion", slug: "conversion", icon: "⇄", color: "blue", description: "Convert common units, measurements and data formats." },
  { name: "Math & Numbers", slug: "math-numbers", icon: "÷", color: "mint", description: "Quick calculators and number tools for everyday questions." },
  { name: "Health & Fitness", slug: "health-fitness", icon: "+", color: "coral", description: "Explore fitness, nutrition and personal health calculations." },
  { name: "Date & Time", slug: "date-time", icon: "◷", color: "lavender", description: "Calculate dates, durations, time zones and working days." },
  { name: "Construction & DIY", slug: "construction-diy", icon: "⌁", color: "coral", description: "Plan measurements and materials for building projects." },
  { name: "Travel", slug: "travel", icon: "✈", color: "mint", description: "Estimate trip distances, travel times and costs." },
  { name: "Education & Science", slug: "education-science", icon: "∑", color: "lavender", description: "Tools for learning, grades, statistics and science." },
  { name: "Text & Writing", slug: "text-writing", icon: "Aa", color: "green", description: "Count, clean and reshape text for any task." },
  { name: "Images", slug: "images", icon: "▧", color: "coral", description: "Resize, compress and convert images privately in your browser." },
  { name: "Files", slug: "files", icon: "PDF", color: "coral", description: "Merge and split PDF documents in your browser." },
  { name: "Internet & Technology", slug: "internet-technology", icon: "{ }", color: "yellow", description: "Fast browser-based helpers for common digital tasks." },
  { name: "Random & Fun", slug: "random-fun", icon: "✳", color: "pink", description: "Generate playful picks, identifiers and surprises." },
];

const sharedFaq = [
  { question: "Is this tool free?", answer: "Yes. This tool is free to use in your browser." },
  { question: "Are my inputs uploaded?", answer: "No. The tool processes your input in this browser tab and does not send it to a server." },
];

export const tools: ToolDefinition[] = [
  {
    name: "Word Counter", category: "Text & Writing", categorySlug: "text-writing", slug: "word-counter", description: "Count words, characters, sentences and reading time.", icon: "Aa", color: "green", tags: "word count character sentence text",
    title: "Word Counter Online", intro: "Get an instant count of the words, characters, sentences and paragraphs in your text, with an estimated reading time.",
    steps: ["Paste or type text into the editor.", "Review the live counts above the editor.", "Copy or edit your text whenever you need."], related: ["case-converter", "text-cleaner", "slug-generator"],
    faqs: [{ question: "How are words counted?", answer: "Words are counted as groups of letters or numbers, including words with apostrophes and hyphens." }, { question: "How is reading time estimated?", answer: "Reading time is estimated at 200 words per minute and rounded up to the next minute." }, ...sharedFaq],
  },
  {
    name: "JSON Formatter", category: "Internet & Technology", categorySlug: "internet-technology", slug: "json-formatter", description: "Format, validate and minify JSON in your browser.", icon: "{ }", color: "yellow", tags: "json format validate minify developer",
    title: "JSON Formatter and Validator", intro: "Format JSON for readability, validate its syntax, or minify it into a compact string. Errors are reported without uploading your data.",
    steps: ["Paste JSON into the input editor.", "Choose Format, Minify or Validate.", "Copy the result or fix any reported syntax error."], related: ["base64-encoder-decoder", "url-encoder-decoder", "json-minifier"],
    faqs: [{ question: "What does a JSON formatter do?", answer: "It parses JSON data and prints it with consistent indentation so objects and arrays are easier to inspect." }, { question: "Does formatting change the data?", answer: "Formatting changes whitespace only. The represented JSON values remain the same." }, ...sharedFaq],
  },
  {
    name: "Base64 Encoder / Decoder", category: "Internet & Technology", categorySlug: "internet-technology", slug: "base64-encoder-decoder", description: "Encode text to Base64 or decode it back instantly.", icon: "64", color: "blue", tags: "base64 encode decode developer",
    title: "Base64 Encoder and Decoder", intro: "Convert UTF-8 text to Base64 or decode Base64 back into readable text. Processing happens locally in your browser.",
    steps: ["Enter text or a Base64 string.", "Select Encode or Decode.", "Copy the converted result."], related: ["json-formatter", "url-encoder-decoder", "uuid-generator"],
    faqs: [{ question: "Is Base64 encryption?", answer: "No. Base64 is an encoding format, not encryption, and should not be used to protect secrets." }, ...sharedFaq],
  },
  {
    name: "Case Converter", category: "Text & Writing", categorySlug: "text-writing", slug: "case-converter", description: "Switch text between common letter cases.", icon: "Aa", color: "coral", tags: "case uppercase lowercase title text",
    title: "Case Converter", intro: "Convert text to uppercase, lowercase, title case or sentence case without changing the rest of your content.",
    steps: ["Enter or paste text.", "Choose the case you need.", "Copy the converted text."], related: ["word-counter", "text-cleaner", "slug-generator"],
    faqs: [{ question: "What is title case?", answer: "Title case capitalizes the first letter of each word while lowercasing the remaining letters." }, ...sharedFaq],
  },
  {
    name: "Slug Generator", category: "Text & Writing", categorySlug: "text-writing", slug: "slug-generator", description: "Turn a title into a clean, URL-friendly slug.", icon: "↗", color: "mint", tags: "slug url seo generator text",
    title: "URL Slug Generator", intro: "Turn a title or phrase into a lowercase, URL-friendly slug with normalized accents and hyphens between words.",
    steps: ["Enter a title or phrase.", "Generate the slug.", "Copy it into your URL or publishing workflow."], related: ["case-converter", "text-cleaner", "word-counter"],
    faqs: [{ question: "What is a URL slug?", answer: "A slug is the readable part of a URL that identifies a page, usually made from lowercase words separated by hyphens." }, ...sharedFaq],
  },
  {
    name: "UUID Generator", category: "Internet & Technology", categorySlug: "internet-technology", slug: "uuid-generator", description: "Create a random UUID v4 with one click.", icon: "#", color: "lavender", tags: "uuid guid random developer generator",
    title: "UUID v4 Generator", intro: "Generate a random version 4 UUID using your browser's cryptographically secure random number generator.",
    steps: ["Select Generate UUID.", "Create another identifier whenever needed.", "Copy the value into your project."], related: ["base64-encoder-decoder", "random-number-generator", "json-formatter"],
    faqs: [{ question: "What is a UUID v4?", answer: "A UUID v4 is a 128-bit identifier whose randomly generated bits make collisions extremely unlikely." }, ...sharedFaq],
  },
  {
    name: "Percentage Calculator", category: "Math & Numbers", categorySlug: "math-numbers", slug: "percentage-calculator", description: "Find a percentage, change, or part of a total.", icon: "%", color: "pink", tags: "percentage percent calculator change",
    title: "Percentage Calculator", intro: "Calculate a percentage of a value, the percentage change between two values, or the final value after a percentage increase.",
    steps: ["Choose the percentage calculation you need.", "Enter the two values.", "Read the result, which updates as you type."], related: ["random-number-generator", "word-counter", "text-cleaner"],
    faqs: [{ question: "How do I find X percent of a number?", answer: "Multiply the number by the percentage divided by 100. For example, 15% of 80 is 12." }, { question: "How is percentage change calculated?", answer: "Subtract the original value from the new value, divide by the original value, then multiply by 100." }, ...sharedFaq],
  },
  {
    name: "URL Encoder / Decoder", category: "Internet & Technology", categorySlug: "internet-technology", slug: "url-encoder-decoder", description: "Encode or decode URL components safely.", icon: "↗", color: "blue", tags: "url encode decode developer",
    title: "URL Encoder and Decoder", intro: "Percent-encode text for use as a URL component or decode an encoded component back into readable text.",
    steps: ["Enter a URL component or encoded string.", "Choose Encode or Decode.", "Copy the converted output."], related: ["base64-encoder-decoder", "json-formatter", "slug-generator"],
    faqs: [{ question: "What does URL encoding do?", answer: "It replaces characters that have special meaning or are not allowed in a URL component with percent-encoded representations." }, ...sharedFaq],
  },
  {
    name: "Text Cleaner", category: "Text & Writing", categorySlug: "text-writing", slug: "text-cleaner", description: "Trim spaces and remove blank lines from text.", icon: "≡", color: "coral", tags: "clean whitespace trim lines text",
    title: "Text Cleaner", intro: "Clean pasted text by trimming line edges, reducing repeated spaces or removing blank lines. Your original text remains available to edit.",
    steps: ["Paste text into the editor.", "Choose a cleanup action.", "Review and copy the cleaned result."], related: ["word-counter", "case-converter", "slug-generator"],
    faqs: [{ question: "What does whitespace cleanup change?", answer: "It trims each line and reduces repeated spaces and tabs to one space while preserving single line breaks." }, ...sharedFaq],
  },
  {
    name: "Lorem Ipsum Generator", category: "Text & Writing", categorySlug: "text-writing", slug: "lorem-ipsum-generator", description: "Generate placeholder text by paragraph or sentence.", icon: "¶", color: "yellow", tags: "lorem ipsum placeholder generator text",
    title: "Lorem Ipsum Text Generator", intro: "Generate placeholder copy in a chosen number of paragraphs for wireframes, layouts and design mockups.",
    steps: ["Choose how many paragraphs to generate.", "Generate the sample text.", "Copy and paste it into your mockup."], related: ["word-counter", "case-converter", "text-cleaner"],
    faqs: [{ question: "What is Lorem Ipsum used for?", answer: "Lorem Ipsum is placeholder text used to preview page layouts before final copy is available." }, ...sharedFaq],
  },
  {
    name: "Random Number Generator", category: "Math & Numbers", categorySlug: "math-numbers", slug: "random-number-generator", description: "Generate a random number within a range.", icon: "?", color: "green", tags: "random number generator",
    title: "Random Number Generator", intro: "Generate an inclusive random integer between a minimum and maximum value using your browser's secure random source.",
    steps: ["Set the minimum and maximum values.", "Select Generate number.", "Repeat to generate another number."], related: ["uuid-generator", "percentage-calculator", "lorem-ipsum-generator"],
    faqs: [{ question: "Are both range limits included?", answer: "Yes. The minimum and maximum values are both possible results." }, ...sharedFaq],
  },
  {
    name: "JSON Minifier", category: "Internet & Technology", categorySlug: "internet-technology", slug: "json-minifier", description: "Remove JSON whitespace to create a compact result.", icon: "{ }", color: "mint", tags: "json minify compact developer",
    title: "JSON Minifier", intro: "Validate JSON and remove unnecessary whitespace to create a compact representation that is easier to transmit or store.",
    steps: ["Paste JSON into the input editor.", "Minify the valid JSON.", "Copy the compact output or fix the shown syntax error."], related: ["json-formatter", "base64-encoder-decoder", "url-encoder-decoder"],
    faqs: [{ question: "Does minifying JSON remove any data?", answer: "No. The minifier parses and serializes JSON without its formatting whitespace; the represented values stay the same." }, ...sharedFaq],
  },
  {
    name: "Image Resizer", category: "Images", categorySlug: "images", slug: "image-resizer", description: "Resize an image to a chosen width while preserving its proportions.", icon: "↔", color: "coral", tags: "image resize photo width",
    title: "Image Resizer", intro: "Resize an image to a target width while keeping its original proportions. Your image is processed locally in your browser.",
    steps: ["Choose an image from your device.", "Enter the target width in pixels.", "Resize and download the result."], related: ["image-compressor", "image-converter", "pdf-merger"],
    faqs: [{ question: "Which image types can I resize?", answer: "Common browser-supported image formats such as PNG, JPEG, WebP and GIF are supported. Animated images are resized as a still image of their first frame." }, ...sharedFaq],
  },
  {
    name: "Image Compressor", category: "Images", categorySlug: "images", slug: "image-compressor", description: "Reduce image file size with adjustable JPEG quality.", icon: "↓", color: "mint", tags: "image compress photo reduce size",
    title: "Image Compressor", intro: "Reduce an image's file size by exporting it as a JPEG with adjustable quality. Everything runs in your browser.",
    steps: ["Choose an image from your device.", "Set the desired JPEG quality.", "Compress and download the smaller image."], related: ["image-resizer", "image-converter", "pdf-splitter"],
    faqs: [{ question: "Does compression always make an image smaller?", answer: "JPEG compression often reduces photographs substantially, but the result depends on the source and quality setting." }, { question: "What happens to transparent pixels?", answer: "JPEG does not support transparency, so transparent areas are filled with white." }, ...sharedFaq],
  },
  {
    name: "Image Converter", category: "Images", categorySlug: "images", slug: "image-converter", description: "Convert images between PNG, JPEG and WebP.", icon: "⇄", color: "blue", tags: "image convert png jpeg webp",
    title: "Image Converter", intro: "Convert an image to PNG, JPEG or WebP without uploading it to a server.",
    steps: ["Choose an image from your device.", "Select the format you want.", "Convert and download the new image."], related: ["image-resizer", "image-compressor", "pdf-merger"],
    faqs: [{ question: "Which output formats are available?", answer: "You can export PNG, JPEG or WebP, subject to support in your browser." }, { question: "Will converting to JPEG keep transparency?", answer: "No. Transparent areas are filled with white because JPEG does not support transparency." }, ...sharedFaq],
  },
  {
    name: "PDF Merger", category: "Files", categorySlug: "files", slug: "pdf-merger", description: "Combine multiple PDF documents into one file.", icon: "PDF", color: "coral", tags: "pdf merge combine join documents",
    title: "PDF Merger", intro: "Combine two or more PDF documents into one, in the order you choose. The files stay on your device.",
    steps: ["Select at least two PDF files.", "Arrange them in the order they should appear.", "Merge and download the combined PDF."], related: ["pdf-splitter", "image-converter", "image-resizer"],
    faqs: [{ question: "Can I control the page order?", answer: "Yes. The merged document follows the order shown in the selected-files list." }, ...sharedFaq],
  },
  {
    name: "PDF Splitter", category: "Files", categorySlug: "files", slug: "pdf-splitter", description: "Split a PDF into two documents at a page boundary.", icon: "PDF", color: "coral", tags: "pdf split separate pages documents",
    title: "PDF Splitter", intro: "Split a PDF into two documents at a page you choose, then download both parts.",
    steps: ["Choose a PDF document.", "Choose the page after which to split.", "Split and download both PDF documents."], related: ["pdf-merger", "image-converter", "image-compressor"],
    faqs: [{ question: "Can I split a PDF at any page?", answer: "Yes. Choose a page from the first page through the page before the last page." }, ...sharedFaq],
  },
];

export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug);
export const getCategory = (slug: string) => categories.find((category) => category.slug === slug);
export const getCategoryTools = (slug: string) => tools.filter((tool) => tool.categorySlug === slug);
export const getRelatedTools = (tool: ToolDefinition) => tool.related.map(getTool).filter((item): item is ToolDefinition => Boolean(item));