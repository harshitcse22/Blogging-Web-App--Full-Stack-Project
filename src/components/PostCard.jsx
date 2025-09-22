import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HeartIcon, ChatBubbleLeftIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'sonner';
import clsx from 'clsx';
import SocialShare from './SocialShare';

const PostCard = memo(({ post, showActions = true, className = '' }) => {
  const [likes, setLikes] = useState(post?.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user && post?.likes) {
      setIsLiked(post.likes.includes(user._id));
    }
  }, [user, post?.likes]);

  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetchComments();
    }
  }, [showComments]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    const token = localStorage.getItem('token');
    console.log('User:', user, 'Token exists:', !!token);

    try {
      console.log('Attempting to like post:', post._id);
      const response = await api.post(`/api/posts/${post._id}/like`);
      console.log('Like response:', response.data);
      setLikes(response.data.likesCount);
      setIsLiked(response.data.isLiked);
      toast.success(response.data.isLiked ? 'Post liked!' : 'Post unliked');
    } catch (error) {
      console.error('Error liking post:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      console.log('Adding comment to post:', post._id, 'Content:', newComment);
      const response = await api.post(`/api/posts/${post._id}/comments`, { content: newComment });
      console.log('Comment response:', response.data);
      toast.success('Comment added successfully');
      setComments(prev => [response.data, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/posts/${post._id}/comments`);
      setComments(response.data.comments || response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  if (!post) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Cover Image */}
      <Link 
        to={`/posts/${post._id}`} 
        className="block relative aspect-video overflow-hidden"
        onClick={() => console.log('Image clicked, navigating to post:', post._id)}
      >
        <motion.img
          initial={false}
          animate={{
            opacity: isImageLoaded ? 1 : 0,
            scale: isImageLoaded ? 1 : 1.1,
          }}
          transition={{ duration: 0.3 }}
          src={post.coverImage || 'https://via.placeholder.com/800x400'}
          alt={post.title}
          onLoad={() => setIsImageLoaded(true)}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
      </Link>

      {/* Content */}
      <div className="p-6 flex-grow">
        {/* Title */}
        <Link 
          to={`/posts/${post._id}`}
          onClick={() => console.log('Navigating to post:', post._id)}
        >
          <h2 className="card-title text-xl mb-2 text-gray-900 hover:text-purple-600 transition-colors cursor-pointer">
            {post.title}
          </h2>
        </Link>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.categories?.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Excerpt */}
        <p className="text-gray-600 mb-3 line-clamp-3 leading-relaxed">
          {post.excerpt || (post.content?.substring(0, 150) + '...')}
        </p>
        
        <Link 
          to={`/posts/${post._id}`}
          className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors mb-4"
        >
          Read more →
        </Link>

        {/* Author and Date */}
        <div className="flex items-center justify-between meta-text mb-4">
          <div className="flex items-center space-x-2">
            <img
              src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name}&background=8b5cf6&color=fff`}
              alt={post.author?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium">{post.author?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{Math.ceil((post.content?.length || 0) / 200)} min read</span>
            <span>•</span>
            <time>{formatDate(post.createdAt)}</time>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {showActions && (
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={isLoading}
                className={clsx(
                  'flex items-center space-x-1.5 text-sm font-medium',
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                )}
              >
                {isLiked ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span>{likes}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-1.5 text-sm font-medium text-gray-500 hover:text-purple-600"
              >
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <span>{comments.length}</span>
              </button>

              <SocialShare post={post} />
            </div>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={clsx(
                'text-sm font-medium',
                isBookmarked ? 'text-purple-600' : 'text-gray-500 hover:text-purple-600'
              )}
            >
              {isBookmarked ? (
                <BookmarkSolidIcon className="h-5 w-5" />
              ) : (
                <BookmarkIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4"
              >
                {user ? (
                  <form onSubmit={handleComment} className="relative">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-4 py-2 pr-16 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                      Post
                    </button>
                  </form>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    Please{' '}
                    <Link to="/login" className="text-purple-600 hover:underline">
                      login
                    </Link>{' '}
                    to comment
                  </p>
                )}

                <div className="space-y-3">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex space-x-3"
                    >
                      <img
                        src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${comment.author?.name}`}
                        alt={comment.author?.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.author?.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.article>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;