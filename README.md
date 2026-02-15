# AI Website Builder

An advanced AI-powered website builder built with React, TypeScript, and modern web technologies. Create beautiful, functional websites through natural language conversation with AI.

## 🚀 Features

- **AI-Powered Code Generation**: Use OpenAI GPT-4 or Anthropic Claude to generate HTML, CSS, and JavaScript
- **Real-time Code Editor**: Monaco Editor (VS Code editor) with syntax highlighting
- **Live Preview**: Instant preview with responsive device size toggles (Desktop, Tablet, Mobile)
- **Project Management**: Create, save, and manage multiple projects
- **Authentication**: Secure authentication with Supabase (Email/Password, Google, GitHub OAuth)
- **Auto-save**: Automatic project saving as you work
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Chat Interface**: Intuitive AI chat to modify and improve your code

## 🛠️ Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI GPT-4 & Anthropic Claude APIs
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account and project
- OpenAI API key (for GPT-4 access)
- Anthropic API key (for Claude access)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sjdksdjkdsk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and copy the contents from `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Then fill in your API keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

4. **Set up Supabase**

   In your Supabase project, create a `projects` table with the following schema:

   ```sql
   create table projects (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references auth.users not null,
     name text not null,
     html text not null default '',
     css text not null default '',
     js text not null default '',
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Enable Row Level Security
   alter table projects enable row level security;

   -- Create policies
   create policy "Users can view their own projects"
     on projects for select
     using (auth.uid() = user_id);

   create policy "Users can insert their own projects"
     on projects for insert
     with check (auth.uid() = user_id);

   create policy "Users can update their own projects"
     on projects for update
     using (auth.uid() = user_id);

   create policy "Users can delete their own projects"
     on projects for delete
     using (auth.uid() = user_id);
   ```

5. **Configure OAuth providers (Optional)**
   
   In your Supabase dashboard, go to Authentication > Providers and enable:
   - Google
   - GitHub
   
   Follow Supabase's documentation to set up OAuth credentials.

## 🚀 Running the Application

**Development mode**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Build for production**
```bash
npm run build
```

**Preview production build**
```bash
npm run preview
```

## 📖 Usage

1. **Sign Up / Login**
   - Create an account using email/password or OAuth providers
   - Sign in to access your dashboard

2. **Create a Project**
   - Click "New Project" on the dashboard
   - Give your project a name
   - You'll be redirected to the workspace

3. **Build with AI**
   - In the workspace, use the AI chat on the left to describe what you want
   - Examples:
     - "Create a modern landing page with a hero section"
     - "Add a contact form with validation"
     - "Make the navigation responsive"
   - AI will generate code that's automatically inserted into the editor

4. **Edit Code**
   - Switch between HTML, CSS, and JavaScript tabs
   - Edit code directly in the Monaco editor
   - See changes in real-time in the preview panel

5. **Preview**
   - View your website in the right panel
   - Toggle between Desktop, Tablet, and Mobile views
   - Open in a new tab for full-screen preview

6. **Save & Manage**
   - Projects auto-save as you work
   - Return to dashboard to view all projects
   - Delete projects you no longer need

## 🎨 Project Structure

```
src/
├── components/
│   ├── landing/       # Landing page components
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard components
│   ├── workspace/     # Editor workspace components
│   └── common/        # Reusable UI components
├── pages/             # Page components
├── services/          # API services (Supabase, OpenAI, Anthropic)
├── hooks/             # Custom React hooks
├── context/           # React Context providers
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── App.tsx            # Main app component with routing
├── main.tsx           # Application entry point
└── index.css          # Global styles (Tailwind)
```

## 🔐 Security Notes

- Never commit your `.env` file
- Keep your API keys secure
- Use Row Level Security in Supabase for data protection
- Regularly rotate API keys

## 🐛 Troubleshooting

**Issue: Authentication not working**
- Verify Supabase URL and anon key are correct
- Check that OAuth providers are properly configured in Supabase

**Issue: AI not generating code**
- Ensure API keys are valid and have credits
- Check browser console for error messages
- Verify API keys are properly prefixed with `VITE_`

**Issue: Preview not updating**
- Check for JavaScript errors in the code
- Try the refresh button in the preview panel

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and AI
