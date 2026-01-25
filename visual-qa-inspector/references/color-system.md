# Color System Validation

Guide for validating color usage, contrast ratios, and accessibility compliance.

## WCAG Contrast Requirements

### Contrast Ratio Standards

**WCAG AA (Minimum)**

- Normal text (< 18pt): 4.5:1
- Large text (≥ 18pt or 14pt bold): 3:1
- UI components and graphics: 3:1

**WCAG AAA (Enhanced)**

- Normal text: 7:1
- Large text: 4.5:1

### Testing Contrast

Use the automated contrast checker:

```bash
python scripts/contrast_checker.py --foreground "#8A9A5B" --background "#FAFAF5"
```

Or manually calculate:

1. Convert hex to RGB
2. Calculate relative luminance
3. Apply contrast ratio formula: (L1 + 0.05) / (L2 + 0.05)

## Brand Color Palette

### Primary Colors

**Sage Green** - `#8A9A5B`

- RGB: (138, 154, 91)
- Use for: Primary buttons, headings, key UI elements
- Contrast on Off-White: ~3.2:1 (AA for large text only)
- **Warning**: Does not meet AA for normal text on Off-White background

**Dusty Rose** - `#E6C2BF`

- RGB: (230, 194, 191)
- Use for: Accents, highlights, CTAs
- Contrast on Off-White: ~1.3:1 (Insufficient)
- **Warning**: Use only for decorative elements, not text

**Off-White** - `#FAFAF5`

- RGB: (250, 250, 245)
- Use for: Backgrounds, cards, containers

### Recommended Text Colors

For readable text on Off-White (#FAFAF5):

**Dark Sage** - `#5A6A3B` (darker version of Sage Green)

- Contrast: ~6.8:1 (AA compliant)
- Use for: Body text, headings

**Charcoal** - `#2D2D2D`

- Contrast: ~14.5:1 (AAA compliant)
- Use for: Primary text, important content

**Medium Gray** - `#666666`

- Contrast: ~5.7:1 (AA compliant)
- Use for: Secondary text, captions

### Safe Color Combinations

| Foreground | Background | Ratio | WCAG | Use Case |
|------------|------------|-------|------|----------|
| #2D2D2D | #FAFAF5 | 14.5:1 | AAA | Body text |
| #5A6A3B | #FAFAF5 | 6.8:1 | AA | Headings |
| #666666 | #FAFAF5 | 5.7:1 | AA | Secondary text |
| #FAFAF5 | #8A9A5B | 3.2:1 | AA (large) | Button text |
| #FAFAF5 | #5A6A3B | 6.8:1 | AA | Dark buttons |

### Unsafe Combinations (Avoid)

| Foreground | Background | Ratio | Issue |
|------------|------------|-------|-------|
| #8A9A5B | #FAFAF5 | 3.2:1 | Fails AA for normal text |
| #E6C2BF | #FAFAF5 | 1.3:1 | Fails all standards |
| #E6C2BF | #8A9A5B | 2.4:1 | Fails AA |

## Glassmorphism Considerations

When using glassmorphism effects, contrast becomes more complex:

### Background Blur

- Ensure text remains readable over blurred backgrounds
- Test with various background images/colors
- Increase backdrop opacity if contrast suffers

### Overlay Opacity

- Minimum 0.7 opacity for text containers
- 0.8-0.9 recommended for optimal readability
- Pure white/dark overlays improve contrast

### Testing Glassmorphism

1. Capture screenshot with glass effect
2. Use color picker to sample actual rendered colors
3. Calculate contrast with sampled values
4. Adjust opacity/blur until contrast meets standards

## Color Harmony

### Complementary Colors

- Sage Green (#8A9A5B) + Dusty Rose (#E6C2BF) = Harmonious
- Both low saturation, similar lightness
- Creates soft, spa-like aesthetic

### Accent Colors

When adding accent colors:

- Keep saturation low (< 40%)
- Match lightness to existing palette
- Test contrast before using for text

### Gradients

- Use colors from same family
- Ensure all gradient stops meet contrast requirements
- Test text readability at all gradient positions

## Accessibility Checklist

- [ ] All text meets minimum 4.5:1 contrast (AA)
- [ ] Important CTAs meet 7:1 contrast (AAA)
- [ ] Links distinguishable from body text (3:1 difference)
- [ ] Focus indicators have 3:1 contrast with background
- [ ] UI components (buttons, inputs) have 3:1 contrast
- [ ] Glassmorphism effects maintain readable contrast
- [ ] Color not sole indicator of information
- [ ] Sufficient contrast in all states (hover, active, disabled)

## Common Issues & Fixes

### Issue: Sage Green text too light on Off-White

**Fix**: Use Dark Sage (#5A6A3B) instead for body text

### Issue: Dusty Rose unreadable as text

**Fix**: Use only for decorative elements, borders, or backgrounds with dark text

### Issue: Glassmorphism reduces contrast

**Fix**: Increase backdrop opacity to 0.8-0.9 or add semi-transparent overlay

### Issue: Hover states lose contrast

**Fix**: Darken hover colors by 10-15% to maintain contrast ratio

## Tools & Resources

- **Automated**: `scripts/contrast_checker.py`
- **Online**: WebAIM Contrast Checker, Coolors Contrast Checker
- **Browser**: Chrome DevTools Accessibility panel
- **Design**: Figma contrast plugins, Stark
