#!/bin/bash

# Script to convert TypeScript React files to JavaScript

echo "Converting TypeScript to JavaScript..."

# Function to convert a single file
convert_file() {
    local src_file=$1
    local dest_file=${src_file%.tsx}.jsx
    dest_file=${dest_file%.ts}.js

    echo "Converting $src_file -> $dest_file"

    # Copy and remove type annotations
    cat "$src_file" | \
        # Remove type imports
        sed '/^import type /d' | \
        # Remove : Type annotations in parameters
        sed 's/(\([a-zA-Z_][a-zA-Z0-9_]*\): [^)]*)/(\1)/g' | \
        # Remove : Type annotations in variables
        sed 's/const \([a-zA-Z_][a-zA-Z0-9_]*\): [^=]*=/const \1 =/g' | \
        sed 's/let \([a-zA-Z_][a-zA-Z0-9_]*\): [^=]*=/let \1 =/g' | \
        # Remove generic type parameters from useState
        sed 's/useState<[^>]*>(/useState(/g' | \
        sed 's/useMemo<[^>]*>(/useMemo(/g' | \
        sed 's/useEffect<[^>]*>(/useEffect(/g' | \
        # Remove as Type assertions
        sed 's/ as [A-Za-z][A-Za-z0-9_]*//g' | \
        # Remove export type declarations
        sed '/^export type /d' | \
        # Remove interface declarations
        sed '/^interface /,/^}/d' | \
        # Remove type declarations
        sed '/^type /,/;$/d' | \
        # Update imports from .tsx to .jsx
        sed "s/from '\.\([^']*\)\.tsx'/from '.\1.jsx'/g" | \
        sed "s/from \"\.\([^\"]*\)\.tsx\"/from \".\1.jsx\"/g" | \
        sed "s/from '\.\([^']*\)\.ts'/from '.\1.js'/g" | \
        sed "s/from \"\.\([^\"]*\)\.ts\"/from \".\1.js\"/g" | \
        # Remove .tsx/.ts extensions from imports (Vite handles it)
        sed "s/from '\([^']*\)\.tsx'/from '\1'/g" | \
        sed "s/from \"\([^\"]*\)\.tsx\"/from \"\1\"/g" | \
        sed "s/from '\([^']*\)\.ts'/from '\1'/g" | \
        sed "s/from \"\([^\"]*\)\.ts\"/from \"\1\"/g" \
        > "$dest_file"
}

# Convert frontend files
cd /workspaces/default/code

for file in src/**/*.tsx src/**/*.ts; do
    if [ -f "$file" ]; then
        convert_file "$file"
    fi
done

# Convert services
if [ -f "src/services/api.ts" ]; then
    convert_file "src/services/api.ts"
fi

echo "Conversion complete!"
echo "Now removing old TypeScript files..."

# Remove old .tsx and .ts files
find src -name "*.tsx" -delete
find src -name "*.ts" -delete

echo "TypeScript files removed!"
echo "Frontend conversion complete!"
