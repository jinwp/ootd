document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('back-btn');
    const userInfo = document.getElementById('user-info');
    const postsContainer = document.getElementById('posts-container');
    const chatButton = document.getElementById('chat-btn');
  
    // Get user_id from the URL (assuming format: profile.html?user_id=<user_id>)
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user_id');
  
    if (!userId) {
      alert('User ID is missing!');
      return;
    }

    chatButton.addEventListener('click', async () => {
      try {
        const response = await fetch(`http://localhost:3000/chat/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });
  
        if (!response.ok) throw new Error('Failed to get chatroom');
        
        const chatroom = await response.json();
        window.location.href = `/chatroom.html?room_id=${chatroom.room_id}`;
      } catch (error) {
        console.error('Error fetching chatroom:', error);
        alert('Unable to create or join chatroom.');
      }
    });
  
    // Fetch user profile
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });
  
        if (!response.ok) throw new Error('Failed to fetch user profile');
  
        const user = await response.json();
        console.log(user.postings);

        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-height').textContent = user.height;
        document.getElementById('user-weight').textContent = user.weight;

        renderPosts(user.postings);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    const renderPosts = (posts) => {
      postsContainer.innerHTML = '';
  
      if (!posts || posts.length === 0) {
          postsContainer.innerHTML = '<p class="no-posts">This user has no posts yet.</p>';
          return;
      }
  
      posts.forEach((post) => {
          const postElement = document.createElement('div');
          postElement.classList.add('post');
  
          const images = post.images.map(
              (img) =>
                  `<img src="${img.imageUrl}" alt="Post Image" style="max-width: 200px; max-height: 200px; object-fit: cover;">`
          );
  
          postElement.innerHTML = `
              <div>
                  <p>${post.text}</p>
                  ${images.join('')}
                  <small>${new Date(post.date_created).toLocaleString()}</small>
              </div>
          `;
  
          // Button container
          const buttonContainer = document.createElement('div');
          buttonContainer.classList.add('post-buttons');
  
          // Delete button
          const deleteButton = document.createElement('button');
          deleteButton.classList.add('delete-btn');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', async () => {
              const confirmDelete = confirm('Are you sure you want to delete this post?');
              if (confirmDelete) {
                  try {
                      const response = await fetch(`http://localhost:3000/postings/${post.post_id}`, {
                          method: 'DELETE',
                          headers: {
                              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                          },
                      });
  
                      if (!response.ok) throw new Error('Failed to delete post');
                      alert('Post deleted successfully');
                      postElement.remove();
                  } catch (error) {
                      console.error('Error deleting post:', error);
                      alert('Failed to delete the post.');
                  }
              }
          });
  
          // Update button
          const updateButton = document.createElement('button');
          updateButton.classList.add('update-btn');
          updateButton.textContent = 'Update';
          updateButton.addEventListener('click', () => {
              window.location.href = `updatePosting.html?post_id=${post.post_id}`;
          });
  
          // Append buttons to the button container
          buttonContainer.appendChild(deleteButton);
          buttonContainer.appendChild(updateButton);
  
          // Append button container to the post
          postElement.appendChild(buttonContainer);
  
          // Append post to the posts container
          postsContainer.appendChild(postElement);
      });
  };
  
  
    // Back button functionality
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  
    // Fetch the user profile on page load
    fetchUserProfile();
  });
  