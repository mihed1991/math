# Math Tutor Landing Page

Responsive website for a private mathematics tutor, built with HTML, CSS, and JavaScript. The project was created with AI-assisted development using OpenAI Codex.

![Math Tutor Landing Page preview](public/og.png)

## Live Demo

[View the website on GitHub Pages](https://mihed1991.github.io/math/)

## Features

- Responsive landing page for desktop and mobile devices
- Custom mathematics-themed cursor with an animated formula trail
- Online and offline lesson formats
- Interactive pricing plan selection
- Booking form with tariff selection and confirmation state
- Horizontally scrollable student reviews with mobile navigation dots
- Expandable FAQ section
- Clickable phone numbers and links
- Client-side content management panel for editing, adding, removing, and reordering blocks
- Editable site name, header phone number, pricing badge, and admin password

## Technologies

- Semantic HTML5
- CSS3 with responsive layouts and animations
- Vanilla JavaScript
- Browser `localStorage` for client-side content settings
- GitHub Actions and GitHub Pages for deployment
- OpenAI Codex for AI-assisted development

## Project Structure

```text
.
├── index.html          # Landing page
├── admin.html          # Content management panel
├── css/                # Landing and admin styles
├── js/                 # Interactions, content storage, and admin logic
├── public/             # Optimized images, video, and social preview assets
└── .github/workflows/  # GitHub Pages deployment
```

## Run Locally

No build step is required for the landing page. Start any static file server in the project directory, for example:

```bash
python3 -m http.server 8099
```

Then open [http://localhost:8099](http://localhost:8099).

## Admin Panel

The content management panel is available at `/admin.html`. Its data and settings are stored locally in the current browser, so this panel is intended for client-side content management rather than server-side authentication or shared database storage.

## Deployment

Pushes to the `main` branch are deployed automatically to GitHub Pages through the included GitHub Actions workflow.
