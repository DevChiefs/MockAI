# 🏷️ Metadata & Favicon Setup

## What Was Added

Added complete metadata configuration to your Next.js app, including:

- ✅ Page title in browser tab
- ✅ Favicon/logo in browser tab
- ✅ SEO metadata (description, keywords)
- ✅ Open Graph tags (for social media sharing)
- ✅ Twitter card tags

## Browser Tab Result

**Before:**

```
localhost:3000 | Next.js
```

**After:**

```
MockAI - AI-Powered Interview Practice | 🎤
```

## Files Modified/Created

### 1. `app/layout.tsx`

- Removed `"use client"` directive
- Added `Metadata` export
- Added favicon link
- Now a Server Component (better for SEO)

### 2. `app/ConvexClientProvider.tsx` (NEW)

- Extracted Convex client logic
- Keeps client-side code separate
- Allows layout to be a Server Component

## Metadata Configuration

### Title

```typescript
title: {
  default: "MockAI - AI-Powered Interview Practice",
  template: "%s | MockAI",
}
```

**How it works:**

- Homepage: "MockAI - AI-Powered Interview Practice"
- Other pages: "Page Name | MockAI"

**Example:**

- `/dashboard` → "Dashboard | MockAI"
- `/interview/123` → "Interview | MockAI"

### Description

```typescript
description: "Your AI-powered interview companion that helps you prepare, practice, and excel in any job interview with personalized guidance and real-time feedback.";
```

Shows up in:

- Google search results
- Social media shares
- Browser bookmarks

### Keywords

```typescript
keywords: [
  "interview practice",
  "AI interview",
  "job interview",
  "interview preparation",
  "mock interview",
  "career coaching",
];
```

Helps with SEO and search engine indexing.

### Icons/Favicon

```typescript
icons: {
  icon: [
    { url: "/mockai-trans-bg.png", sizes: "any" },
    { url: "/favicon.ico", sizes: "any" },
  ],
  apple: [{ url: "/mockai-trans-bg.png" }],
}
```

**What this does:**

- Shows MockAI logo in browser tab
- Works on desktop and mobile
- Apple Touch Icon for iOS home screen

### Open Graph (Social Media)

```typescript
openGraph: {
  title: "MockAI - AI-Powered Interview Practice",
  description: "Master your job interviews with AI-powered practice sessions",
  type: "website",
  locale: "en_US",
  siteName: "MockAI",
}
```

**Result:** When someone shares your site on Facebook, LinkedIn, etc.:

```
┌─────────────────────────────┐
│ MockAI - AI Interview...    │
│                             │
│ Master your job interviews  │
│ with AI-powered practice... │
│                             │
│ mockai.com                  │
└─────────────────────────────┘
```

### Twitter Card

```typescript
twitter: {
  card: "summary_large_image",
  title: "MockAI - AI-Powered Interview Practice",
  description: "Master your job interviews...",
}
```

Similar to Open Graph, but specifically for Twitter/X.

## Favicon Files

Your favicon is set to use `/public/mockai-trans-bg.png`

**Current files in `/public`:**

- `mockai-trans-bg.png` ← Used as favicon
- `mockai-logo.svg` ← SVG version

### If You Want a Custom Favicon

**Option 1: Use existing logo (already done)**

```
public/mockai-trans-bg.png → favicon
```

**Option 2: Create optimized favicon**

1. Go to https://favicon.io or https://realfavicongenerator.net
2. Upload your logo (`mockai-trans-bg.png`)
3. Generate multiple sizes
4. Download and extract to `/public`:
   - `favicon.ico` (16x16, 32x32, 48x48)
   - `apple-touch-icon.png` (180x180)
   - `favicon-16x16.png`
   - `favicon-32x32.png`

**Option 3: Use emoji favicon** (modern approach)

```tsx
// In layout.tsx head:
<link
  rel="icon"
  href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎤</text></svg>"
/>
```

## Page-Specific Metadata

You can override metadata on individual pages:

### Example: Dashboard Page

Create `app/dashboard/layout.tsx`:

```tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your interview practice sessions",
};

export default function DashboardLayout({ children }) {
  return <>{children}</>;
}
```

Result: "Dashboard | MockAI" in tab

### Example: Interview Page

In `app/interview/[sessionId]/page.tsx`:

```tsx
import { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: "Interview Session",
    description: "Practice your interview with AI",
  };
}
```

## Testing Your Metadata

### 1. Check Browser Tab

- Open your site
- Look at browser tab
- Should show: "MockAI - AI-Powered Interview Practice"
- Should show: MockAI logo as favicon

### 2. Check Page Source

View page source (Ctrl+U) and look for:

```html
<title>MockAI - AI-Powered Interview Practice</title>
<meta name="description" content="Your AI-powered interview..." />
<meta property="og:title" content="MockAI..." />
<link rel="icon" href="/mockai-trans-bg.png" />
```

### 3. Test Social Sharing

Use these tools:

- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: Share post preview

Enter your URL and see how it appears.

### 4. Test SEO

- **Google**: https://search.google.com/test/rich-results
- **Lighthouse**: Chrome DevTools → Lighthouse tab
- Check for proper title, description, and meta tags

## Troubleshooting

### Favicon not showing

1. **Hard refresh browser:**
   - Chrome: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
   - Clear browser cache

2. **Check file exists:**

   ```bash
   ls public/mockai-trans-bg.png
   ```

3. **Verify in browser:**
   - Go to: http://localhost:3000/mockai-trans-bg.png
   - Should display the image

4. **Check console for errors:**
   - Press F12 → Console tab
   - Look for 404 errors

### Title not updating

1. **Check layout.tsx:**
   - Make sure metadata is exported
   - Should be a Server Component (no "use client")

2. **Restart dev server:**

   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Clear .next cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

### TypeScript error on ConvexClientProvider

This is just a cache issue. Solutions:

1. Save the file again
2. Restart TypeScript server in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
3. Restart dev server

The error will resolve automatically.

## Dynamic Metadata

For pages with dynamic content (like interview sessions), use `generateMetadata`:

```tsx
// app/interview/[sessionId]/page.tsx
export async function generateMetadata({ params }) {
  const session = await getSession(params.sessionId);

  return {
    title: `${session.jobTitle} Interview`,
    description: `Practice interview for ${session.jobTitle} position`,
  };
}
```

Result: "Software Engineer Interview | MockAI"

## Best Practices

### Title Length

- ✅ Keep under 60 characters
- ✅ Front-load important keywords
- ✅ Include brand name

### Description Length

- ✅ Keep under 160 characters
- ✅ Make it compelling
- ✅ Include call-to-action

### Images for Social Sharing

- ✅ Recommended size: 1200x630px
- ✅ Add to `/public/og-image.png`
- ✅ Update metadata:
  ```typescript
  openGraph: {
    images: [{ url: '/og-image.png' }],
  }
  ```

## Additional Metadata

### Viewport (Already included by Next.js)

```typescript
viewport: {
  width: 'device-width',
  initialScale: 1,
}
```

### Theme Color

```typescript
themeColor: '#047BE3', // Your blue brand color
```

### Manifest (PWA)

```typescript
manifest: '/manifest.json',
```

## Status: ✅ COMPLETE

Your app now has:

- ✅ Professional title in browser tab
- ✅ Logo/favicon visible
- ✅ SEO-optimized metadata
- ✅ Social media sharing tags
- ✅ Proper structure for page-specific metadata

**Check it now!** Look at your browser tab - you should see the MockAI logo and title! 🎯
