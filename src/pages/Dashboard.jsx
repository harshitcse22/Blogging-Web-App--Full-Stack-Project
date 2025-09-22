import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  PencilSquareIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [postsResponse, analyticsResponse] = await Promise.all([
        api.get('/api/posts/user/me'),
        api.get('/api/posts/analytics').catch(() => ({ data: { totalViews: 0, totalLikes: 0, totalComments: 0 } }))
      ]);

      const posts = postsResponse.data.posts || [];
      setRecentPosts(posts.slice(0, 5));
      
      // Calculate stats
      const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
      const totalLikes = posts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
      const totalComments = posts.reduce((sum, post) => sum + (post.commentsCount || 0), 0);
      
      setStats({
        totalPosts: posts.length,
        totalViews,
        totalLikes,
        totalComments
      });

      // Update stats with analytics data
      setStats(prevStats => ({
        ...prevStats,
        totalViews: analyticsResponse.data.totalViews || totalViews,
        totalLikes: analyticsResponse.data.totalLikes || totalLikes,
        totalComments: analyticsResponse.data.totalComments || totalComments
      }));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/api/posts/${postId}`);
      toast.success('Post deleted successfully');
      fetchDashboardData();
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

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: DocumentTextIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: EyeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes.toLocaleString(),
      icon: HeartIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Comments',
      value: stats.totalComments.toLocaleString(),
      icon: ChatBubbleLeftIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your blog today.
            </p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/create">
              <Button className="flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                New Post
              </Button>
            </Link>
            <Link to="/my-posts">
              <Button variant="outline">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                All Posts
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
                  <Link to="/my-posts" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    View all
                  </Link>
                </div>

                {recentPosts.length > 0 ? (
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <Link 
                            to={`/posts/${post._id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-purple-600 line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
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
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Link to={`/posts/${post._id}/edit`}>
                            <Button size="sm" variant="outline">
                              <PencilSquareIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeletePost(post._id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-4">Start writing your first blog post!</p>
                    <Link to="/create">
                      <Button>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create Post
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions & Analytics */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/create" className="block">
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <PencilSquareIcon className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="font-medium text-purple-700">Write New Post</span>
                    </div>
                  </Link>
                  <Link to="/my-posts" className="block">
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-medium text-blue-700">Manage Posts</span>
                    </div>
                  </Link>
                  <Link to="/profile" className="block">
                    <div className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <UserGroupIcon className="h-5 w-5 text-green-600 mr-3" />
                      <span className="font-medium text-green-700">Edit Profile</span>
                    </div>
                  </Link>
                </div>
              </Card>
            </motion.div>

            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg. Views per Post</span>
                    <span className="font-semibold text-gray-900">
                      {stats.totalPosts > 0 ? Math.round(stats.totalViews / stats.totalPosts) : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Engagement Rate</span>
                    <span className="font-semibold text-gray-900">
                      {stats.totalViews > 0 ? Math.round((stats.totalLikes / stats.totalViews) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Comments per Post</span>
                    <span className="font-semibold text-gray-900">
                      {stats.totalPosts > 0 ? Math.round(stats.totalComments / stats.totalPosts) : 0}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <h3 className="text-lg font-bold mb-4">💡 Writing Tips</h3>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>• Use engaging headlines to attract readers</li>
                  <li>• Add high-quality images to your posts</li>
                  <li>• Write consistently to build your audience</li>
                  <li>• Engage with comments to build community</li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;