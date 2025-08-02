#!/bin/bash

# Stage all changes
git add .

# Get the git diff
DIFF=$(git diff --cached)

# Check if there are any staged changes
if [ -z "$DIFF" ]; then
  echo "No changes to commit."
  exit 0
fi

# Generate a more meaningful commit message
COMMIT_MSG=""

# Check for new files
NEW_FILES=$(echo "$DIFF" | grep "^new file" | wc -l)
if [ "$NEW_FILES" -gt 0 ]; then
  COMMIT_MSG="Add $NEW_FILES new file(s)"
fi

# Check for deleted files
DELETED_FILES=$(echo "$DIFF" | grep "^deleted file" | wc -l)
if [ "$DELETED_FILES" -gt 0 ]; then
  if [ -n "$COMMIT_MSG" ]; then
    COMMIT_MSG="$COMMIT_MSG, remove $DELETED_FILES file(s)"
  else
    COMMIT_MSG="Remove $DELETED_FILES file(s)"
  fi
fi

# Check for modified files
MODIFIED_FILES=$(echo "$DIFF" | grep "^modified:" | wc -l)
if [ "$MODIFIED_FILES" -gt 0 ]; then
  if [ -n "$COMMIT_MSG" ]; then
    COMMIT_MSG="$COMMIT_MSG, update $MODIFIED_FILES file(s)"
  else
    COMMIT_MSG="Update $MODIFIED_FILES file(s)"
  fi
fi

# If no meaningful message was generated, use a default
if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="Update files"
fi

echo "Generated Commit Message:"
echo "$COMMIT_MSG"

# Commit the changes
git commit -m "$COMMIT_MSG" 