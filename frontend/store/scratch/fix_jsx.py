import re

file_path = r"c:\Users\User\OneDrive\Desktop\barter-1\tech-wave\components\storefront.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# Find the start of the dangerouslySetInnerHTML block
start_str = "{activeTab === 'product' && <main dangerouslySetInnerHTML={{__html: `"
start_idx = code.find(start_str)

if start_idx != -1:
    end_str = "`}} />}"
    end_idx = code.find(end_str, start_idx)
    
    if end_idx != -1:
        # Extract the raw HTML string
        inner_html = code[start_idx + len(start_str) : end_idx]
        
        # Convert to pure JSX
        # 1. `for=` to `htmlFor=`
        inner_html = inner_html.replace(' for="', ' htmlFor="')
        
        # 2. `checked` to `defaultChecked` (to prevent React uncontrolled component warnings)
        inner_html = inner_html.replace(' checked ', ' defaultChecked ')
        
        # 3. Unescape any backticks if there were any
        inner_html = inner_html.replace('\\`', '`')
        
        # Create the new block
        new_block = "{activeTab === 'product' && <main>\n" + inner_html + "\n</main>}"
        
        # Replace in code
        code = code[:start_idx] + new_block + code[end_idx + len(end_str):]
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(code)
        
        print("Successfully converted product detail to pure JSX!")
    else:
        print("End string not found!")
else:
    print("Start string not found!")
