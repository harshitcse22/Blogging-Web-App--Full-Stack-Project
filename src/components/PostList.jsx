import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  EyeIcon, 
  PencilSquareIcon, 
  TrashIcon,
  ChatBubbleLeftIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from './ui/Button';

const PostList = ({ posts, onDelete }) => {
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!posts || !Array.isArray(posts)) {
    return <div className="text-center py-8">No posts available</div>;
  }

  return (
    <div className="divide-y divide-gray-200">
      {posts.map((post) => (
        <div key={post._id} className="py-6 first:pt-0 last:pb-0">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            {post.coverImage && (
              <div className="w-full md:w-48 h-48 overflow-hidden rounded-lg">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link to={`/post/${post._id}`} className="hover:text-purple-600">
                    {post.title}
                  </Link>
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories?.map((category, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt || post.content?.substring(0, 150)}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <HeartIcon className="h-4 w-4" />
                    <span>{post.likesCount || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ChatBubbleLeftIcon className="h-4 w-4" />
                    <span>{post.commentsCount || 0}</span>
                  </span>
                  <span className="text-gray-400">{formatDate(post.createdAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link to={`/posts/${post._id}/edit`}>
                    <Button variant="outline" size="sm">
                      <PencilSquareIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDelete(post._id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;