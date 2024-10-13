export function formatDate(date) {
  const messageDate = new Date(date);
  const today = new Date();

  const diffTime = today.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));


  if (diffDays === 0) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }


  if (diffDays === 1) {
    return 'Yesterday';
  }

  if (diffDays < 7) {
    return messageDate.toLocaleDateString(undefined, { weekday: 'long' });
  }

  return messageDate.toLocaleDateString();
}
