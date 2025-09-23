import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ShareIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Sidebar from '../components/ui/Sidebar';

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  console.log('PostView component loaded with ID:', id);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchRelatedPosts();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPost = async () => {
    try {
      console.log('Fetching post with ID:', id);
      const response = await api.get(`/api/posts/${id}`);
      console.log('Post response:', response.data);
      setPost(response.data);
      setLikesCount(response.data.likesCount || 0);
      setIsLiked(response.data.likes?.includes(user?._id));
      setRelatedPosts(response.data.relatedPosts || []);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Post not found');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/posts/${id}/comments`);
      setComments(response.data.comments || response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      // Related posts will come with the main post response
      // No need for separate API call
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const response = await api.post(`/api/posts/${id}/like`);
      setLikesCount(response.data.likesCount);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) return;

    try {
      await api.post(`/api/posts/${id}/comments`, { content: newComment });
      setNewComment('');
      fetchComments();
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      } else {
        toast.error('Clipboard not supported');
      }
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const readingTime = Math.ceil((post?.content?.length || 0) / 200);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
          <Link to="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Floating Action Bar */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
        <div className="bg-white rounded-full shadow-lg p-2 space-y-2">
          <button
            onClick={handleLike}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
              isLiked 
                ? 'bg-red-50 text-red-600' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {isLiked ? (
              <HeartSolidIcon className="h-6 w-6" />
            ) : (
              <HeartIcon className="h-6 w-6" />
            )}
          </button>
          <div className="text-center text-sm font-medium text-gray-600">
            {likesCount}
          </div>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ChatBubbleLeftIcon className="h-6 w-6" />
          </button>
          <div className="text-center text-sm font-medium text-gray-600">
            {comments.length}
          </div>
          
          <button
            onClick={handleShare}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ShareIcon className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
              isBookmarked 
                ? 'bg-purple-50 text-purple-600' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="h-6 w-6" />
            ) : (
              <BookmarkIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Cover Image */}
              {post.coverImage && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories?.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight" style={{fontFamily: 'Poppins, sans-serif'}}>
                  {post.title}
                </h1>

                {/* Author Info */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <img
                      src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name}&background=8b5cf6&color=fff`}
                      alt={post.author?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.author?.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(post.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {readingTime} min read
                        </span>
                        <span className="flex items-center">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          {post.views || 0} views
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                        isLiked 
                          ? 'bg-red-50 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isLiked ? (
                        <HeartSolidIcon className="h-5 w-5" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                      <span>{likesCount}</span>
                    </button>

                    <button
                      onClick={() => setShowComments(!showComments)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <span>{comments.length}</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`p-2 rounded-full transition-colors ${
                        isBookmarked 
                          ? 'bg-purple-50 text-purple-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isBookmarked ? (
                        <BookmarkSolidIcon className="h-5 w-5" />
                      ) : (
                        <BookmarkIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none mb-12">
                  <div className="whitespace-pre-wrap text-lg leading-relaxed text-gray-800">
                    {post.content}
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Bio */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name}&background=8b5cf6&color=fff`}
                      alt={post.author?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {post.author?.name}
                      </h4>
                      <p className="text-gray-600 mb-3">
                        {post.author?.bio || 'Passionate writer and content creator sharing insights and stories.'}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{post.author?.stats?.postsCount || 0} posts</span>
                        <span>{post.author?.stats?.followersCount || 0} followers</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Follow
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-12 pt-8 border-t border-gray-200"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Comments ({comments.length})
                    </h3>

                    {/* Add Comment Form */}
                    {user ? (
                      <form onSubmit={handleComment} className="mb-8">
                        <div className="flex space-x-4">
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=8b5cf6&color=fff`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Write a comment..."
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                              rows="3"
                            />
                            <div className="flex justify-end mt-2">
                              <Button type="submit" size="sm">
                                Post Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
                        <p className="text-gray-600 mb-4">Please login to join the discussion</p>
                        <Link to="/login">
                          <Button>Login to Comment</Button>
                        </Link>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment._id} className="flex space-x-4">
                          <img
                            src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${comment.author?.name}&background=8b5cf6&color=fff`}
                            alt={comment.author?.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {comment.author?.name}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Card key={relatedPost._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <Link to={`/posts/${relatedPost._id}`}>
                        {relatedPost.coverImage && (
                          <img
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            className="w-full h-32 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostView;