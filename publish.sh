#!/usr/bin/env bash
git add .
git commit -m "publish changes"
git push origin master
git push origin master:gh-pages
