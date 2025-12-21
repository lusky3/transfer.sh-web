# transfer.sh-web

Modern web frontend for [transfer.sh](https://github.com/dutchcoders/transfer.sh/) - easy file sharing from the command line.

## Features

- Drag-and-drop file upload with progress indicators
- Dark / Light / System theme support
- File previews (images, video, audio, code with syntax highlighting, markdown)
- Mobile responsive design
- CLI usage examples

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4

## Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing with Docker

A `compose.yml` is included for testing with the transfer.sh backend:

```bash
npm run build
docker compose up
```

Then open [http://localhost:8080]

## Production Deployment

### Option 1: Docker with mounted dist

Build the frontend and mount it into the transfer.sh container:

```bash
npm run build
```

```yaml
# compose.yml
services:
  transfer:
    image: dutchcoders/transfer.sh:latest
    ports:
      - "8080:8080"
    volumes:
      - ./dist:/webapp:ro
      - /path/to/uploads:/uploads
    command:
      - --provider=local
      - --basedir=/uploads
      - --web-path=/webapp
```

### Option 2: Embed in Go binary

Build the frontend and generate Go bindata:

```bash
npm run build
go generate .
```

This creates `bindata_gen.go` which embeds the dist files into the Go binary.

## Go Template Variables

The frontend uses Go template variables passed via `window.__CONFIG__`:

| Variable | Description |
|----------|-------------|
| `{{.WebAddress}}` | Base URL (e.g., `https://transfer.sh/`) |
| `{{.Hostname}}` | Server hostname |
| `{{.GAKey}}` | Google Analytics key (optional) |
| `{{.EmailContact}}` | Contact email (optional) |
| `{{.MaxUploadSize}}` | Upload size limit (optional) |
| `{{.PurgeTime}}` | File retention period (optional) |

## Build Output

The build outputs to `dist/` with this structure:

```text
dist/
├── index.html
├── download.html
├── download-{image,video,audio,code,markdown}.html
├── 404.html
├── robots.txt
├── scripts/          # JS bundles
└── styles/           # CSS bundles
```

Assets are placed in `scripts/` and `styles/` directories to match the paths served by the transfer.sh backend.

## License

MIT

## AI Usage Disclaimer

Portions of this codebase were generated with the assistance of Large Language Models (LLMs). All AI-generated code has been reviewed and tested to ensure quality and correctness.
