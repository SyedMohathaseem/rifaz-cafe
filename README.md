# Rifaz Cafe Management

A premium café admin dashboard for daily food subscription billing and extra item invoicing.

## 📁 Project Structure

```
rifaz-cafe/
├── frontend/           # Client-side application
│   ├── index.html      # Main dashboard
│   ├── login.html      # Admin login page
│   ├── css/
│   │   └── styles.css  # Luxury café theme styles
│   └── js/
│       ├── app.js      # Main application logic
│       ├── auth.js     # Authentication module
│       ├── database.js # API layer (currently disconnected)
│       ├── customers.js
│       ├── menu.js
│       ├── extras.js
│       ├── advance.js
│       ├── pending.js
│       ├── invoice.js
│       ├── search.js
│       └── security.js
│
├── backend/            # Server-side application (not connected yet)
│   ├── index.js        # Express server entry
│   ├── package.json    # Server dependencies
│   ├── schema.sql      # Database schema
│   ├── .env            # Environment variables (not committed)
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── functions/      # Netlify serverless functions
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Frontend (Styling Preview)

Simply open `frontend/index.html` in a browser. The backend is currently disconnected — all API calls return empty data so you can test the UI.

### Backend (When Ready)

```bash
cd backend
npm install
# Configure .env with your database credentials
npm run dev
```

## 🎨 Theme

Luxury light brown café theme with warm latte, beige, and soft brown tones.

- **Font**: DM Sans
- **Primary**: #9C6644 (luxury brown)
- **Background**: #FDF8F3 (warm cream)

## 📝 License

This project is for commercial use by Rifaz Cafe Services.
