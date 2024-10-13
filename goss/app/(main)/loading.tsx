import LoadingSpinner from '../ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className=" inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <LoadingSpinner />
    </div>
  );
}
