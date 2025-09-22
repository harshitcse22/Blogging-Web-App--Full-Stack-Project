import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { removePost } from '../features/postsSlice'
import api from '../utils/api'

const DeleteButton = ({ postId }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    setIsDeleting(true)
    try {
      await api.delete(`/api/posts/${postId}`)
      dispatch(removePost(postId))
      toast.success('Post deleted successfully!')
      navigate('/')
    } catch (error) {
      toast.error('Failed to delete post')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 ml-2"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}

export default DeleteButton