# YAM - Your Amazing Marketplace

A modern service marketplace platform built with Next.js, React, and Node.js.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy
- **Authentication**: Supabase
- **Maps**: Leaflet

## 📁 Project Structure

```
YAM/
├── app/                    # Next.js App Router
│   ├── components/         # Reusable React components
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── backend/                # FastAPI backend
├── public/                 # Static assets
├── utils/                  # Utility functions
└── package.json            # Node.js dependencies
```

## 🎨 Features

- **Service Marketplace**: Browse and book local services
- **Professional Profiles**: Detailed professional listings
- **Booking System**: Multi-step booking flow
- **Responsive Design**: Mobile-first approach
- **TaskRabbit-style UI**: Clean, modern interface

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## 📦 Dependencies

### Runtime Dependencies
- `next`: React framework
- `react`: UI library
- `react-dom`: React DOM rendering
- `@supabase/supabase-js`: Supabase client
- `leaflet`: Maps library

### Development Dependencies
- `typescript`: TypeScript compiler
- `tailwindcss`: CSS framework
- `eslint`: Code linting
- `@types/*`: TypeScript definitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.