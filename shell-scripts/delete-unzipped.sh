#!/bin/bash

# Define the path to the parent directory of the directory to be deleted
parent_path=$1

# Define the name of the directory to be deleted
dir_name=$2

# Navigate to the parent directory
cd $parent_path

# Check if the directory exists before deleting it
if [ -d "$dir_name" ]; then
  rm -r "$dir_name"
  echo "$dir_name deleted successfully!"
else
  echo "$dir_name does not exist."
fi