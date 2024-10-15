type Message = {
  id: string;          
  sender_id: string;  
  content: string;              
  created_at: string;
};


export function formatDate(date:string |number) {
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

export function formatMessageDate(date:string | number) {
  const messageDate = new Date(date);
  const today = new Date();
  const diffTime = today.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  }

  if (diffDays === 1) {
    return 'Yesterday';
  }

  if (diffDays < 7) {
    return messageDate.toLocaleDateString(undefined, { weekday: 'long' });
  }
  return messageDate.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

}

export function groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
  const groupedMessages: Record<string, Message[]> = {};

  // Iterate through the messages
  messages.forEach((message) => {
    const messageDate = formatMessageDate(message.created_at);

    // Group the messages by date
    if (!groupedMessages[messageDate]) {
      groupedMessages[messageDate] = [];
    }
    groupedMessages[messageDate].push(message);
  });

  return groupedMessages;
}

export function formatMessageTime(date:string | number) {
  const messageDate = new Date(date);
  return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
