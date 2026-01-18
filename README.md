# frame-gallery-builder

Frontend-only (no backend) Frameology-like gallery wall builder.

## Features

- Home page: choose 5'li or 6'lı template
- Upload photos into slots
- Crop/edit per slot (CropperJS): drag, zoom, rotate, locked 4:3
- Drag & drop reorder (dnd-kit)
- **Realistic wall mockup preview** with Frameology "Graceful Six" layout
- Frame color selector (Black, White, Walnut, Natural)
- Real frame + mat styling on all previews
- WhatsApp order button (`wa.me` with prefilled message)

## Install & Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Customize Wall Background

The wall mockup preview uses `src/assets/wall.png.png`. To replace it with your own wall photo:

1. Replace `src/assets/wall.png.png` with your wall image (JPG or PNG)
2. Update the import in `src/components/Preview.jsx` if you change the filename

The preview uses a 1:1 (square) aspect ratio container with the wall as a background-cover image.

## Deploy to GitHub Pages

This project is configured for GitHub Pages using `gh-pages` and `HashRouter`.

1) Create a GitHub repo named `frame-gallery-builder`.
2) Push this project to that repo.
3) Deploy:

```bash
npm run deploy
```

If your repo name is different, update the `base` in `vite.config.js`.
