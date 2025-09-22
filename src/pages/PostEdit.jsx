import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { updatePost } from '../features/postsSlice'
import api from '../utils/api'

const PostEdit = () => {
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categories: '',
    coverImage: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/posts/${id}`)
        const post = response.data
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || '',
          categories: post.categories?.join(', ') || '',
          coverImage: post.coverImage || ''
        })
      } catch (error) {
        toast.error('Failed to load post')
        navigate('/')
      }
    }

    fetchPost()
  }, [id, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const postData = {
        ...formData,
        categories: formData.categories.split(',').map(cat => cat.trim()).filter(Boolean)
      }
      
      const response = await api.put(`/api/posts/${id}`, postData)
      dispatch(updatePost(response.data))
      toast.success('Post updated successfully!')
      navigate(`/post/${id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Excerpt
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            rows="3"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Categories (comma separated)
          </label>
          <input
            type="text"
            value={formData.categories}
            onChange={(e) => setFormData({...formData, categories: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            value={formData.coverImage}
            onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <ReactQuill
            value={formData.content}
            onChange={(content) => setFormData({...formData, content})}
            className="bg-white"
            style={{ height: '300px', marginBottom: '50px' }}
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Post'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(`/post/${id}`)}
            className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostEdit