# Web Section Isolator

Extract reusable HTML sections from exported websites with only the CSS they actually need.

Built for frontend developers, designers, Webflow exports, Framer exports, landing page cleanup workflows, and reusable section extraction.

## Features

### Web Section Isolator

- Upload exported HTML files.
- Upload CSS files.
- Detect sections automatically.
- Extract a selected section.
- Filter related CSS.
- Generate clean standalone output.
- Preview extracted output in responsive viewports.
- Copy formatted output.
- Download isolated HTML files.

### CSS Class Extractor

- Paste class names manually.
- Extract class names from HTML snippets.
- Paste full CSS files.
- Extract only matching CSS rules.
- Supports grouped selectors, `@media`, and `@supports` blocks.
- Outputs clean isolated CSS.

### Design System

- Custom design token system.
- Shared typography, spacing, radius, colors, and motion.
- Responsive dashboard-style UI.
- Dark theme interface.
- Sidebar navigation.
- Mobile drawer support.

## Tech Stack

- React
- TypeScript
- Next.js
- CSS variables
- Lucide Icons
- Vercel deployment

## Use Cases

- Webflow export cleanup
- Framer export cleanup
- Landing page extraction
- Standalone section exports
- Component isolation
- CSS cleanup workflows
- Design token reference systems

## Project Structure

```txt
app/
components/
components/layout/
components/pages/
components/extractor/
components/ui/
hooks/
lib/
```

## Development

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Run type checking:

```bash
pnpm typecheck
```

Run the project check used by CI/lint workflows:

```bash
pnpm lint
```

Build the production app:

```bash
pnpm build
```

## Deployment

This project is optimized for:

- Vercel
- GitHub
- Custom domains

## Roadmap

- Multiple CSS file support
- ZIP export
- Smarter CSS dependency tracing
- Save extraction history
- Export presets
- Tailwind conversion helpers
- Design token editor
- AI-assisted extraction workflows

## Author

Built by Ye Min Thu / NiiCk Studio.

- Website: <https://www.ymthu.com>
- GitHub: <https://github.com/ymt-nk40>

## License

MIT License
