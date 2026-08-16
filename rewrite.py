import re

with open(r'c:\Users\6592e\project\modules\module-12-frontend\src\App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace classes and CSS variable references
content = content.replace('glass-panel', 'panel')
content = content.replace('var(--accent-cyan)', 'var(--accent-main)')
content = content.replace('var(--border-glass)', 'var(--border-main)')

# Replace arbitrary alpha colors with institutional colors / variables
content = content.replace('rgba(34, 211, 238, 0.1)', 'var(--accent-light)')
content = content.replace('rgba(34, 211, 238, 0.08)', 'var(--accent-light)')
content = content.replace('rgba(34, 211, 238, 0.05)', 'var(--accent-light)')
content = content.replace('rgba(34, 211, 238, 0.2)', 'var(--accent-main)')
content = content.replace('rgba(255,255,255,0.02)', '#f8fafc')
content = content.replace('rgba(255,255,255,0.05)', '#e2e8f0')
content = content.replace('rgba(255,255,255,0.015)', '#ffffff')
content = content.replace('rgba(255,255,255,0.03)', '#f1f5f9')
content = content.replace('rgba(0,0,0,0.2)', '#f8fafc')

content = content.replace("boxShadow: '0 0 8px var(--accent-cyan)'", "boxShadow: 'none'")
content = content.replace("boxShadow: `0 0 8px ${s.score >= 60 ? 'var(--status-allow)' : 'var(--status-deny)'}88`", "boxShadow: 'none'")
content = content.replace("filter: 'drop-shadow(0 0 16px var(--accent-cyan))'", "filter: 'none'")
content = content.replace("background: 'transparent'", "background: '#ffffff'")

with open(r'c:\Users\6592e\project\modules\module-12-frontend\src\App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
