#!/bin/bash

folderOrFilePath=$1
addType=$2

if [ "$addType" = "directory" ]; then
  rm -r "$folderOrFilePath"
elif [ "$addType" = "file" ]; then
  rm "$folderOrFilePath"
else
  echo "file type is not recognized"
fi