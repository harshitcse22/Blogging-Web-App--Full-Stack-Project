import { motion } from 'framer-motion'
import clsx from 'clsx'

const Card = ({ children, className, hover = true, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' } : {}}
      className={clsx(
        'bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card