<div align="center">

# 🤝 Contributing to Fusion Network Forum

### *Thank you for your interest in contributing!*

</div>

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

<div align="center">

## 📜 Code of Conduct

</div>

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

<div align="center">

## 🎯 How Can I Contribute?

</div>

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser, etc.)
- **Error messages** or console logs

**Template:**
```markdown
## Bug Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., Windows 11]
- Node: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]

## Screenshots
If applicable, add screenshots.

## Additional Context
Any other context about the problem.
```

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement needed?
- **Proposed solution** - how should it work?
- **Alternatives considered**
- **Additional context** or mockups

### 🔧 Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Simple issues for beginners
- `help wanted` - Issues that need assistance
- `documentation` - Documentation improvements

### 📝 Pull Requests

We actively welcome your pull requests! See the [Pull Request Process](#pull-request-process) section below.

---

<div align="center">

## 🛠️ Development Setup

</div>

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/fusion-media-forums.git
cd fusion-media-forums
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/phoenixdev100/fusion-media-forums.git
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 5. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 6. Set Up Environment Variables

Create `.env` files in both `backend` and `frontend` directories. See the main [README.md](README.md) for configuration details.

### 7. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

<div align="center">

## 🔄 Pull Request Process

</div>

### Before Submitting

1. ✅ **Update your fork** with the latest upstream changes
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. ✅ **Test your changes** thoroughly
   - Run the application locally
   - Test all affected features
   - Check for console errors
   - Verify responsive design

3. ✅ **Follow coding standards** (see below)

4. ✅ **Update documentation** if needed

5. ✅ **Commit your changes** with clear messages

### Submitting the Pull Request

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create the PR** on GitHub
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tested locally
   - [ ] All features work as expected
   - [ ] No console errors
   - [ ] Responsive design verified

   ## Screenshots (if applicable)
   Add screenshots here

   ## Checklist
   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No new warnings generated
   ```

4. **Wait for review**
   - Maintainers will review your PR
   - Address any requested changes
   - Once approved, your PR will be merged!

---

<div align="center">

## 📐 Coding Standards

</div>

### JavaScript/React Standards

#### General Rules
- Use **ES6+** syntax
- Use **const** and **let**, avoid **var**
- Use **arrow functions** for callbacks
- Use **async/await** over promises when possible
- Keep functions **small and focused**
- Use **meaningful variable names**

#### React Specific
```javascript
// ✅ Good
const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  return (
    <div className="user-profile">
      {/* Component content */}
    </div>
  );
};

// ❌ Avoid
function UserProfile(props) {
  var editing = false;
  // ...
}
```

#### File Naming
- **Components**: `PascalCase.js` (e.g., `UserProfile.js`)
- **Utilities**: `camelCase.js` (e.g., `apiHelper.js`)
- **Pages**: `lowercase.js` or `kebab-case.js`

### Backend Standards

#### Express Routes
```javascript
// ✅ Good
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Logic here
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

#### Error Handling
- Always use try-catch blocks
- Return consistent error responses
- Log errors appropriately

### CSS/Styling Standards

#### Tailwind CSS
- Use Tailwind utility classes
- Group related classes together
- Use custom classes for repeated patterns
- Follow mobile-first approach

```jsx
// ✅ Good
<div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow">
  {/* Content */}
</div>
```

---

<div align="center">

## 💬 Commit Message Guidelines

</div>

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(auth): add password reset functionality

- Implement password reset email
- Add reset token generation
- Create reset password page

Closes #123
```

```bash
fix(forum): resolve thread pagination issue

Fixed bug where pagination was not working correctly
on the forum threads page.

Fixes #456
```

---

<div align="center">

## 🧪 Testing Guidelines

</div>

### Manual Testing Checklist

Before submitting a PR, test:

#### Frontend
- [ ] All pages load without errors
- [ ] Forms validate correctly
- [ ] Navigation works properly
- [ ] Responsive design on mobile, tablet, desktop
- [ ] Images load correctly
- [ ] No console errors or warnings

#### Backend
- [ ] API endpoints return correct responses
- [ ] Authentication works properly
- [ ] Database operations succeed
- [ ] Error handling works as expected
- [ ] File uploads work correctly

#### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

<div align="center">

## 📚 Documentation

</div>

### When to Update Documentation

Update documentation when you:

- Add new features
- Change existing functionality
- Add new API endpoints
- Modify configuration options
- Change environment variables

### Documentation Files to Update

- **README.md** - Main project documentation
- **API.md** - API endpoint documentation
- **DEPLOYMENT.md** - Deployment instructions
- **Code comments** - Complex logic explanation

---

<div align="center">

## 🎨 Style Guide

</div>

### Code Formatting

We use consistent formatting across the project:

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JavaScript, double for JSX attributes
- **Semicolons**: Use them
- **Line length**: Max 100 characters (flexible)

### Component Structure

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Component
const MyComponent = ({ prop1, prop2 }) => {
  // 3. State
  const [data, setData] = useState(null);
  
  // 4. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 5. Handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 7. Export
export default MyComponent;
```

---

<div align="center">

## ❓ Questions?

</div>

If you have questions about contributing:

- 📖 Check existing documentation
- 💬 Open a [GitHub Discussion](https://github.com/phoenixdev100/fusion-media-forums/discussions)
- 🐛 Create an issue for bugs
- 📧 Contact the maintainers

---

<div align="center">

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

**Happy Coding! 🚀**

</div>
