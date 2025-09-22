import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, MagnifyingGlassIcon, ArrowTrendingUpIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline';
import { setPosts, setLoading } from '../features/postsSlice';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Newsletter from '../components/ui/Newsletter';
import Sidebar from '../components/ui/Sidebar';
import SearchBar from '../components/ui/SearchBar';

const Home = () => {
  const { posts, isLoading } = useSelector(state => state.posts);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [stats, setStats] = useState({ totalPosts: 0, totalUsers: 0, totalViews: 0 });

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const categoryParam = selectedCategory === 'all' ? '' : `&category=${selectedCategory}`;
        const [postsResponse, statsResponse] = await Promise.all([
          api.get(`/api/posts?limit=12${categoryParam}`),
          api.get('/api/stats').catch(() => ({ data: { totalPosts: 150, totalUsers: 50, totalViews: 2500 } }))
        ]);
        
        dispatch(setPosts({
          posts: postsResponse.data.posts || [],
          pages: postsResponse.data.pages || 1
        }));
        
        setStats(statsResponse.data);
      } catch (error) {
        toast.error('Failed to load posts');
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, selectedCategory]);

  const categories = ['all', 'technology', 'lifestyle', 'travel', 'food'];
  
  const [featuredPost, ...otherPosts] = posts || [];
  
  // Posts are already filtered by backend based on selectedCategory
  const filteredPosts = otherPosts || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6" style={{fontFamily: 'Poppins, sans-serif'}}>
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent brand-text">
                BlogHub
              </span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-100">
              Discover amazing stories, share your thoughts, and connect with writers from around the world.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <button
                onClick={() => setShowSearch(true)}
                className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-full py-4 px-6 text-left text-white placeholder-gray-300 hover:bg-opacity-30 transition-all duration-300"
              >
                <MagnifyingGlassIcon className="h-5 w-5 inline mr-3" />
                Search for posts, topics, authors...
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!user ? (
                <>
                  <Link to="/register">
                    <Button size="xl" className="bg-white text-purple-600 hover:bg-gray-100 shadow-2xl">
                      Start Writing Today
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-purple-600">
                      Sign In
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/create">
                  <Button size="xl" className="bg-white text-purple-600 hover:bg-gray-100 shadow-2xl">
                    <PencilSquareIcon className="h-6 w-6 mr-2" />
                    Write New Post
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.totalPosts}+</div>
              <div className="text-gray-600">Published Posts</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalUsers}+</div>
              <div className="text-gray-600">Active Writers</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.totalViews}+</div>
              <div className="text-gray-600">Monthly Readers</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-48 w-full object-cover md:h-full md:w-48"
                  src={featuredPost.coverImage || 'https://via.placeholder.com/400x300'}
                  alt={featuredPost.title}
                />
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-purple-600 font-semibold">
                  Featured Post
                </div>
                <Link
                  to={`/post/${featuredPost._id}`}
                  className="block mt-1 text-2xl leading-tight font-bold text-gray-900 hover:text-purple-600"
                >
                  {featuredPost.title}
                </Link>
                <p className="mt-2 text-gray-600">{featuredPost.excerpt}</p>
                <div className="mt-4 flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={featuredPost.author?.avatar || `https://ui-avatars.com/api/?name=${featuredPost.author?.name}`}
                    alt={featuredPost.author?.name}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{featuredPost.author?.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(featuredPost.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex overflow-x-auto pb-4 space-x-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Posts Grid */}
          <div className="lg:col-span-3">
            {filteredPosts?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl text-gray-600">No posts found in this category.</h3>
              </div>
            )}
            
            {/* Load More Button */}
            {filteredPosts?.length > 0 && (
              <div className="text-center mt-12">
                <Link to="/posts">
                  <Button size="lg" variant="outline">
                    <EyeIcon className="h-5 w-5 mr-2" />
                    View All Posts
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );

}

export default Home