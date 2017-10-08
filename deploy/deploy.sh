#!/bin/bash
#Credit for build script to: http://lthr.io/deploy-to-gh-pages
echo "Starting deployment"
echo "Target: gh-pages branch"

DIST_DIRECTORY="dist/"
CURRENT_COMMIT=`git rev-parse HEAD`
ORIGIN_URL=`git config --get remote.origin.url`
SSH_REPO=${ORIGIN_URL/https:\/\/github.com\//git@github.com:}

cp .gitignore $DIST_DIRECTORY || exit 1

echo "Checking out gh-pages branch"
git checkout -B gh-pages || exit 1

echo "Removing old static content"
git rm -rf . || exit 1

echo "Copying dist content to root"
cp -r $DIST_DIRECTORY/* . || exit 1
cp $DIST_DIRECTORY/.gitignore . || exit 1

echo "Pushing new content to $ORIGIN_URL"
git config user.name "Travis CI" || exit 1
git config user.email "pat.heard@gmail.com" || exit 1

git add -A . || exit 1
git commit --allow-empty -m "Regenerated static content for $CURRENT_COMMIT" || exit 1
git push --force --quiet $SSH_REPO gh-pages

echo "Cleaning up temp files"
rm -Rf $DIST_DIRECTORY

echo "Deployed successfully."
exit 0