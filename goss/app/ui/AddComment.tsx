import { useState } from 'react';
import { FaComment } from 'react-icons/fa';

interface AddCommentProps {
  onAddComment: (content: string) => void;
}

const AddComment: React.FC<AddCommentProps> = ({ onAddComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(comment);
      setComment('');
    }
  };

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
            placeholder="Comment"
            className="mb-5 w-full rounded-full p-3 pl-10 pr-20"
          />
          <FaComment className="absolute left-3 top-1/3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <button
            type="submit"
            className="dark:bg-darkModeSecondaryBtn absolute right-1 top-1/3 mt-0.5 -translate-y-1/2 transform rounded-full px-4 py-2 text-white"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddComment;
