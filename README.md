# Rifaz Cafe - Admin Panel

Luxury café admin panel for daily food subscription billing, customer management, and invoice generation.

## Project Structure

```
rifaz-cafe/
├── index.html          # Main dashboard
├── login.html          # Admin login
├── css/styles.css      # Theme (Outfit + Playfair Display)
├── js/                 # Frontend modules
│   ├── app.js          # Main app & navigation
│   ├── auth.js         # Authentication (demo mode)
│   ├── database.js     # LocalStorage CRUD layer
│   ├── customers.js    # Customer management
│   ├── menu.js         # Menu items
│   ├── extras.js       # Daily extras
│   ├── advance.js      # Advance payments
│   ├── pending.js      # Pending invoices
│   ├── invoice.js      # Invoice generation
│   ├── security.js     # Security settings
│   └── search.js       # Global search
├── server/             # Backend (disconnected)
│   ├── index.js        # Express server
│   ├── schema.sql      # MySQL schema
│   ├── functions/      # Netlify functions
│   └── routes/         # API routes
├── netlify.toml        # Netlify deployment config
├── package.json        # Build config
└── .gitignore
```

## Demo Credentials

| Field    | Value            |
| -------- | ---------------- |
| Email    | admin@rifaz.cafe |
| Password | Admin@123        |

## Quick Start

1. Open `index.html` in your browser (or deploy to Netlify)
2. Login with the demo credentials above
3. All data persists in localStorage (no backend needed)

## Tech Stack

- **Frontend**: HTML, CSS (Outfit + Playfair Display fonts), Vanilla JS
- **Icons**: Lucide Icons (SVG)
- **Data**: LocalStorage-based CRUD (backend disconnected)
- **Backend**: Express.js + MySQL (ready for reconnection)
- **Deployment**: Netlify

## License

© 2026 Rifaz Cafe Services. All rights reserved.
