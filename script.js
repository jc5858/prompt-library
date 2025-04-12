// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the app
  loadPrompts();
  setupEventListeners();
});

// Load prompts from localStorage and display them
function loadPrompts() {
  const prompts = getPrompts();
  const promptGrid = document.querySelector('.prompt-grid');
  promptGrid.innerHTML = '';
  
  if (prompts.length === 0) {
    promptGrid.innerHTML = '<p class="no-prompts">No prompts yet. Create your first prompt!</p>';
    return;
  }
  
  prompts.forEach(prompt => {
    const card = createPromptCard(prompt);
    promptGrid.appendChild(card);
  });
}

// Get prompts from localStorage
function getPrompts() {
  return JSON.parse(localStorage.getItem('prompts') || '[]');
}

// Create a prompt card element
function createPromptCard(prompt) {
  const card = document.createElement('div');
  card.className = 'prompt-card';
  card.dataset.id = prompt.id;
  
  const tagsHtml = prompt.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('');
  
  card.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">${prompt.title}</h3>
      <div class="card-tags">
        ${tagsHtml}
      </div>
      <button class="favorite-button ${prompt.favorite ? 'active' : ''}" 
       style="${prompt.favorite ? 'color: #FFD700;' : ''}">★</button>
    </div>
    <div class="card-content">
      <p class="card-description">Prompt for ${prompt.title}</p>
      <div class="card-preview">${prompt.content.substring(0, 150)}${prompt.content.length > 150 ? '...' : ''}</div>
    </div>
  `;
  
  return card;
}

// Setup event listeners
function setupEventListeners() {
  // New prompt button
  const newPromptBtn = document.createElement('button');
  newPromptBtn.className = 'button primary-button new-prompt-btn';
  newPromptBtn.textContent = '+';
  newPromptBtn.title = 'Create New Prompt';
  document.body.appendChild(newPromptBtn);
  
  newPromptBtn.addEventListener('click', () => {
    showPromptForm();
  });
  
  // Prompt card clicks
  document.querySelector('.prompt-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.prompt-card');
    if (!card) return;
    
    // If favorite button clicked
    if (e.target.classList.contains('favorite-button')) {
      toggleFavorite(card.dataset.id);
      e.stopPropagation();
      return;
    }
    
    // Otherwise show prompt details
    showPromptDetails(card.dataset.id);
  });
  
  // Filter tags
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      filterPrompts(tag.textContent);
    });
  });
  
  // View tabs
  document.querySelectorAll('.view-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.textContent === 'Favorites') {
        showFavorites();
      } else {
        loadPrompts();
      }
    });
  });
  
  // Search
  document.querySelector('.search-button').addEventListener('click', () => {
    const searchTerm = document.querySelector('.search-input').value;
    searchPrompts(searchTerm);
  });
  
  document.querySelector('.search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const searchTerm = document.querySelector('.search-input').value;
      searchPrompts(searchTerm);
    }
  });
  
  // Sort select
  document.getElementById('sort-by').addEventListener('change', (e) => {
    sortPrompts(e.target.value);
  });
}

// Show the prompt creation/editing form
function showPromptForm(promptId = null) {
  const modal = document.getElementById('promptModal');
  let prompt = { title: '', content: '', tags: [] };
  
  if (promptId) {
    const prompts = getPrompts();
    prompt = prompts.find(p => p.id === promptId) || prompt;
  }
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <h2>${promptId ? 'Edit' : 'Create'} Prompt</h2>
      <form id="promptForm">
        <div class="form-group">
          <label for="promptTitle">Title</label>
          <input type="text" id="promptTitle" value="${prompt.title}" required>
        </div>
        <div class="form-group">
          <label for="promptTags">Tags (comma separated)</label>
          <input type="text" id="promptTags" value="${prompt.tags.join(', ')}">
        </div>
        <div class="form-group">
          <label for="promptContent">Content</label>
          <textarea id="promptContent" rows="8" required>${prompt.content}</textarea>
        </div>
        <div class="form-buttons">
          <button type="submit" class="button primary-button">Save</button>
          <button type="button" class="button secondary-button" onclick="closeModal()">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  modal.style.display = 'block';
  
  // Form submit handler
  document.getElementById('promptForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('promptTitle').value;
    const tags = document.getElementById('promptTags').value;
    const content = document.getElementById('promptContent').value;
    
    if (promptId) {
      editPrompt(promptId, title, content, tags);
    } else {
      createNewPrompt(title, content, tags);
    }
    
    closeModal();
  });
  
  // Close button
  document.querySelector('.close-button').addEventListener('click', () => {
    closeModal();
  });
  
  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Show prompt details
function showPromptDetails(id) {
  const prompts = getPrompts();
  const prompt = prompts.find(p => p.id === id);
  
  if (!prompt) return;
  
  const modal = document.getElementById('promptModal');
  const tagsHtml = prompt.tags.map(tag => `<span class="prompt-detail-tag">${tag}</span>`).join('');
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      
      <div class="prompt-detail-header">
        <h2 class="prompt-detail-title">${prompt.title}</h2>
        <div class="prompt-detail-tags">
          ${tagsHtml}
        </div>
        <div class="prompt-detail-meta">
          <span>Created: ${new Date(prompt.created).toLocaleDateString()}</span>
          <span>Used: ${prompt.useCount} times</span>
        </div>
      </div>
      
      <div class="prompt-detail-content">${prompt.content}</div>
      
      <div class="prompt-detail-buttons">
        <button class="button primary-button" onclick="copyPromptToClipboard('${id}')">Copy Prompt</button>
        <button class="button secondary-button" onclick="showPromptForm('${id}')">Edit</button>
        <button class="button secondary-button" onclick="deletePrompt('${id}')">Delete</button>
        <button class="button secondary-button favorite-detail ${prompt.favorite ? 'active' : ''}" 
         onclick="toggleFavorite('${id}')">${prompt.favorite ? '★ Unfavorite' : '★ Favorite'}</button>
      </div>
    </div>
  `;
  
  modal.style.display = 'block';
  
  // Close button
  document.querySelector('.close-button').addEventListener('click', () => {
    closeModal();
  });
  
  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Close the modal
function closeModal() {
  document.getElementById('promptModal').style.display = 'none';
}

// Create new prompt
function createNewPrompt(title, content, tags) {
  const id = Date.now().toString();
  const newPrompt = {
    id,
    title,
    content,
    tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    favorite: false,
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    useCount: 0
  };
  
  const prompts = getPrompts();
  prompts.push(newPrompt);
  localStorage.setItem('prompts', JSON.stringify(prompts));
  
  loadPrompts();
  showNotification('Prompt created successfully!');
}

// Edit an existing prompt
function editPrompt(id, updatedTitle, updatedContent, updatedTags) {
  const prompts = getPrompts();
  const index = prompts.findIndex(prompt => prompt.id === id);
  
  if (index !== -1) {
    prompts[index].title = updatedTitle;
    prompts[index].content = updatedContent;
    prompts[index].tags = updatedTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    prompts[index].lastModified = new Date().toISOString();
    
    localStorage.setItem('prompts', JSON.stringify(prompts));
    loadPrompts();
    showNotification('Prompt updated successfully!');
  }
}

// Delete a prompt
function deletePrompt(id) {
  if (confirm('Are you sure you want to delete this prompt?')) {
    const prompts = getPrompts();
    const updatedPrompts = prompts.filter(prompt => prompt.id !== id);
    
    localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
    loadPrompts();
    closeModal();
    showNotification('Prompt deleted successfully!');
  }
}

// Copy prompt to clipboard
function copyPromptToClipboard(id) {
  const prompts = getPrompts();
  const prompt = prompts.find(p => p.id === id);
  
  if (prompt) {
    navigator.clipboard.writeText(prompt.content).then(() => {
      // Update use count
      prompt.useCount++;
      localStorage.setItem('prompts', JSON.stringify(prompts));
      showNotification('Prompt copied to clipboard!');
    });
  }
}

// Toggle favorite status
function toggleFavorite(id) {
  const prompts = getPrompts();
  const index = prompts.findIndex(prompt => prompt.id === id);
  
  if (index !== -1) {
    prompts[index].favorite = !prompts[index].favorite;
    localStorage.setItem('prompts', JSON.stringify(prompts));
    loadPrompts();
    showNotification(prompts[index].favorite ? 'Added to favorites!' : 'Removed from favorites!');
  }
}

// Filter prompts by tag
function filterPrompts(tag) {
  const prompts = getPrompts();
  const promptGrid = document.querySelector('.prompt-grid');
  promptGrid.innerHTML = '';
  
  let filteredPrompts = prompts;
  if (tag !== 'All') {
    filteredPrompts = prompts.filter(prompt => 
      prompt.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }
  
  if (filteredPrompts.length === 0) {
    promptGrid.innerHTML = '<p class="no-prompts">No prompts match this filter.</p>';
    return;
  }
  
  filteredPrompts.forEach(prompt => {
    const card = createPromptCard(prompt);
    promptGrid.appendChild(card);
  });
}

// Show only favorite prompts
function showFavorites() {
  const prompts = getPrompts();
  const promptGrid = document.querySelector('.prompt-grid');
  promptGrid.innerHTML = '';
  
  const favorites = prompts.filter(prompt => prompt.favorite);
  
  if (favorites.length === 0) {
    promptGrid.innerHTML = '<p class="no-prompts">No favorite prompts yet.</p>';
    return;
  }
  
  favorites.forEach(prompt => {
    const card = createPromptCard(prompt);
    promptGrid.appendChild(card);
  });
}

// Search prompts
function searchPrompts(term) {
  if (!term) {
    loadPrompts();
    return;
  }
  
  const prompts = getPrompts();
  const promptGrid = document.querySelector('.prompt-grid');
  promptGrid.innerHTML = '';
  
  const searchTerm = term.toLowerCase();
  const results = prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchTerm) || 
    prompt.content.toLowerCase().includes(searchTerm) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
  
  if (results.length === 0) {
    promptGrid.innerHTML = '<p class="no-prompts">No prompts match your search.</p>';
    return;
  }
  
  results.forEach(prompt => {
    const card = createPromptCard(prompt);
    promptGrid.appendChild(card);
  });
}

// Sort prompts
function sortPrompts(sortBy) {
  const prompts = getPrompts();
  const promptGrid = document.querySelector('.prompt-grid');
  promptGrid.innerHTML = '';
  
  let sortedPrompts = [...prompts];
  
  switch(sortBy) {
    case 'newest':
      sortedPrompts.sort((a, b) => new Date(b.created) - new Date(a.created));
      break;
    case 'oldest':
      sortedPrompts.sort((a, b) => new Date(a.created) - new Date(b.created));
      break;
    case 'a-z':
      sortedPrompts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'most-used':
      sortedPrompts.sort((a, b) => b.useCount - a.useCount);
      break;
  }
  
  sortedPrompts.forEach(prompt => {
    const card = createPromptCard(prompt);
    promptGrid.appendChild(card);
  });
}

// Show notification
function showNotification(message
