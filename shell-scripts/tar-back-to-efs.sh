#!/bin/bash

folderPath="$1"
outputPath="$2"

echo $outputFile
echo $folderPath

tar -czvf "$outputPath" -C "$folderPath" .
