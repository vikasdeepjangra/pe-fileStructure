#!/bin/bash

folderOrFilePath=$1
addType=$2

if [ "$addType" = "directory" ]; then
  rmdir -p "$folderOrFilePath"
elif [ "$addType" = "file" ]; then
  rm "$folderOrFilePath"
else
  echo "file type is not recognized"
fi