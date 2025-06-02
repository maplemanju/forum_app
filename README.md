# Forum App

A lightweight full-stack forum application built with Next.js, TypeScript, and Prisma. Users can create posts, reply to threads, and explore discussions in a clean, modern UI.

## Features

- **User Authentication**: Secure user login and registration powered by NextAuth.js (Google Provider).
- **Post Management**: Users can create, edit, and delete their own posts.
- **Commenting System**: Robust commenting functionality with replies and nested comments.
- **Categories & Tags**: Organize discussions with categories and tags for easy navigation.
- **Search Functionality**: Search for posts by keywords and tags.
- **Infinite Scrolling**: Seamless loading of more posts and comments as the user scrolls.
- **Voting System**: Users can upvote/downvote posts and comments.
- **Modern UI**: Clean and responsive user interface built with Tailwind CSS.
- **Real-time Updates**: (Implicit from some features like voting, but generally good to mention if applicable)
- **MDX Editor**: Rich text editing for post and comment content.

## Technologies Used

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS, SCSS
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js (Google Provider)
- **Database ORM**: Prisma
- **Text Editor**: MDXEditor
- **Data Fetching**: React Server Components, Server Actions, `useSWR` for client-side data
- **Utility Libraries**: Day.js, Lodash, DOMPurify, MinIO (for object storage, inferred from dependencies)
- **Linting**: ESLint
- **Formatting**: Prettier

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- Yarn (or npm/pnpm/bun if preferred, but `yarn` is used in `package.json`)
- PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/maplemanju/forum_app.git
cd forum_app
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Environment Variables

Create an `.env.dev` file in the `env/` directory. You will need to populate this file with your database connection string, NextAuth.js secrets, and Google OAuth credentials.

Example `.env.dev`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/forum_app?schema=public"
NEXTAUTH_SECRET="your_nextauth_secret_here"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXT_PUBLIC_POST_LIST_PER_PAGE=5
NEXT_PUBLIC_COMMENT_LIST_PER_PAGE=10
NEXT_PUBLIC_SIDEBAR_NEW_POST_COUNT=5
# Add MinIO environment variables if you are using it for file uploads
# S3_ENDPOINT=localhost
# S3_PORT=9000
# S3_ACCESS_KEY=minioadmin
# S3_SECRET_KEY=minioadmin
# S3_BUCKET_NAME=forum-images
```

### 4. Database Setup

Run Prisma migrations and seed the database (optional, for initial data):

```bash
yarn prisma:migrate
yarn prisma:seed # Only if you want to populate with sample data
```

### 5. Run the Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
forum_app/
├── .vscode/               # VS Code settings
├── database/              # Prisma schema and seed data
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router pages and API routes
│   │   ├── api/           # API routes (e.g., auth)
│   │   ├── (main)/        # Main application routes
│   │   └── ...
│   ├── components/        # Reusable React components (atoms, molecules, organisms, templates)
│   ├── hooks/             # Custom React hooks
│   ├── process/           # Server actions and repository logic (Prisma queries)
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions (e.g., Prisma client, error handling, etc.)
├── env/
│   └── .env.dev           # Environment variables (local development)
├── .gitignore             # Git ignore file
├── .prettierrc            # Prettier configuration
├── README.md              # Project README
├── docker-compose.yml     # Docker Compose configuration (if used for local DB)
├── eslint.config.mjs      # ESLint configuration (Flat Config)
├── next.config.ts         # Next.js configuration
├── package.json           # Project dependencies and scripts
├── postcss.config.mjs     # PostCSS configuration for Tailwind CSS
├── tsconfig.json          # TypeScript configuration
└── yarn.lock              # Yarn lock file
```
