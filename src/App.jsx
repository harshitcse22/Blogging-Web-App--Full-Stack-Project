import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import Footer from './components/ui/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PostCreate from './pages/PostCreate'
import PostView from './pages/PostView'
import PostEdit from './pages/PostEdit'
import UserPosts from './pages/UserPosts'
import AllPosts from './pages/AllPosts'
import About from './pages/About'

function App() {
  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isAuthPage && <Navbar />}
      <main className={`flex-1 ${isAuthPage ? '' : 'pt-16'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<PostCreate />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/posts/:id/edit" element={<PostEdit />} />
          <Route path="/my-posts" element={<UserPosts />} />
          <Route path="/posts" element={<AllPosts />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }
        }}
      />
    </div>
  )
}

export default App