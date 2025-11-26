# Custom Configuration

You can define custom environment profiles in `.vscode/attune.json`.

## Example Configuration

```json
{
  "profiles": [
    {
      "name": "Frontend Dev",
      "type": "node",
      "path": "./frontend",
      "version": "20.11.0",
      "startupCommand": "npm run dev"
    },
    {
      "name": "Backend API",
      "type": "python",
      "path": "./.venv",
      "startupCommand": "uvicorn main:app --reload"
    }
  ]
}
```

This allows you to set up complex environments with specific startup commands!
