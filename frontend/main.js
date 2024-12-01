document.addEventListener('DOMContentLoaded', () => {
  const postFeed = document.getElementById('post-feed');
  const filterForm = document.getElementById('filter-form');
  const chatroomsButton = document.getElementById('chatrooms-btn'); // Chatrooms button
  const createpostingButton = document.getElementById('create-posting-btn');

  const fetchPosts = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:3000/postings?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const posts = await response.json();
        renderPosts(posts);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const renderPosts = (posts) => {
    postFeed.innerHTML = '';
    if (posts.length === 0) {
      postFeed.innerHTML = '<p class="no-posts">현재 포스트 없음</p>';
      return;
    }

    posts.forEach((post) => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      console.log(post.images);
      const images = post.images.map(
        (img) => `<img src="${img.imageUrl}" alt="Post Image" style="max-width: 200px; max-height: 200px; object-fit: cover;">`
      );

      postElement.innerHTML = `
        <div>
          <strong>${post.uploader.name}</strong> (${post.uploader.height} cm, ${post.uploader.weight} kg)
        </div>
        <p>${post.text}</p>
        ${images.join('')}
        <small>${new Date(post.date_created).toLocaleString()}</small>
      `;
      
      const viewProfileButton = document.createElement('button');
      viewProfileButton.classList.add('view-profile-btn');
      viewProfileButton.textContent = 'View Profile';
  
      // Add click event to navigate to the user's profile
      viewProfileButton.addEventListener('click', () => {
        window.location.href = `profile.html?user_id=${post.user_id}`;
      });
  
      // Append the button to the post
      postElement.appendChild(viewProfileButton);

      postFeed.appendChild(postElement);
    });
  };

  filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const filters = {
      semester: document.getElementById('semester').value,
      minHeight: document.getElementById('minHeight').value,
      maxHeight: document.getElementById('maxHeight').value,
      minWeight: document.getElementById('minWeight').value,
      maxWeight: document.getElementById('maxWeight').value,
    };

    fetchPosts(filters);
  });

  chatroomsButton.addEventListener('click', () => {
    window.location.href = 'chatRoomList.html';
  });

  createpostingButton.addEventListener('click', () => {
    window.location.href = 'createPosting.html';
  });

  fetchPosts();
});
