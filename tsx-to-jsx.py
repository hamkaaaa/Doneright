#!/usr/bin/env python3
import os
import re
import sys

def remove_type_annotations(content):
    """Remove TypeScript type annotations from code"""

    # Remove import type statements
    content = re.sub(r'^import type .*$', '', content, flags=re.MULTILINE)

    # Remove export type declarations
    content = re.sub(r'^export type .*?;$', '', content, flags=re.MULTILINE | re.DOTALL)

    # Remove standalone type declarations
    content = re.sub(r'^type .*?;$', '', content, flags=re.MULTILINE | re.DOTALL)

    # Remove interface declarations
    content = re.sub(r'^export interface .*?\n\}', '', content, flags=re.MULTILINE | re.DOTALL)
    content = re.sub(r'^interface .*?\n\}', '', content, flags=re.MULTILINE | re.DOTALL)

    # Remove function parameter types: (param: Type) -> (param)
    content = re.sub(r'\(([a-zA-Z_][a-zA-Z0-9_]*): [^)]+\)', r'(\1)', content)

    # Remove multiple parameter types
    content = re.sub(r', ([a-zA-Z_][a-zA-Z0-9_]*): [^,)]+', r', \1', content)

    # Remove const/let type annotations: const x: Type = -> const x =
    content = re.sub(r'const ([a-zA-Z_][a-zA-Z0-9_]*): [^=]+=', r'const \1 =', content)
    content = re.sub(r'let ([a-zA-Z_][a-zA-Z0-9_]*): [^=]+=', r'let \1 =', content)

    # Remove generic type parameters
    content = re.sub(r'useState<[^>]+>', 'useState', content)
    content = re.sub(r'useMemo<[^>]+>', 'useMemo', content)
    content = re.sub(r'useEffect<[^>]+>', 'useEffect', content)
    content = re.sub(r'Array<[^>]+>', 'Array', content)

    # Remove 'as Type' assertions
    content = re.sub(r' as [A-Z][a-zA-Z0-9_]*', '', content)
    content = re.sub(r' as any', '', content)

    # Remove return type annotations: ): Type => -> ) =>
    content = re.sub(r'\): [^=>{]+=>', ') =>', content)
    content = re.sub(r'\): [^{]+\{', ') {', content)

    # Remove empty lines (more than 2 consecutive)
    content = re.sub(r'\n\n\n+', '\n\n', content)

    return content

def convert_file(tsx_path):
    """Convert a .tsx or .ts file to .jsx or .js"""

    # Determine output path
    if tsx_path.endswith('.tsx'):
        jsx_path = tsx_path[:-4] + '.jsx'
    elif tsx_path.endswith('.ts'):
        jsx_path = tsx_path[:-3] + '.js'
    else:
        print(f"Skipping {tsx_path} - not a .tsx or .ts file")
        return

    print(f"Converting: {tsx_path} -> {jsx_path}")

    # Read TypeScript file
    with open(tsx_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove type annotations
    content = remove_type_annotations(content)

    # Write JavaScript file
    with open(jsx_path, 'w', encoding='utf-8') as f:
        f.write(content)

    # Remove original TypeScript file
    os.remove(tsx_path)
    print(f"Removed: {tsx_path}")

def main():
    src_dir = '/workspaces/default/code/src'

    # Find all .tsx and .ts files
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                file_path = os.path.join(root, file)
                try:
                    convert_file(file_path)
                except Exception as e:
                    print(f"Error converting {file_path}: {e}")

    print("\n✅ Frontend conversion complete!")

if __name__ == '__main__':
    main()
