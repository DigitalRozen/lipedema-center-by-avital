# UX Patterns & Best Practices

Guide for validating user experience, interaction patterns, and interface usability.

## Interactive Elements

### Buttons & CTAs

**Visual Requirements**

- [ ] Minimum size: 44x44px (mobile touch target)
- [ ] Padding: 12px-24px horizontal, 8px-16px vertical
- [ ] Border radius: Consistent across all buttons
- [ ] Clear visual hierarchy (primary > secondary > tertiary)

**States**

- [ ] **Default**: Clear, inviting appearance
- [ ] **Hover**: Subtle color shift or elevation change
- [ ] **Active**: Pressed/clicked feedback
- [ ] **Focus**: Visible outline for keyboard navigation (3:1 contrast)
- [ ] **Disabled**: Reduced opacity (0.5-0.6), no hover effect

**Best Practices**

- Primary action uses accent color (Dusty Rose or Dark Sage)
- Secondary actions use outline or ghost style
- Destructive actions use red/warning color
- Icon + text buttons have 8px gap
- Loading state shows spinner or skeleton

### Links

**Visual Requirements**

- [ ] Distinguishable from body text (color, underline, or both)
- [ ] 3:1 contrast difference from surrounding text
- [ ] Hover state changes appearance
- [ ] Visited state optional but consistent if used

**States**

- [ ] **Default**: Colored or underlined
- [ ] **Hover**: Color shift or underline appears
- [ ] **Focus**: Visible outline
- [ ] **Active**: Momentary color change
- [ ] **Visited**: Optional muted color

### Form Inputs

**Visual Requirements**

- [ ] Minimum height: 44px (mobile touch target)
- [ ] Clear border (1px-2px)
- [ ] Sufficient padding (12px-16px)
- [ ] Label visible and associated
- [ ] Placeholder text helpful but not essential

**States**

- [ ] **Default**: Neutral border color
- [ ] **Focus**: Highlighted border (accent color, 2px)
- [ ] **Error**: Red border + error message
- [ ] **Success**: Green border or checkmark
- [ ] **Disabled**: Reduced opacity, no interaction

**Best Practices**

- Labels above inputs (not inside)
- Required fields marked with asterisk
- Error messages below input, specific and helpful
- Success feedback for completed fields
- Input width matches expected content length

### Checkboxes & Radio Buttons

**Visual Requirements**

- [ ] Minimum size: 20px-24px
- [ ] Clear checked state
- [ ] Aligned with label text
- [ ] Sufficient spacing between options (8px-12px)

**States**

- [ ] **Unchecked**: Empty box/circle
- [ ] **Checked**: Filled with checkmark/dot
- [ ] **Hover**: Subtle border or background change
- [ ] **Focus**: Visible outline
- [ ] **Disabled**: Reduced opacity

## Navigation Patterns

### Primary Navigation

**Desktop**

- [ ] Logo on left (LTR) or right (RTL)
- [ ] Navigation items horizontally aligned
- [ ] Current page highlighted
- [ ] Hover states on nav items
- [ ] Dropdown menus (if needed) appear on hover/click

**Mobile**

- [ ] Hamburger menu icon (top right for LTR, top left for RTL)
- [ ] Menu overlay or slide-in panel
- [ ] Close button clearly visible
- [ ] Navigation items vertically stacked
- [ ] Touch targets minimum 44x44px

**Best Practices**

- Maximum 7 top-level items
- Current page clearly indicated
- Consistent positioning across pages
- Sticky header optional but smooth

### Breadcrumbs

**When to Use**

- Deep site hierarchy (3+ levels)
- E-commerce or documentation sites
- Help users understand location

**Visual Requirements**

- [ ] Small text (14px)
- [ ] Separated by chevrons or slashes
- [ ] Current page not linked
- [ ] Hover states on links
- [ ] Truncate on mobile if needed

## Feedback & Messaging

### Success Messages

**Visual Design**

- Green background or border
- Checkmark icon
- Clear, concise message
- Auto-dismiss after 3-5 seconds (optional)

**Placement**

- Top of page (toast notification)
- Inline near action (form submission)
- Modal for critical confirmations

### Error Messages

**Visual Design**

- Red background or border
- Warning/error icon
- Specific, actionable message
- Persistent until resolved

**Best Practices**

- Explain what went wrong
- Suggest how to fix it
- Avoid technical jargon
- Inline validation for forms

### Loading States

**Spinners**

- Use for short waits (< 3 seconds)
- Center on page or within component
- Consistent size and color

**Progress Bars**

- Use for longer processes
- Show percentage if possible
- Smooth animation

**Skeleton Screens**

- Use for content loading
- Match layout of final content
- Subtle shimmer animation

## Cards & Containers

### Card Design

**Visual Requirements**

- [ ] Consistent border radius (8px-16px)
- [ ] Subtle shadow or border
- [ ] Adequate padding (16px-24px)
- [ ] Clear content hierarchy

**Interactive Cards**

- [ ] Hover state (elevation or border change)
- [ ] Entire card clickable (not just title)
- [ ] Cursor changes to pointer
- [ ] Smooth transition (200-300ms)

**Best Practices**

- Image at top, content below
- Title → description → action
- Consistent card sizes in grid
- Responsive grid (1-2-3-4 columns)

### Glassmorphism Cards

**Visual Requirements**

- [ ] Backdrop blur: 8px-16px
- [ ] Background opacity: 0.7-0.9
- [ ] Subtle border: 1px rgba(255,255,255,0.2)
- [ ] Shadow for depth
- [ ] Content remains readable

**Best Practices**

- Use on busy backgrounds
- Ensure sufficient contrast
- Test with various background images
- Don't overuse (accent elements only)

## Modal & Overlay Patterns

### Modal Dialogs

**Visual Requirements**

- [ ] Centered on screen
- [ ] Dark overlay behind (0.5-0.7 opacity)
- [ ] Close button (top right)
- [ ] Maximum width: 600px-800px
- [ ] Padding: 24px-32px

**Behavior**

- [ ] Traps focus (keyboard navigation)
- [ ] Closes on overlay click or ESC key
- [ ] Smooth fade-in animation (200-300ms)
- [ ] Body scroll locked when open

**Best Practices**

- Use sparingly (interrupts user flow)
- Clear title and purpose
- Primary action prominent
- Cancel/close option always visible

### Tooltips

**Visual Requirements**

- [ ] Small, concise text
- [ ] Dark background, white text
- [ ] Arrow pointing to trigger element
- [ ] Positioned to avoid covering content

**Behavior**

- [ ] Appears on hover (desktop) or tap (mobile)
- [ ] Slight delay (300-500ms)
- [ ] Dismisses on mouse out or tap outside

## Responsive Design Patterns

### Mobile-First Approach

**Breakpoints**

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile Optimizations**

- [ ] Touch targets minimum 44x44px
- [ ] Simplified navigation (hamburger menu)
- [ ] Single column layout
- [ ] Larger text for readability
- [ ] Reduced animations

### Touch Interactions

**Requirements**

- [ ] Minimum touch target: 44x44px
- [ ] Spacing between targets: 8px minimum
- [ ] Swipe gestures intuitive
- [ ] No hover-dependent functionality

**Best Practices**

- Avoid tiny buttons
- Use native form controls
- Test on actual devices
- Consider thumb zones (bottom of screen)

## Accessibility Patterns

### Keyboard Navigation

**Requirements**

- [ ] All interactive elements focusable
- [ ] Logical tab order
- [ ] Visible focus indicators (3:1 contrast)
- [ ] Skip to main content link
- [ ] No keyboard traps

**Best Practices**

- Test with keyboard only
- Use semantic HTML
- ARIA labels for icon buttons
- Focus management in modals

### Screen Reader Support

**Requirements**

- [ ] Semantic HTML (nav, main, article, etc.)
- [ ] Alt text for images
- [ ] ARIA labels for complex widgets
- [ ] Form labels properly associated
- [ ] Heading hierarchy (H1-H6)

**Best Practices**

- Test with screen reader
- Avoid "click here" link text
- Describe image content meaningfully
- Announce dynamic content changes

## Animation & Motion

### Micro-interactions

**Best Practices**

- Duration: 200-400ms for UI
- Easing: ease-in-out or custom bezier
- Purpose: Provide feedback, guide attention
- Subtlety: Enhance, don't distract

**Common Patterns**

- Button press: Scale down slightly (0.95)
- Hover: Lift with shadow or color shift
- Loading: Pulse or rotate
- Success: Checkmark animation
- Error: Shake or pulse red

### Page Transitions

**Best Practices**

- Duration: 300-500ms
- Fade or slide transitions
- Maintain scroll position
- Avoid jarring movements

### Reduced Motion

**Requirements**

- [ ] Respect `prefers-reduced-motion`
- [ ] Disable animations for users who request it
- [ ] Maintain functionality without animation

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Common UX Issues & Fixes

### Issue: Buttons too small on mobile

**Fix**: Increase to minimum 44x44px

### Issue: No feedback on interaction

**Fix**: Add hover, active, and focus states

### Issue: Form errors unclear

**Fix**: Inline validation with specific messages

### Issue: Navigation confusing

**Fix**: Highlight current page, simplify structure

### Issue: Modal can't be closed

**Fix**: Add close button, ESC key, and overlay click

### Issue: Content jumps during loading

**Fix**: Use skeleton screens or fixed heights

### Issue: Poor keyboard navigation

**Fix**: Ensure logical tab order and visible focus states

### Issue: Animations cause motion sickness

**Fix**: Implement `prefers-reduced-motion` support
