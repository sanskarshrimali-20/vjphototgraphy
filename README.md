# VJ Photography

A responsive portfolio site for a professional photographer, built with React and Vite.

## Project structure

```text
src/
  components/             Reusable visual pieces
    PortfolioCard.jsx
    SiteIntro.jsx
  data/                   Temporary content source
    portfolioData.js
  pages/                  Full page compositions
    HomePage.jsx
  App.jsx                 Site shell and global navigation
  App.css                 Portfolio layout and responsive styling
  index.css               Fonts, tokens, and global defaults
```

The temporary portfolio images and metadata live in `src/data/portfolioData.js`. Replace that module with an API service when the backend is ready; the `HomePage` filter only expects an array of items with `title`, `category`, `year`, `image`, and `size` fields.

## Local development

```bash
npm install
npm run dev
```

## Supabase gallery

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. Add the project URL and anon key to `.env.local`.
3. Run `supabase/schema.sql` in the Supabase SQL Editor.
4. In Supabase Authentication, create an email/password user for the person who will upload images.
5. Open `/admin`, sign in, choose a section, and publish an image.

Published images are loaded from `gallery_items` and automatically appear under their selected category. The existing demo images remain as a fallback until the first gallery record is published.

The homepage hero uses the portfolio data as an autoplaying, touch-swipable carousel. The enquiry form sends submissions through FormSubmit to `vijaysharmaphotography@gmail.com`.

## Checks

```bash
npm run lint
npm run build
```

## Hosting

This is a static Vite site and is ready to deploy on Vercel.

### Vercel dashboard

1. Push this project to a GitHub repository.
2. Open [vercel.com/new](https://vercel.com/new) and import the repository.
3. Keep the detected Vite settings, or use:
  - Build command: `npm run build`
  - Output directory: `dist`
4. Select **Deploy**. Vercel will provide a public URL that works from anywhere.

The repository includes `vercel.json` with these settings already configured. Every future push to the connected branch will automatically redeploy the site.

The enquiry form uses FormSubmit's AJAX endpoint. Confirm the activation email from FormSubmit after the first live submission, or replace the endpoint with a dedicated email service when one is available.
