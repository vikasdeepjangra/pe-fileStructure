#!/bin/bash

# Check if a filename and a directory were provided as arguments
if [ $# -ne 2 ]; then
  echo "Error: invalid number of arguments."
  echo "Usage: scriptname filename.tar target_directory"
  exit 1
fi

# Store the paths to the zip file and destination directory
zipPath="$1"
destPath="$2"

# Convert the Windows-style path to a Linux-style path
zipPath=$(cygpath --mixed --path "$zipPath" | sed 's@^C:@/c@; s@\\@/@g')
destPath=$(cygpath --mixed --path "$destPath" | sed 's@^C:@/c@; s@\\@/@g')

# Extract the contents of the zip file to the specified directory
tar -xvf "$zipPath" -C "$destPath"