import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';
import PostList from '../components/PostList';
import Loading from '../components/ui/Loading';
import Card from '../components/ui/Card';
import { debounce } from 'lodash';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useSelector(state => state.auth);

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setIsLoading(true);
    try {
      const params = { page: pageNum, limit: 12 };
      if (searchTerm) params.q = searchTerm;
      if (filter !== 'all') params.category = filter;
      
      const response = await api.get('/api/posts', { params });
      const newPosts = response.data.posts || [];
      
      if (append) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      
      setHasMore(pageNum < (response.data.pages || 1));
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filter]);

  const debouncedSearch = useCallback(
    debounce((term) => {
      setPage(1);
      fetchPosts(1, false);
    }, 300),
    [fetchPosts]
  );

  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setPage(1);
      fetchPosts(1, false);
    }
  }, [searchTerm, debouncedSearch, fetchPosts]);

  const categories = useMemo(() => 
    ['all', ...new Set(posts.flatMap(post => post.categories || []))],
    [posts]
  );

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'popular') {
        return (b.likesCount || 0) - (a.likesCount || 0);
      }
      return 0;
    });
  }, [posts, sortBy]);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, true);
    }
  }, [hasMore, isLoading, page, fetchPosts]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
          <p className="mt-2 text-gray-600">Discover amazing stories from our community</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setFilter(category);
                      setPage(1);
                      fetchPosts(1, false);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      filter === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Posts Grid */}
        <Card className="overflow-hidden">
          {sortedPosts.length > 0 ? (
            <>
              <PostList posts={sortedPosts} showActions={false} />
              {hasMore && (
                <div className="text-center p-6 border-t">
                  <button
                    onClick={loadMore}
                    disabled={isLoading}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? 'Loading...' : 'Load More Posts'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No posts found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm 
                  ? `No posts found for "${searchTerm}"`
                  : filter === 'all' 
                    ? "There are no posts yet"
                    : `No posts found in the '${filter}' category`
                }
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AllPosts;