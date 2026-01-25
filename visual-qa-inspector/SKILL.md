---
name: visual-qa-inspector
description: Comprehensive visual website inspection and design quality assurance. Use when the user requests visual inspection, design review, QA checks, UI/UX validation, or wants to verify that a website is professionally designed and polished. Triggers on requests to check colors, typography, spacing, layout, responsive design, glassmorphism effects, animations, contrast ratios, accessibility, or any visual design issues. Also use when the user wants to detect design distortions, improve visual appearance, or ensure professional presentation.
---

# Visual QA Inspector

This skill provides comprehensive visual inspection and design quality assurance for websites, ensuring professional, polished presentation.

## Workflow

Follow this systematic approach for visual inspection:

### 1. Capture Visual State

Use the browser tool to navigate to the website and capture screenshots:

```
- Navigate to the target URL
- Capture full-page screenshots at different viewport sizes:
  - Desktop: 1920x1080
  - Tablet: 768x1024
  - Mobile: 375x667
- Capture screenshots of key sections and interactive states
```

### 2. Run Automated Checks

Execute automated validation scripts:

```bash
# Check color contrast ratios
python scripts/contrast_checker.py --colors "#8A9A5B,#E6C2BF,#FAFAF5" --background "#FAFAF5"
```

### 3. Perform Visual Inspection

Review screenshots against design checklists. Load the appropriate reference file:

- **Design Quality**: See [references/design-checklist.md](references/design-checklist.md) for comprehensive visual inspection checklist
- **Color System**: See [references/color-system.md](references/color-system.md) for color validation and contrast checks
- **Typography**: See [references/typography-guide.md](references/typography-guide.md) for font hierarchy and readability
- **UX Patterns**: See [references/ux-patterns.md](references/ux-patterns.md) for interaction and usability validation

### 4. Document Findings

Create a structured report with:

- **Critical Issues**: Problems that break functionality or severely impact UX
- **Design Issues**: Visual inconsistencies, poor contrast, alignment problems
- **Enhancements**: Opportunities to improve polish and professionalism
- **Screenshots**: Annotated images showing specific issues

### 5. Provide Actionable Fixes

For each issue identified:

- Explain the problem clearly
- Provide specific CSS/code fixes
- Reference design system values (colors, spacing, typography)
- Prioritize fixes by impact

## Key Inspection Areas

### Colors

- Brand color consistency
- Contrast ratios (WCAG AA/AAA compliance)
- Color harmony and palette usage
- Glassmorphism effect quality

### Typography

- Font hierarchy (H1, H2, H3, body, small)
- Line height and letter spacing
- Readability on different backgrounds
- Hebrew/RTL text support

### Layout & Spacing

- Consistent spacing scale
- Element alignment
- White space balance
- Grid structure

### Responsive Design

- Breakpoint behavior
- Mobile touch targets (min 44x44px)
- Text readability on small screens
- Image scaling and optimization

### Interactions

- Hover states
- Active/focus states
- Animation smoothness
- Loading states

## Best Practices

1. **Always capture screenshots first** - Visual evidence is essential for accurate inspection
2. **Use the design system** - Reference brand colors, spacing, and typography from the design system
3. **Check multiple viewports** - Test desktop, tablet, and mobile layouts
4. **Validate accessibility** - Run contrast checks and verify WCAG compliance
5. **Provide specific fixes** - Give exact CSS values and code snippets, not vague suggestions
6. **Prioritize issues** - Focus on critical problems first, then polish
