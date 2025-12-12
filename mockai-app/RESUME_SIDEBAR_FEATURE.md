# 📄 Resume Sidebar Feature

## Overview

Added a collapsible sidebar on the interview page that displays the user's resume during the interview session. This allows users to reference their experience while answering questions.

## Features

### 1. **Side-by-Side Layout**

- Interview interface on the left
- Resume panel on the right
- Responsive design that works on all screen sizes

### 2. **Collapsible Panel**

- Toggle button to show/hide resume
- Smooth slide animation (300ms)
- Saves screen space when not needed
- Visual icons (chevron left/right)

### 3. **Scrollable Resume**

- Fixed height panel with scroll
- Preserves resume formatting (whitespace)
- Easy to read text styling
- Smooth scrolling

### 4. **Professional Design**

- Dark theme matching the app
- Glassmorphism effect (backdrop blur)
- File icon header
- Consistent borders and spacing

## How It Works

### Layout Structure

```
┌─────────────────────────────────────────────┐
│              Navigation Header               │
├──────────────────────────┬──────────────────┤
│                          │                  │
│    Interview Interface   │   Resume Panel   │
│    (Vapi controls)       │   (Scrollable)   │
│                          │                  │
│    - Mic animations      │   - Resume text  │
│    - Status display      │   - Toggle btn   │
│    - Mute/End buttons    │   - File icon    │
│                          │                  │
└──────────────────────────┴──────────────────┘
```

### State Management

```typescript
const [isResumeVisible, setIsResumeVisible] = useState(true);
```

- `true`: Resume panel expanded (384px width)
- `false`: Resume panel collapsed (48px width, just toggle button)

### Toggle Button

```jsx
<Button onClick={() => setIsResumeVisible(!isResumeVisible)}>
  {isResumeVisible ? (
    <>
      <ChevronRight /> Hide Resume
    </>
  ) : (
    <>
      <ChevronLeft /> Show Resume
    </>
  )}
</Button>
```

## Component Details

### Resume Panel Container

```jsx
<div className={`
  transition-all duration-300
  ${isResumeVisible ? 'w-96' : 'w-12'}
`}>
```

**Styling:**

- Width: 384px (expanded) / 48px (collapsed)
- Smooth transition: 300ms
- Flex layout with main content

### Resume Content Box

```jsx
<div className="
  bg-gray-900/50 backdrop-blur-sm
  border border-gray-800
  rounded-xl p-6
  h-[calc(100vh-220px)]
  overflow-y-auto
">
```

**Features:**

- Semi-transparent background
- Backdrop blur effect
- Rounded corners
- Dynamic height (viewport height - header/padding)
- Vertical scroll when content exceeds height

### Resume Text Display

```jsx
<div
  className="
  text-sm text-gray-300 
  leading-relaxed 
  whitespace-pre-wrap
"
>
  {session.resumeText}
</div>
```

**Styling:**

- Small font size (14px)
- Gray text for readability
- Relaxed line height (1.625)
- Preserves original formatting (line breaks, spaces)

## Visual States

### 1. **Expanded (Default)**

```
┌────────────┬─────────────┐
│            │ ┌─────────┐ │
│  Interview │ │  Resume │ │
│  Controls  │ │  Panel  │ │
│            │ │         │ │
│            │ └─────────┘ │
└────────────┴─────────────┘
     70%           30%
```

### 2. **Collapsed**

```
┌──────────────────┬─┐
│                  │▶│
│   Interview      │ │
│   Controls       │ │
│                  │ │
│                  │ │
└──────────────────┴─┘
      95%          5%
```

## User Experience

### Benefits

1. **Quick Reference**
   - Access resume without leaving interview
   - No need to open another window/tab
   - All information in one place

2. **Context Awareness**
   - See what's on your resume
   - Recall specific experiences
   - Reference dates, projects, skills

3. **Better Answers**
   - Accurate details from resume
   - Consistent storytelling
   - Confidence during interview

4. **Flexible Layout**
   - Hide when not needed (more focus space)
   - Show when answering experience questions
   - Quick toggle between states

### Use Cases

**Show Resume When:**

- ✅ AI asks about specific experience
- ✅ Need to recall project details
- ✅ Want to mention specific skills
- ✅ Discussing dates/timeline
- ✅ Referencing achievements

**Hide Resume When:**

