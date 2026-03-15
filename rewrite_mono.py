import re

file_path = r'c:\Users\6592e\project\modules\module-12-frontend\src\App.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace inline color references to grayscale
content = content.replace("var(--accent-main)", "var(--text-primary)")
content = content.replace("var(--accent-light)", "var(--accent-light)")
content = content.replace("var(--status-allow)", "var(--text-primary)")
content = content.replace("var(--status-deny)", "var(--text-secondary)")
content = content.replace("var(--border-main)", "var(--border-main)")

# Remove random colored backgrounds, replace with grays
content = content.replace("'rgba(74,222,128,0.1)'", "'#f5f5f5'")
content = content.replace("'rgba(248,113,113,0.1)'", "'#f0f0f0'")
content = content.replace("'rgba(74,222,128,0.3)'", "'#e0e0e0'")
content = content.replace("'rgba(248,113,113,0.3)'", "'#d5d5d5'")

# Make sure all icons are monochrome
content = content.replace('color="var(--accent-cyan)"', 'color="var(--text-primary)"')
content = content.replace('color="var(--status-allow)"', 'color="var(--text-primary)"')
content = content.replace('color="var(--text-secondary)"', 'color="var(--text-muted)"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
