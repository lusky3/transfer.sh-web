# transfer.sh-web

Web frontend for [transfer.sh](https://github.com/dutchcoders/transfer.sh/) - easy file sharing from the command line.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS
- go-bindata for Go integration

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Production Deployment

Build and generate Go bindata:

```bash
npm run build
go generate .
```

Then specify the `web-path` directory pointing to `dist`:

```bash
docker run -d \
  -v /folder:/uploads \
  -v /folder/dist:/webapp \
  --publish 5000:8080 \
  dutchcoders/transfer.sh:latest \
  --provider local \
  --basedir /uploads \
  --web-path /webapp/
```

## Features

- Drag-and-drop file upload
- Dark/Light/System theme support
- File previews (image, video, audio, code, markdown)
- CLI usage examples
- Mobile responsive

## Go Template Variables

The frontend uses Go template variables passed via `window.__CONFIG__`:

- `{{.WebAddress}}` - Base URL
- `{{.Hostname}}` - Server hostname
- `{{.GAKey}}` - Google Analytics key
- `{{.EmailContact}}` - Contact email
- `{{.MaxUploadSize}}` - Upload limit
- `{{.PurgeTime}}` - File retention period
