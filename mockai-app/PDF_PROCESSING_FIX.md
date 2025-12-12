# PDF Processing Fix

## Issue

The `pdf-parse` library uses `pdfjs-dist` which has browser-specific APIs like `structuredClone` with transfer that aren't fully supported in Convex's Node.js environment.

## Solution Implemented

I've updated `convex/pdfProcessor.ts` with polyfills for missing browser APIs:

1. **structuredClone polyfill**: Basic implementation that ignores the `transfer` parameter
2. **MessageChannel mock**: Provides a stub implementation if needed
3. **Text cleaning**: Normalizes extracted text for better readability

## Testing the Fix

Try uploading a PDF resume again:

1. Go to the dashboard
2. Click "Create New Session"
3. Upload a PDF resume
4. Wait for processing

## If the Issue Persists

### Option 1: Use External PDF Processing Service

Replace PDF processing with an external API (recommended for production):

**Services to consider:**

- **Adobe PDF Extract API** (free tier available)
- **CloudConvert** (has PDF to text conversion)
- **Apryse (PDFTron)** (enterprise solution)

### Option 2: Use Alternative Library

Install `pdf2json` which has better Node.js support:

```bash
npm install pdf2json
npm install -D @types/pdf2json
```

Then update `convex/pdfProcessor.ts`:

```typescript
import { action } from "./_generated/server";
import { v } from "convex/values";

export const processPdfToText = action({
  args: {
    pdfBase64: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const PDFParser = (await import("pdf2json")).default;

      return new Promise((resolve) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", (errData: any) => {
          resolve({
            success: false,
            error: errData.parserError || "Failed to parse PDF",
            text: "",
            numPages: 0,
          });
        });

        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
          // Extract text from all pages
          let text = "";
          pdfData.Pages.forEach((page: any) => {
            page.Texts.forEach((textItem: any) => {
              textItem.R.forEach((run: any) => {
                text += decodeURIComponent(run.T) + " ";
              });
            });
            text += "\n";
          });

          resolve({
            success: true,
            text: text.trim(),
            numPages: pdfData.Pages.length,
          });
        });

        // Parse from base64
        const pdfBuffer = Buffer.from(args.pdfBase64, "base64");
        pdfParser.parseBuffer(pdfBuffer);
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to process PDF",
        text: "",
        numPages: 0,
      };
    }
  },
});
```

### Option 3: Client-Side Processing (Quick Fix)

Process the PDF on the client side before uploading:

**Install client library:**

```bash
npm install pdfjs-dist
```

**Update `create-session-modal.tsx`:**

```typescript
// Add this import
import * as pdfjs from "pdfjs-dist";

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Replace the onSubmit function
const onSubmit = async (data: FormData) => {
  setIsProcessing(true);
  setError(null);

  try {
    const token = localStorage.getItem("mockai_auth_token");
    if (!token) {
      throw new Error("Not authenticated");
    }

    // Read file
    const file = data.resumeFile[0];
    const arrayBuffer = await file.arrayBuffer();

    // Process PDF on client side
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    // Create session directly (skip backend PDF processing)
    const sessionResult = await createSession({
      token,
      jobTitle: data.jobTitle,
      resumeText: fullText.trim(),
    });

    if (!sessionResult.success) {
      throw new Error(sessionResult.error || "Failed to create session");
    }

    reset();
    setSelectedFileName(null);
    onClose();
    router.push(`/interview/${sessionResult.sessionId}`);
  } catch (err: any) {
    console.error("Error creating session:", err);
    setError(err.message || "Failed to create session. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};
```

## Recommended Approach

For **development/testing**: Use the current polyfill implementation (should work for most PDFs)

For **production**:

1. Use client-side processing (Option 3) - simplest and most reliable
2. OR use an external service (Option 1) - most robust
3. OR use pdf2json (Option 2) - good middle ground

## Testing

After implementing the fix, test with:

- ✅ Simple text-only PDF resume
- ✅ Resume with formatting (bold, italics)
- ✅ Multi-page resume
- ✅ Resume with tables
- ✅ PDF with images (text should still extract)

## Debugging

Check Convex dashboard logs for detailed error messages:

1. Go to your Convex dashboard
2. Navigate to Logs
3. Look for `pdfProcessor:processPdfToText` errors
4. Share any additional error details for further troubleshooting
