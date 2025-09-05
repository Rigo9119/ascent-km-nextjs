# 🏔️ Ascent KM - Community Event Platform

A modern, full-stack community event management platform built with Next.js 15, Supabase, and TypeScript. Connect with local communities, discover events, engage in discussions, and explore locations around you.

## ✨ Features

### 🎯 **Core Features**
- **Community Management** - Create, join, and manage local communities
- **Event Discovery & Management** - Browse, create, and join community events
- **Discussion Forums** - Engage in community discussions with threaded comments
- **Location Services** - Interactive maps and location-based event discovery
- **User Profiles** - Comprehensive user profiles with preferences and activity
- **Blog System** - Community blog posts and resource sharing

### 🔐 **Authentication & Security**
- Google & Kakao OAuth integration
- Email/password authentication
- Protected routes and API endpoints
- User onboarding flow
- Secure session management

### 🎨 **Modern UI/UX**
- Responsive design with Tailwind CSS v4
- Dark/light mode support
- Interactive maps with Leaflet
- Real-time toast notifications
- Mobile-first responsive design
- Comprehensive form validation

### 🚀 **Technical Features**
- Server-side rendering (SSR) and static generation
- API routes with full CRUD operations
- Real-time data with Supabase
- Image optimization and handling
- Search functionality across all content
- Email notifications system

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Modern CSS framework
- **Shadcn/ui** - High-quality UI components
- **React Hook Form** - Form management
- **Leaflet** - Interactive maps
- **Lucide React** - Icon library

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Supabase Auth** - Authentication system
- **Supabase Storage** - File storage
- **API Routes** - Full REST API

### **Development Tools**
- **Bun** - Fast package manager and runtime
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vercel** - Deployment platform

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ or **Bun**
- **Supabase** account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ascent-km-nextjs.git
   cd ascent-km-nextjs
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the provided SQL schema (see [Database Setup](#database-setup))
   - Enable authentication providers (Google, Kakao)

5. **Start the development server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

You can choose between **Cloud** (production) or **Local Development** setups:

### Option 1: Local Development with Supabase CLI

**Prerequisites:**
- Install [Supabase CLI](https://supabase.com/docs/guides/cli)
- Docker installed and running

**Setup Steps:**

1. **Initialize and start local Supabase**
   ```bash
   # Start local Supabase services
   supabase start
   ```

2. **Get local credentials**
   After `supabase start`, you'll see output like:
   ```
   API URL: http://127.0.0.1:54321
   Anon key: eyJhbGci...
   Service Role key: eyJhbGci...
   Studio URL: http://127.0.0.1:54323
   ```

3. **Update your `.env.local` for local development**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key_from_above
   ```

4. **Pull existing schema from cloud (if you have one)**
   ```bash
   # Connect to your cloud project first
   supabase login
   supabase link --project-ref your-project-ref
   
   # Pull the schema
   supabase db pull
   
   # Reset local DB with cloud schema
   supabase db reset
   ```

**Local Development Commands:**
```bash
# Start services
supabase start

# View Supabase Studio locally
open http://127.0.0.1:54323

# Reset local database (applies migrations + seeds)
supabase db reset

# Push local changes to cloud
supabase db push

# Stop services
supabase stop
```

### Option 2: Cloud Setup (Production)

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your credentials** from Project Settings > API
3. **Use cloud credentials in `.env.local`**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_cloud_anon_key
   ```

### Required Database Tables

The application uses these main tables:

- `profiles` - User profiles and settings
- `communities` - Community information  
- `community_members` - Community memberships
- `community_types` - Community categories
- `discussions` - Discussion threads with voting
- `comments` - Discussion comments with threading
- `votes` - Voting system for discussions/comments
- `locations` - Location data for events
- `categories` - Event and community categories
- `events` - Event details and management

### Authentication Setup
1. **Enable authentication providers** in Supabase Dashboard
2. **Configure OAuth apps** for Google and Kakao (optional)
3. **Set up email templates** for authentication flows
4. **Configure RLS policies** for data security

### Migration Management
```bash
# Create a new migration
supabase migration new add_some_feature

# Apply migrations locally
supabase db reset

# Push to production
supabase db push
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   │   ├── communities/   # Community CRUD
│   │   ├── events/        # Event management
│   │   ├── discussions/   # Discussion system
│   │   └── settings/      # User settings
│   ├── auth/              # Authentication pages
│   ├── communities/       # Community pages
│   ├── events/            # Event pages
│   ├── profile/           # User profile
│   └── settings/          # User settings
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── app-sidebar/      # Navigation
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── supabase/         # Supabase client setup
│   └── utils.ts          # Helper functions
├── services/             # API service layers
├── types/                # TypeScript type definitions
└── middleware.ts         # Next.js middleware
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON=your_supabase_anon_key

# Optional: Analytics and Monitoring
NEXT_PUBLIC_VERCEL_URL=your_vercel_url
```

## 🎯 Key Features Walkthrough

### 🏘️ **Communities**
- Browse and join local communities
- Create new communities with custom settings
- Community-specific discussions and events
- Member management and permissions

### 📅 **Events**
- Discover events by location and category
- Create and manage your own events
- RSVP system with capacity management
- Event sharing and notifications

### 💬 **Discussions**
- Community discussion forums
- Threaded comment system
- Real-time updates and notifications
- Rich text formatting and emoji support

### 🗺️ **Locations**
- Interactive maps with event markers
- Location-based event discovery
- GPS integration for nearby events
- Venue information and directions

### 👤 **User Profiles**
- Comprehensive profile management
- Activity history and preferences
- Privacy controls and settings
- Profile customization

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will handle the build process

### Manual Deployment

1. **Build the application**
   ```bash
   bun run build
   ```

2. **Start production server**
   ```bash
   bun start
   ```

### Environment Variables for Production
- Set all required environment variables in your hosting platform
- Ensure Supabase URLs are configured for production
- Configure authentication redirects for your domain

## 🧪 Development

### Available Scripts

```bash
# Development server with Turbopack
bun dev

# Production build
bun run build

# Start production server
bun start

# Lint code
bun run lint
```

### Code Quality
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** for code formatting
- **Component-driven development** with reusable components

## 📚 API Documentation

### Main API Routes

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/communities` | GET, POST | Community management |
| `/api/events` | GET, POST | Event operations |
| `/api/discussions` | GET, POST | Discussion threads |
| `/api/discussions/[id]/comments` | GET, POST | Comment system |
| `/api/locations` | GET | Location data |
| `/api/search` | GET | Global search |

### Authentication
- All API routes require authentication via Supabase
- Protected routes automatically redirect to login
- JWT tokens handled automatically by Supabase

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Ensure components are responsive
- Test authentication flows
- Document API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js team** for the amazing framework
- **Supabase team** for the excellent BaaS platform
- **Vercel** for seamless deployment
- **Tailwind CSS** for the utility-first CSS framework
- **Shadcn** for the beautiful component library

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the [documentation](https://nextjs.org/docs)
- Review [Supabase docs](https://supabase.com/docs)

---

**Built with ❤️ using Next.js 15 and Supabase**