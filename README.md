# VFTC - Video Flip To Cash 🤑

A simple and rewarding online platform where users earn money by completing tasks and answering questions created by the admin.

## 🚀 Features Implemented

### ✅ Core Foundation
- **Next.js 14** with TypeScript and App Router
- **Tailwind CSS** for responsive styling
- **Prisma ORM** with PostgreSQL database schema
- **NextAuth.js** authentication system
- **Protected routes** and middleware

### ✅ User Authentication
- **Sign Up/Sign In** pages with form validation
- **Session management** with JWT tokens
- **Role-based access** (USER/ADMIN)
- **Email/password** authentication

### ✅ User Dashboard
- **Personal stats** display (balance, earnings, tasks)
- **Responsive navigation** with sidebar menu
- **User menu** with quick actions
- **Membership tier** display

### ✅ Database Schema
- **User management** with roles and membership tiers
- **Task system** with types and status tracking
- **User task submissions** and review workflow
- **Transaction system** for wallet management
- **File attachments** for task resources

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin panel (coming soon)
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── layouts/          # Layout components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
└── styles/               # Additional styles
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VFTC
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your database connection and other secrets:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/vftc_db
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Next Steps (Coming Soon)

### Phase 2: Task System
- [ ] Task creation interface (admin)
- [ ] Task browsing and filtering (users)
- [ ] Task submission system
- [ ] File upload/download for attachments
- [ ] Admin review and approval workflow

### Phase 3: Financial System
- [ ] Stripe payment integration
- [ ] Deposit and withdrawal system
- [ ] Transaction history
- [ ] Wallet management
- [ ] Membership tier benefits

### Phase 4: Advanced Features
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile optimization
- [ ] Performance optimization
- [ ] Security enhancements

## 📊 Database Schema

The application uses the following main entities:

- **Users**: Account management with roles and membership tiers
- **Tasks**: Task definitions with types, rewards, and requirements
- **UserTasks**: Task submissions and their review status
- **Transactions**: Financial transactions and wallet operations
- **TaskAttachments**: File attachments for tasks

## 🔐 Security Features

- **Password hashing** with bcryptjs
- **JWT tokens** for session management
- **Protected API routes** with role-based access
- **Input validation** with Zod schemas
- **CSRF protection** via NextAuth.js

## 🎨 UI/UX

- **Responsive design** for all screen sizes
- **Modern Tailwind CSS** styling
- **Accessibility** considerations
- **Dark mode** support (planned)
- **Mobile-first** approach

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS