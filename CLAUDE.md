# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Type-check with astro check, then build static site
npm run preview  # Preview built site locally
```

## Architecture

This is a static marketing site built with **Astro 4** and **Tailwind CSS**. It generates a fully static site with no client-side JavaScript except for the mobile menu toggle.

### Project Structure

- `src/pages/` - Astro pages (file-based routing with trailing slashes)
- `src/layouts/BaseLayout.astro` - Main layout with SEO meta tags, schema.org markup, and navigation/footer
- `src/components/` - Navigation and Footer components
- `src/content/blog/` - Markdown blog posts using Astro content collections
- `src/content/config.ts` - Blog collection schema (title, description, date, image, tags, author)
- `src/styles/global.css` - Tailwind base/components/utilities with custom component classes

### Key Patterns

**Brand Colors** (defined in `tailwind.config.mjs`):
- `brand-navy`: #1A1A2E (primary dark)
- `brand-red`: #E94560 (accent/CTA)
- `brand-red-light`: #FFE7EC (backgrounds)

**CSS Component Classes** (in `global.css`):
- `.btn-primary`, `.btn-secondary`, `.btn-outline` - Button styles
- `.card` - Card container with hover effects
- `.section` - Standard page section padding
- `.container-custom` - Max-width container
- `.prose` - Blog content typography

**Page Types**:
- Pillar pages (e.g., `driving-school-software.astro`) - SEO landing pages
- Standard pages (about, contact, pricing)
- Blog index and dynamic `[slug].astro` for posts

## Deployment

Auto-deploys to `/var/www/mydriveschool.software/` via GitHub Actions on push to `main`. Requires `DEPLOY_KEY` and `SERVER_IP` secrets.
