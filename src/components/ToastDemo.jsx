import { toast } from 'sonner'

const ToastDemo = () => {
  return (
    <div className="p-4 space-y-2">
      <h3 className="font-bold">Toast Examples:</h3>
      <button 
        onClick={() => toast.success('Success message!')}
        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
      >
        Success
      </button>
      <button 
        onClick={() => toast.error('Error message!')}
        className="bg-red-500 text-white px-3 py-1 rounded mr-2"
      >
        Error
      </button>
      <button 
        onClick={() => toast.info('Info message!')}
        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
      >
        Info
      </button>
      <button 
        onClick={() => toast.loading('Loading...')}
        className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
      >
        Loading
      </button>
    </div>
  )
}

export default ToastDemo