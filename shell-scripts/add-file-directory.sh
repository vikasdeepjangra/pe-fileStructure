#!/bin/bash

folderOrFilePath=$1
addType=$2

if [ "$addType" = "directory" ]; then
  mkdir -p "$folderOrFilePath"
elif [ "$addType" = "file" ]; then
  touch "$folderOrFilePath"
else
  echo "file type is not recognized"
fi