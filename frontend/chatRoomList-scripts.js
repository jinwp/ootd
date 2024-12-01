async function fetchChatrooms() {
    const response = await fetch('http://localhost:3000/chat/chatrooms', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    });
  
    if (response.ok) {
      const chatrooms = await response.json();
      const container = document.getElementById('chatrooms-container');
      chatrooms.forEach(chatroom => {
        const div = document.createElement('div');
        div.classList.add('chatroom');
        div.textContent = `${chatroom.other_user_name}`;
        div.addEventListener('click', () => {
          window.location.href = `/chatroom.html?room_id=${chatroom.room_id}`;
        });
        container.appendChild(div);
      });
    } else {
      alert('Failed to load chatrooms');
    }
  }
  
  fetchChatrooms();  