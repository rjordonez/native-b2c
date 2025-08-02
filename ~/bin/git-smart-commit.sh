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

# Generate a simple commit message based on the changes
COMMIT_MSG=$(echo "$DIFF" | head -20 | grep -E "^(diff|index|new file|deleted|modified)" | head -3 | sed 's/^new file mode.*/Add new file/' | sed 's/^deleted file mode.*/Delete file/' | sed 's/^modified: /Update /' | tr '\n' ' ' | sed 's/ $//')

# If no meaningful message was generated, use a default
if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="Update files"
fi

echo "Generated Commit Message:"
echo "$COMMIT_MSG"

# Commit the changes
git commit -m "$COMMIT_MSG" 