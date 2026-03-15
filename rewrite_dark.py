import re

file_path = r'c:\Users\6592e\project\modules\module-12-frontend\src\App.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace light mode backgrounds with dark mode equivalents
content = content.replace("'#f8fafc'", "'#111111'") # very dark
content = content.replace("'#e2e8f0'", "'#222222'") # lighter border/bg
content = content.replace("'#ffffff'", "'#141414'") # panel bg
content = content.replace("'#f1f5f9'", "'#1a1a1a'") # hover state bg
content = content.replace("'#f5f5f5'", "'#1e1e1e'") 
content = content.replace("'#f0f0f0'", "'#1c1c1c'")
content = content.replace("'#e0e0e0'", "'#333333'")
content = content.replace("'#d5d5d5'", "'#3a3a3a'")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