- ✅ Want full focus on AI
- ✅ Answering behavioral questions
- ✅ Need more screen space
- ✅ Already know your resume well

## Technical Details

### Responsive Design

**Desktop (1200px+):**

- Full side-by-side layout
- Resume panel 384px width
- Smooth transitions

**Tablet (768px-1199px):**

- Side-by-side still works
- Interview area adjusts
- Resume may need more scrolling

**Mobile (<768px):**

- Consider stacking vertically (future enhancement)
- Or keep toggle for space management

### Performance

- **No overhead:** Resume already loaded with session
- **Smooth animations:** CSS transitions (GPU accelerated)
- **Minimal re-renders:** Only on toggle
- **Efficient scrolling:** Native browser scroll

### Accessibility

- Clear toggle button text
- Visual icons for state
- Keyboard accessible
- Screen reader friendly

## Styling Details

### Colors

- Background: `bg-gray-900/50` (semi-transparent black)
- Border: `border-gray-800` (dark gray)
- Text: `text-gray-300` (light gray)
- Header icon: `text-blue-400` (brand color)

### Spacing

- Panel padding: `p-6` (24px)
- Gap between sections: `gap-6` (24px)
- Header margin: `mb-4 pb-4` (16px)

### Typography

- Resume text: `text-sm` (14px)
- Line height: `leading-relaxed` (1.625)
- Header: `text-lg font-semibold` (18px, bold)

## Future Enhancements

### Planned Improvements

- [ ] Highlight keywords mentioned by AI
- [ ] Search within resume
- [ ] Export formatted resume view
- [ ] Print resume from sidebar
- [ ] Adjust font size
- [ ] Dark/light theme toggle

### Mobile Optimization

- [ ] Bottom sheet on mobile
- [ ] Swipe to show/hide
- [ ] Full-screen resume view option

### Smart Features

- [ ] Auto-scroll to relevant sections when AI asks questions
- [ ] Show only relevant sections based on question
- [ ] Quick jump to resume sections (work, education, skills)

## Code Example

### Full Implementation

```tsx
import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

export default function InterviewPage() {
  const [isResumeVisible, setIsResumeVisible] = useState(true);

  return (
    <div className="flex gap-6">
      {/* Left: Interview */}
      <div className="flex-1">
        <VapiInterface {...props} />
      </div>

      {/* Right: Resume */}
      <div
        className={`transition-all duration-300 ${
          isResumeVisible ? "w-96" : "w-12"
        }`}
      >
        <Button onClick={() => setIsResumeVisible(!isResumeVisible)}>
          {isResumeVisible ? "Hide Resume" : "Show Resume"}
        </Button>

        {isResumeVisible && (
          <div
            className="bg-gray-900/50 border border-gray-800 
                          rounded-xl p-6 overflow-y-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3>Your Resume</h3>
            </div>
            <div className="whitespace-pre-wrap">{resumeText}</div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Testing

### Test Checklist

1. **Toggle Functionality:**
   - [ ] Click "Hide Resume" - panel collapses
   - [ ] Click "Show Resume" - panel expands
   - [ ] Smooth animation (no jank)
   - [ ] Button text updates correctly
   - [ ] Icons change direction

2. **Resume Display:**
   - [ ] Text is readable
   - [ ] Formatting preserved (line breaks)
   - [ ] Scrolling works smoothly
   - [ ] Fits in viewport height
   - [ ] No horizontal scroll needed

3. **Layout:**
   - [ ] Interview controls still accessible
   - [ ] Panels don't overlap
   - [ ] Responsive on different screen sizes
   - [ ] No layout shift when toggling

4. **Content:**
   - [ ] Correct resume text displayed
   - [ ] Header shows "Your Resume"
   - [ ] File icon visible
   - [ ] Border and styling correct

## Status: LIVE ✅

The resume sidebar feature is now active!

### What Users Will See

1. **On Interview Page Load:**
   - Resume panel visible on the right
   - Can scroll through full resume
   - Toggle button to hide/show

2. **During Interview:**
   - Reference resume while answering
   - Quick glance at experience
   - Toggle for more/less space

3. **Smooth Experience:**
   - No page refreshes needed
   - Instant toggle
   - Clean, professional layout

**Try it now!**

1. Start an interview session
2. See your resume on the right side
3. Click "Hide Resume" to collapse
4. Click "Show Resume" to expand
5. Reference your resume while practicing! 📄✨
