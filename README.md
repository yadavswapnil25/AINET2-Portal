# Admin Dashboard

A modern, responsive admin dashboard built with React, Tailwind CSS, and Vite.

## Features

### 🚀 Core Functionality
- **User Management**: Add, edit, delete, and manage users
- **Dashboard Analytics**: View user statistics and role distribution
- **Settings Management**: Profile, security, notifications, and system settings
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Authentication**: Secure login system with session management

### 📊 Dashboard Features
- **Statistics Cards**: Total users, active users, inactive users, and admin count
- **Role Distribution**: Visual representation of user roles
- **Recent Activity**: Latest user registrations and status updates
- **User Table**: Searchable and paginated user list
- **Quick Actions**: Add new users directly from dashboard

### 👥 User Management
- **User CRUD Operations**: Create, read, update, and delete users
- **Advanced Search**: Search by name, email, or department
- **Pagination**: Navigate through large user lists
- **Status Management**: Active/inactive user status
- **Role Assignment**: Admin, Manager, and User roles

### ⚙️ Settings
- **Profile Settings**: Personal information, avatar, bio, timezone, language
- **Security Settings**: Password change, 2FA, session timeout, login notifications
- **Notification Preferences**: Email, push, SMS, and system notifications
- **System Settings**: Theme, auto-save, file size limits, backup settings

### 🔐 Authentication
- **Secure Login**: Admin authentication system
- **Session Management**: Persistent login sessions
- **Remember Me**: Option to remember login credentials
- **Logout**: Secure logout with session cleanup

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ainetAdmin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials
- **Email**: `admin@example.com`
- **Password**: `admin123`

## Usage

### Login
1. Navigate to `/admin/login`
2. Enter demo credentials
3. Click "Sign in"

### Dashboard
- View user statistics and analytics
- Monitor recent user activity
- Quick access to user management

### User Management
1. Navigate to "User Management" from sidebar
2. Use search to find specific users
3. Click "Add User" to create new users
4. Use edit/delete buttons for existing users

### Settings
1. Navigate to "Settings" from sidebar
2. Choose from Profile, Security, Notifications, or System tabs
3. Modify settings as needed
4. Click "Save" to apply changes

## Project Structure

```
src/
├── Admin/
│   ├── AdminLogin.jsx      # Login component
│   ├── Dashboard.jsx       # Main dashboard
│   ├── Layout.jsx          # Layout wrapper
│   ├── Settings.jsx        # Settings management
│   ├── Sidebar.jsx         # Navigation sidebar
│   ├── Table.jsx           # User table component
│   ├── UserManagement.jsx  # User CRUD operations
│   └── UserModal.jsx       # User add/edit modal
├── App.jsx                 # Main app component
├── main.jsx                # App entry point
└── index.css               # Global styles
```

## Technologies Used

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm
- **Development**: ESLint, Prettier

## Customization

### Adding New Features
1. Create new components in the `src/Admin/` directory
2. Add routes in `App.jsx`
3. Update sidebar navigation in `Sidebar.jsx`

### Styling
- Modify Tailwind classes in components
- Update color scheme in `tailwind.config.js`
- Add custom CSS in `index.css`

### Authentication
- Replace demo authentication with your backend API
- Update login logic in `AdminLogin.jsx`
- Modify session management in `Layout.jsx`

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration for code quality
- Prettier for code formatting
- React hooks and functional components
- Modern ES6+ syntax

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy
The `dist` folder contains the production build that can be deployed to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Note**: This is a demo admin dashboard. For production use, implement proper security measures, backend integration, and user authentication.
