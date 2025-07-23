# SaifMarks

SaifMarks is a fullstack web application for managing bookmarks and short URLs. It provides a dashboard for users to create, edit, and delete bookmarks, generate short URLs, and manage their profile and settings.

## Features

- **User Authentication:** Sign up, sign in, password reset, and email verification.
- **Dashboard:** Manage bookmarks and short URLs with a modern UI.
- **Short URL Generation:** Create custom short URLs for any link.
- **Bookmark Management:** Add, edit, delete, and connect bookmarks to short URLs.
- **Profile Management:** Edit user data, change password, and delete account.
- **Settings:** Choose preferred short URL domain, toggle theme, and hide welcome message.
- **Responsive Design:** Works on desktop and mobile devices.
- **Dark/Light Theme:** Switch between dark and light modes.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, NestJS, TypeScript
- **Database:** (Specify your database, e.g. PostgreSQL, MongoDB)
- **API:** RESTful endpoints

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- (Database, e.g. PostgreSQL/MongoDB running)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/saifabdelrazek011/saifmarks.git
   cd saifmarks
   ```

2. **Install dependencies:**

   - Frontend:
     ```bash
     cd frontend
     npm install
     ```
   - Backend:
     ```bash
     cd ../backend
     npm install
     ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` in both `frontend` and `backend` folders and fill in your settings.

4. **Run the application:**

   - Backend:
     ```bash
     npm run start:dev
     ```
   - Frontend:
     ```bash
     npm run dev
     ```

5. **Access the app:**
   - Open [http://localhost:3000](http://localhost:3000) (or your configured port) in your browser.

## Folder Structure

```
saifmarks/
├── backend/         # NestJS backend API
├── frontend/        # React frontend app
├── README.md
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what
