import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  PencilSquareIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    fetchUserPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchTerm, sortBy, filterBy]);

  const fetchUserPosts = async () => {
    try {
      const response = await api.get('/api/posts/user/me');
      setPosts(response.data.posts || []);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortPosts = () => {
    let filtered = [...posts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(post =>
        post.categories?.includes(filterBy)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return (b.likesCount || 0) - (a.likesCount || 0);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/api/posts/${postId}`);
      toast.success('Post deleted successfully');
      fetchUserPosts();
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUniqueCategories = () => {
    const categories = posts.flatMap(post => post.categories || []);
    return [...new Set(categories)];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
            <p className="text-gray-600 mt-2">
              Manage and organize your blog posts
            </p>
          </div>
          <Link to="/create">
            <Button className="flex items-center mt-4 md:mt-0">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{posts.length}</div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {posts.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">
              {posts.reduce((sum, post) => sum + (post.likesCount || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {posts.reduce((sum, post) => sum + (post.commentsCount || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Comments</div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Liked</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </Card>

        {/* Posts List */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cover Image */}
                    {post.coverImage && (
                      <div className="lg:w-48 h-32 lg:h-24 overflow-hidden rounded-lg flex-shrink-0">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories?.map((category, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/posts/${post._id}`}
                        className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2 mb-2"
                      >
                        {post.title}
                      </Link>

                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {post.excerpt || post.content?.substring(0, 150) + '...'}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(post.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            {post.views || 0}
                          </span>
                          <span className="flex items-center">
                            <HeartIcon className="h-4 w-4 mr-1" />
                            {post.likesCount || 0}
                          </span>
                          <span className="flex items-center">
                            <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                            {post.commentsCount || 0}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link to={`/posts/${post._id}`}>
                            <Button size="sm" variant="outline">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Link to={`/posts/${post._id}/edit`}>
                            <Button size="sm" variant="outline">
                              <PencilSquareIcon className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePost(post._id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            {searchTerm || filterBy !== 'all' ? (
              <>
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBy('all');
                  }}
                >
                  Clear Filters
                </Button>
              </>
            ) : (
              <>
                <PencilSquareIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">
                  Start writing your first blog post to share your thoughts with the world!
                </p>
                <Link to="/create">
                  <Button>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Your First Post
                  </Button>
                </Link>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserPosts;