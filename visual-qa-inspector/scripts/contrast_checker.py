#!/usr/bin/env python3
"""
Color Contrast Checker
Validates color combinations against WCAG accessibility standards.

Usage:
    python contrast_checker.py --foreground "#8A9A5B" --background "#FAFAF5"
    python contrast_checker.py --colors "#8A9A5B,#E6C2BF,#FAFAF5" --background "#FAFAF5"
"""

import argparse
import sys
from typing import Tuple


def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def relative_luminance(rgb: Tuple[int, int, int]) -> float:
    """Calculate relative luminance of an RGB color."""
    r, g, b = [x / 255.0 for x in rgb]
    
    # Apply gamma correction
    r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
    g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
    b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(color1: str, color2: str) -> float:
    """Calculate contrast ratio between two colors."""
    rgb1 = hex_to_rgb(color1)
    rgb2 = hex_to_rgb(color2)
    
    lum1 = relative_luminance(rgb1)
    lum2 = relative_luminance(rgb2)
    
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    
    return (lighter + 0.05) / (darker + 0.05)


def wcag_compliance(ratio: float) -> dict:
    """Determine WCAG compliance level for a contrast ratio."""
    return {
        'AA_normal': ratio >= 4.5,
        'AA_large': ratio >= 3.0,
        'AAA_normal': ratio >= 7.0,
        'AAA_large': ratio >= 4.5,
    }


def format_compliance(compliance: dict) -> str:
    """Format compliance results as a readable string."""
    results = []
    
    if compliance['AAA_normal']:
        results.append('✓ AAA (normal text)')
    elif compliance['AA_normal']:
        results.append('✓ AA (normal text)')
    else:
        results.append('✗ Fails AA (normal text)')
    
    if compliance['AAA_large']:
        results.append('✓ AAA (large text)')
    elif compliance['AA_large']:
        results.append('✓ AA (large text)')
    else:
        results.append('✗ Fails AA (large text)')
    
    return ' | '.join(results)


def get_recommendation(ratio: float, compliance: dict) -> str:
    """Provide recommendations based on contrast ratio."""
    if compliance['AAA_normal']:
        return "Excellent contrast! Safe for all text sizes."
    elif compliance['AA_normal']:
        return "Good contrast for normal text. Consider darker shade for AAA compliance."
    elif compliance['AA_large']:
        return "⚠ Only suitable for large text (18pt+ or 14pt bold). Use darker color for normal text."
    else:
        return "❌ Insufficient contrast. Do not use for text. Decorative elements only."


def darken_color(hex_color: str, amount: float = 0.2) -> str:
    """Darken a hex color by a percentage."""
    rgb = hex_to_rgb(hex_color)
    darkened = tuple(max(0, int(c * (1 - amount))) for c in rgb)
    return f"#{darkened[0]:02x}{darkened[1]:02x}{darkened[2]:02x}"


def lighten_color(hex_color: str, amount: float = 0.2) -> str:
    """Lighten a hex color by a percentage."""
    rgb = hex_to_rgb(hex_color)
    lightened = tuple(min(255, int(c + (255 - c) * amount)) for c in rgb)
    return f"#{lightened[0]:02x}{lightened[1]:02x}{lightened[2]:02x}"


def suggest_alternative(foreground: str, background: str, target_ratio: float = 4.5) -> str:
    """Suggest an alternative color to meet target contrast ratio."""
    current_ratio = contrast_ratio(foreground, background)
    
    if current_ratio >= target_ratio:
        return None
    
    # Determine if we should darken or lighten
    fg_lum = relative_luminance(hex_to_rgb(foreground))
    bg_lum = relative_luminance(hex_to_rgb(background))
    
    if fg_lum > bg_lum:
        # Foreground is lighter, try lightening it more
        for amount in [0.1, 0.2, 0.3, 0.4, 0.5]:
            alt_color = lighten_color(foreground, amount)
            if contrast_ratio(alt_color, background) >= target_ratio:
                return alt_color
    else:
        # Foreground is darker, try darkening it more
        for amount in [0.1, 0.2, 0.3, 0.4, 0.5]:
            alt_color = darken_color(foreground, amount)
            if contrast_ratio(alt_color, background) >= target_ratio:
                return alt_color
    
    return None


def main():
    parser = argparse.ArgumentParser(
        description='Check color contrast ratios against WCAG standards'
    )
    parser.add_argument(
        '--foreground', '-f',
        help='Foreground color (hex format, e.g., #8A9A5B)'
    )
    parser.add_argument(
        '--background', '-b',
        required=True,
        help='Background color (hex format, e.g., #FAFAF5)'
    )
    parser.add_argument(
        '--colors', '-c',
        help='Comma-separated list of colors to check against background'
    )
    
    args = parser.parse_args()
    
    # Collect colors to check
    colors_to_check = []
    if args.foreground:
        colors_to_check.append(args.foreground)
    if args.colors:
        colors_to_check.extend([c.strip() for c in args.colors.split(',')])
    
    if not colors_to_check:
        print("Error: Provide at least one foreground color using --foreground or --colors")
        sys.exit(1)
    
    print("=" * 80)
    print("COLOR CONTRAST ANALYSIS")
    print("=" * 80)
    print(f"\nBackground: {args.background}")
    print()
    
    for fg_color in colors_to_check:
        if fg_color == args.background:
            continue  # Skip if same as background
        
        ratio = contrast_ratio(fg_color, args.background)
        compliance = wcag_compliance(ratio)
        
        print(f"Foreground: {fg_color}")
        print(f"  Contrast Ratio: {ratio:.2f}:1")
        print(f"  Compliance: {format_compliance(compliance)}")
        print(f"  Recommendation: {get_recommendation(ratio, compliance)}")
        
        # Suggest alternative if needed
        if not compliance['AA_normal']:
            alt_color = suggest_alternative(fg_color, args.background, 4.5)
            if alt_color:
                alt_ratio = contrast_ratio(alt_color, args.background)
                print(f"  💡 Suggested alternative: {alt_color} (ratio: {alt_ratio:.2f}:1)")
        
        print()
    
    print("=" * 80)
    print("\nWCAG Standards:")
    print("  AA (normal text): 4.5:1 minimum")
    print("  AA (large text):  3.0:1 minimum")
    print("  AAA (normal text): 7.0:1 minimum")
    print("  AAA (large text):  4.5:1 minimum")
    print("\nLarge text = 18pt+ or 14pt+ bold")
    print("=" * 80)


if __name__ == '__main__':
    main()
