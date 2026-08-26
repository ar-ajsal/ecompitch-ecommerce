import os

css_path = r"c:\Users\User\OneDrive\Desktop\barter-1\tech-wave\app\globals.css"
styles_path = r"c:\Users\User\OneDrive\Desktop\barter-1\9b36af76_ui\styles.css"

tailwind_header = """@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';

:root { color-scheme: light; --background: oklch(0.72 0.025 225); --foreground: oklch(0.16 0.015 250); --card: oklch(0.99 0.005 250); --card-foreground: oklch(0.16 0.015 250); --primary: oklch(0.16 0.015 250); --primary-foreground: oklch(0.98 0 0); --muted: oklch(0.965 0.006 250); --muted-foreground: oklch(0.47 0.01 250); --border: oklch(0.88 0.01 250); --input: oklch(0.88 0.01 250); --ring: oklch(0.55 0.03 220); --radius: 1.25rem; }
@theme inline { --color-background: var(--background); --color-foreground: var(--foreground); --color-card: var(--card); --color-card-foreground: var(--card-foreground); --color-primary: var(--primary); --color-primary-foreground: var(--primary-foreground); --color-muted: var(--muted); --color-muted-foreground: var(--muted-foreground); --color-border: var(--border); --color-input: var(--input); --color-ring: var(--ring); --font-sans: Arial, Helvetica, sans-serif; }
"""

with open(styles_path, "r", encoding="utf-8") as f:
    new_styles = f.read()

# Fix the problem with variables from Shadcn and the new styles.
# It should be fine to just append them.
with open(css_path, "w", encoding="utf-8") as f:
    f.write(tailwind_header + "\n" + new_styles)

print("globals.css rewritten successfully!")
