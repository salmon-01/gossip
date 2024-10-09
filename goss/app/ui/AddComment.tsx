import { FaComment } from 'react-icons/fa'; // You can use any icon from react-icons or any other icon library

const AddComment = () => {
  return (
    <div className="mt-3">
      <form action="">
        <div className="relative">
          <input
            type="text"
            placeholder="Comment"
            className="mb-5 w-full rounded-full p-3 pl-10 pr-20" // Padding left for the icon, right for the button
          />
          <FaComment className="absolute left-3 top-1/3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <button
            type="submit"
            className="absolute right-1 top-1/3 mt-0.5 -translate-y-1/2 transform rounded-full bg-purple-600 px-4 py-2 text-white"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddComment;
