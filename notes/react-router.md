# React Router DOM Reference Guide

React Router DOM is the standard library for routing in React web applications. It enables navigation among various components, dynamically updates the URL, and keeps the UI in sync with the URL.

---

## 1. Installation

To install React Router DOM in your React project, run the following command in your terminal:

```bash
npm install react-router-dom
```

---

## 2. Setup (`main.jsx`)

To enable routing in your application, you must wrap your root component (`<App />`) with `<BrowserRouter>` from `react-router-dom`. This provides routing context to the rest of the application.

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

---

## 3. Defining Routes (`App.jsx`)

Use `<Routes>` and `<Route>` to map URL paths to specific page components.

```javascript
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      {/* Defines a route for the Home/Dashboard page */}
      <Route path="/" element={<Home />} />
      
      {/* Defines routes for Authentication pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

export default App
```

---

## 4. Key Core Components

### `<BrowserRouter>`
A parent router component that uses the HTML5 history API (`pushState`, `replaceState`, and the `popstate` event) to keep your UI in sync with the URL.

### `<Routes>`
Acts as a wrapper for multiple `<Route>` elements. It looks through all its child routes and finds the first match for the current location.

### `<Route>`
Declares a mapping between a URL path and a component.
- **`path`**: The URL pattern to match.
- **`element`**: The React component/element to render when the path matches.

### `<Link>`
Used to navigate between pages. It renders an `<a>` tag but prevents page refreshes, maintaining client-side state.

```javascript
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>
    </nav>
  )
}
```

### `<NavLink>`
A special type of `<Link>` that knows whether it is "active". It is perfect for styling active links in navigation menus.

```javascript
import { NavLink } from 'react-router-dom'

function Navigation() {
  return (
    <NavLink 
      to="/login" 
      className={({ isActive }) => isActive ? "text-blue-500 font-bold" : "text-gray-500"}
    >
      Login
    </NavLink>
  )
}
```

---

## 5. Useful Hooks

### `useNavigate`
Returns a function that lets you programmatically navigate to other pages (e.g., after a successful form submission or login).

```javascript
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Perform authentication logic here...
    
    // Redirect to home/dashboard page
    navigate('/');
  }

  return (
    <form onSubmit={handleLogin}>
      <button type="submit">Log In</button>
    </form>
  )
}
```

### `useParams`
Used to access dynamic parameters (e.g., `/profile/:username`) from the current URL route.

```javascript
// App.jsx definition
// <Route path="/profile/:username" element={<Profile />} />

import { useParams } from 'react-router-dom'

function Profile() {
  const { username } = useParams();

  return <div>Welcome to the profile of: {username}</div>;
}
```

### `useLocation`
Returns the current `location` object representing the URL path. Useful for reading query parameters or state passed during navigation.

```javascript
import { useLocation } from 'react-router-dom'

function Debugger() {
  const location = useLocation();
  console.log("Current path is:", location.pathname);
  return null;
}
```

---

## 6. Dynamic and Catch-All Routes

To handle routing for non-existent pages (404 errors), you can use a catch-all route with `path="*"`.

```javascript
import { Routes, Route } from 'react-router-dom'
import PageNotFound from './pages/PageNotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Catch-all route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}
```
