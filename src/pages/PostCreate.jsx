import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import '../styles/quill-custom.css'
import { TagIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { addPost } from '../features/postsSlice'
import api from '../utils/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import ImageUpload from '../components/ImageUpload'

const PostCreate = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const postData = {
        ...formData,
        categories: formData.categories.split(',').map(cat => cat.trim()).filter(Boolean)
      }
      
      const response = await api.post('/api/posts', postData)
      dispatch(addPost(response.data))
      toast.success('Post published successfully! 🎉')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const url = e.target.value
    setFormData({...formData, coverImage: url})
    setImagePreview(url)
  }

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
          <p className="text-gray-600">Share your thoughts with the world</p>
        </motion.div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Input
                label="Post Title"
                placeholder="Enter an engaging title for your post"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="text-lg font-medium"
                required
              />
            </motion.div>

            {/* Cover Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-700">
                Cover Image
              </label>
              <ImageUpload
                onImageUpload={(imageUrl) => setFormData({...formData, coverImage: imageUrl})}
                className="mt-1"
              />
              {formData.coverImage && (
                <p className="text-sm text-gray-500">
                  Image uploaded successfully!
                </p>
              )}
            </motion.div>

            {/* Excerpt */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
                  rows="3"
                  placeholder="Write a brief description of your post..."
                />
              </div>
            </motion.div>

            {/* Categories and Cover Image Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <Input
                  label="Categories"
                  placeholder="Technology, Programming, Web Development"
                  value={formData.categories}
                  onChange={(e) => setFormData({...formData, categories: e.target.value})}
                  className="pl-12"
                />
                <TagIcon className="absolute left-4 top-9 h-5 w-5 text-gray-400" />
              </motion.div>

            </div>

            {/* Content Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                <ReactQuill
                  value={formData.content}
                  onChange={(content) => setFormData({...formData, content})}
                  modules={quillModules}
                  className="bg-white [&_.ql-editor]:text-black"
                  style={{ minHeight: '400px' }}
                  placeholder="Start writing your amazing post..."
                />
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200"
            >
              <Button
                type="submit"
                loading={isLoading}
                size="lg"
                className="flex-1 sm:flex-none"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                {isLoading ? 'Publishing...' : 'Publish Post'}
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate('/')}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            </motion.div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default PostCreate