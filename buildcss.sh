#!/bin/sh
if [ $# -eq 0  ]
 then
    echo "building for dev"
    npx tailwindcss-cli@latest build -o public/build/tailwind.css
else
    echo "building for production"
    NODE_ENV=production npx tailwindcss-cli@latest build -o public/build/tailwind.css
fi