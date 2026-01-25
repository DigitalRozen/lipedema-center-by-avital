# Typography Guide

Comprehensive guide for validating typography hierarchy, readability, and font usage.

## Font Hierarchy

### Heading Scale

**H1 - Primary Headline**

- Size: 48px - 64px (desktop), 32px - 40px (mobile)
- Weight: 700 (Bold)
- Line height: 1.1 - 1.2
- Letter spacing: -0.02em (tight)
- Use: Page title, hero headline (one per page)

**H2 - Section Headline**

- Size: 36px - 48px (desktop), 28px - 32px (mobile)
- Weight: 600 (Semi-bold)
- Line height: 1.2 - 1.3
- Letter spacing: -0.01em
- Use: Major section headers

**H3 - Subsection Headline**

- Size: 28px - 36px (desktop), 24px - 28px (mobile)
- Weight: 600 (Semi-bold)
- Line height: 1.3
- Letter spacing: 0
- Use: Subsection headers, card titles

**H4 - Minor Headline**

- Size: 20px - 24px (desktop), 18px - 20px (mobile)
- Weight: 600 (Semi-bold)
- Line height: 1.4
- Letter spacing: 0
- Use: Component headers, list titles

**H5 - Small Headline**

- Size: 16px - 18px
- Weight: 600 (Semi-bold)
- Line height: 1.4
- Letter spacing: 0.01em
- Use: Labels, small headers

**H6 - Tiny Headline**

- Size: 14px - 16px
- Weight: 600 (Semi-bold)
- Line height: 1.4
- Letter spacing: 0.02em
- Use: Overlines, tags, metadata

### Body Text

**Large Body**

- Size: 18px - 20px
- Weight: 400 (Regular)
- Line height: 1.6 - 1.8
- Use: Introductory paragraphs, featured content

**Normal Body**

- Size: 16px
- Weight: 400 (Regular)
- Line height: 1.6 - 1.8
- Use: Standard body text, paragraphs

**Small Body**

- Size: 14px
- Weight: 400 (Regular)
- Line height: 1.5 - 1.7
- Use: Captions, footnotes, secondary information

**Tiny Text**

- Size: 12px (minimum)
- Weight: 400 (Regular)
- Line height: 1.5
- Use: Legal text, disclaimers (use sparingly)

## Readability Standards

### Line Length

- **Optimal**: 50-75 characters per line
- **Maximum**: 90 characters
- **Minimum**: 40 characters
- **Fix**: Adjust container width or font size

### Line Height

- **Body text**: 1.5 - 1.8 (recommended: 1.6)
- **Headings**: 1.1 - 1.3
- **Small text**: 1.5 - 1.7
- **Rule**: Larger line length = larger line height

### Letter Spacing

- **Headings**: -0.02em to 0 (tighter)
- **Body**: 0 to 0.01em (normal)
- **Small caps**: 0.05em - 0.1em (looser)
- **All caps**: 0.05em - 0.15em (looser)

### Font Weight

- **Minimum for body**: 400 (Regular)
- **Headings**: 600-700 (Semi-bold to Bold)
- **Avoid**: 300 (Light) on light backgrounds
- **Emphasis**: 600 (Semi-bold) for inline emphasis

## Hebrew/RTL Typography

### Font Selection

- Use fonts with proper Hebrew character support
- Recommended: Rubik, Heebo, Assistant, Alef
- Avoid: Fonts with poor Hebrew rendering

### RTL Layout

- Text alignment: right
- Direction: rtl
- Padding/margin: reversed (padding-right instead of padding-left)
- Icons: mirrored for directional elements

### Mixed Content

- Hebrew text: RTL alignment
- English text: LTR alignment
- Numbers: Follow context direction
- Punctuation: Proper Unicode bidi handling

### Hebrew-Specific Adjustments

- Line height: May need 1.7-1.9 (slightly taller)
- Letter spacing: Usually 0 (avoid tight spacing)
- Font weight: May appear lighter, use 500-600 for body

## Font Loading & Performance

### Web Font Strategy

**Optimal Loading**

```css
@font-face {
  font-family: 'YourFont';
  src: url('/fonts/font.woff2') format('woff2');
  font-display: swap; /* Prevent FOIT */
  font-weight: 400;
  font-style: normal;
}
```

**Font Display Options**

- `swap`: Show fallback immediately, swap when loaded (recommended)
- `optional`: Use font if cached, otherwise fallback
- `block`: Brief invisible period, then show font
- `fallback`: Brief invisible period, swap if loaded quickly

### Fallback Fonts

```css
font-family: 'Rubik', 'Heebo', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Arial, sans-serif;
```

### Font Subsetting

- Include only needed characters
- Separate files for Hebrew/Latin
- Reduce file size by 70-90%

## Inspection Checklist

### Hierarchy

- [ ] Clear visual hierarchy (H1 largest → H6 smallest)
- [ ] Only one H1 per page
- [ ] Heading levels not skipped (H1 → H2, not H1 → H3)
- [ ] Size difference between levels sufficient (1.2x - 1.5x)

### Readability

- [ ] Body text minimum 16px
- [ ] Line height 1.5-1.8 for body text
- [ ] Line length 50-75 characters
- [ ] Sufficient contrast (see color-system.md)
- [ ] No light text on light backgrounds

### Consistency

- [ ] Font sizes consistent across pages
- [ ] Font weights consistent for same elements
- [ ] Line heights consistent within text blocks
- [ ] Letter spacing consistent

### Hebrew/RTL

- [ ] Hebrew text displays correctly
- [ ] RTL direction applied
- [ ] Font supports Hebrew characters
- [ ] Mixed Hebrew/English handled properly
- [ ] Punctuation displays correctly

### Performance

- [ ] Fonts load without FOUT/FOIT
- [ ] Font files optimized (WOFF2)
- [ ] Fallback fonts specified
- [ ] Font subsetting implemented

### Responsive

- [ ] Font sizes scale appropriately
- [ ] Headings readable on mobile
- [ ] Line length optimal on all viewports
- [ ] No horizontal scroll due to text

## Common Issues & Fixes

### Issue: Text too small on mobile

**Fix**: Use `clamp()` for responsive sizing

```css
font-size: clamp(16px, 4vw, 20px);
```

### Issue: Headings too similar in size

**Fix**: Increase scale ratio (1.5x between levels)

### Issue: Poor line height causing cramped text

**Fix**: Increase to 1.6-1.8 for body text

### Issue: Hebrew text appears broken

**Fix**: Ensure `dir="rtl"` and proper font with Hebrew support

### Issue: Font loading causes layout shift

**Fix**: Use `font-display: swap` and size-adjust

### Issue: Text unreadable on glassmorphism

**Fix**: Increase backdrop opacity or add text shadow

```css
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
```

## Recommended Font Pairings

### For Medical/Spa Aesthetic

**Option 1: Clean & Modern**

- Headings: Rubik (600-700)
- Body: Rubik (400)
- Supports Hebrew natively

**Option 2: Professional & Trustworthy**

- Headings: Heebo (600-700)
- Body: Heebo (400)
- Excellent Hebrew support

**Option 3: Soft & Elegant**

- Headings: Assistant (600-700)
- Body: Assistant (400)
- Rounded, friendly feel

## Typography Scale Generator

Use this ratio to maintain consistent hierarchy:

**Major Third (1.25)**

- 12px → 15px → 19px → 24px → 30px → 37px → 46px

**Perfect Fourth (1.33)**

- 12px → 16px → 21px → 28px → 37px → 50px → 67px

**Golden Ratio (1.618)**

- 12px → 19px → 31px → 50px → 81px
