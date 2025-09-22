import { motion } from 'framer-motion';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import PostCard from './PostCard';

const PostGrid = ({ posts, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PostCard post={post} />
          <div className="mt-4 flex justify-end space-x-2">
            <Link to={`/posts/${post._id}/edit`}>
              <Button variant="outline" size="sm">
                <PencilSquareIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(post._id)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PostGrid;