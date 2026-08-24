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
