#!/bin/bash

# Directory containing the .css files
source_dir="./node_modules/highlight.js/styles"

# Directory where the modified .css files will be saved
target_dir="./resources/css/themes"

# Function to check if the line contains specified selectors
contains_selectors() {
    local line=$1
    [[ $line =~ ^[[:space:]]*pre[[:space:]]+code\.hljs ]] || [[ $line =~ ^[[:space:]]*code\.hljs ]]
}

# Find and process .css files, excluding .min.css
for file in "$source_dir"/*.css; do
    if [[ ! $file =~ \.min\.css$ ]]; then
        # Extract filename without the path and extension
        filename=$(basename -- "$file" .css)
        
        # Prepare the full path for the output file
        output_file="$target_dir/$filename.css"

        # Start the wrapper with correct indentation
        echo ".syntax-entry-theme-$filename {" > "$output_file"
        
        # Initialize flag to skip lines
        skip_block=0

        # Process each line
        while IFS= read -r line || [ -n "$line" ]; do
            if contains_selectors "$line"; then
                skip_block=1
                continue
            fi

            if [[ $skip_block -eq 1 ]]; then
                if [[ $line =~ ^[[:space:]]*\} ]]; then
                    skip_block=0
                fi
                continue
            fi

            # Apply 4 space indentation to each line of original CSS
            echo "    $line"
        done < "$file" >> "$output_file"
        
        # Correctly close the wrapper with a brace
        echo "}" >> "$output_file"
    fi
done
