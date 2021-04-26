#!/bin/sh

files=$(find src/handlers -name '*.ts')
for i in $files; do
  handler=$(basename $i ".ts")
  mkdirp dist/handlers/$handler
  cp Makefile.function dist/handlers/$handler/Makefile
  mv dist/handlers/$handler.js dist/handlers/$handler/$handler.js
  chmod -R ugo+rwx dist/handlers/$handler/
done
