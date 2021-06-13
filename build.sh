#!/usr/bin/env bash

npm run build
rm -r ./docs
cp -r ./build/. ./docs/
