#!/bin/bash

fileContent=$1
filePath=$2

if [ -d "${filePath}" ] ; then
    echo "$filePath is a directory. Can't make edits."
elif [ -f "$filePath" ]; then
    echo "$fileContent" > "$filePath"
    echo "$filePath edits done."
elif [ -d "$filePath" ]; then
    echo "$filePath is a directory."
else
    echo "$filePath does not exist."
fi