import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FireIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import api from '../../utils/api';
import Card from './Card';

const Sidebar = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  useEffect(() => {
    fetchSidebarData();
  }, []);

  const fetchSidebarData = async () => {
    try {
      const [trending, recent] = await Promise.all([
        api.get('/api/posts/trending?limit=5'),
        api.get('/api/posts?limit=5&sort=newest')
      ]);
      
      setTrendingPosts(trending.data.posts || []);
      setRecentPosts(recent.data.posts || []);
      
      // Extract popular tags
      const allTags = [...trending.data.posts, ...recent.data.posts]
        .flatMap(post => post.categories || []);
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});
      
      setPopularTags(
        Object.entries(tagCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([tag]) => tag)
      );
    } catch (error) {
      console.error('Error fetching sidebar data:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Trending Posts */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <FireIcon className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Trending Now</h3>
        </div>
        <div className="space-y-4">
          {trendingPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src={post.coverImage || 'https://via.placeholder.com/64x64'}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/posts/${post._id}`}
                  className="text-sm font-medium text-gray-900 hover:text-purple-600 line-clamp-2"
                >
                  {post.title}
                </Link>
                <p className="text-xs text-gray-500 mt-1">
                  {post.likesCount || 0} likes
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Recent Posts */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
        </div>
        <div className="space-y-3">
          {recentPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/posts/${post._id}`}
                className="block text-sm font-medium text-gray-900 hover:text-purple-600 line-clamp-2"
              >
                {post.title}
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Popular Tags */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <TagIcon className="h-5 w-5 text-green-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Popular Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors"
            >
              #{tag}
            </motion.span>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Sidebar;