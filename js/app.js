document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const modal = document.getElementById('promptModal');
    const promptGrid = document.querySelector('.prompt-grid');
    const closeButton = document.querySelector('.close-button');
    const filterTagsContainer = document.querySelector('.filter-container');
    const viewTabs = document.querySelectorAll('.view-tab');
    const sortSelect = document.getElementById('sort-by');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    // State
    let currentPrompts = [...samplePrompts];
    let activeFilter = 'All';
    let activeView = 'All Prompts';
    let currentSort = 'newest';
    let searchTerm = '';
    
    // Initialize the app
    init();
    
    function init() {
        // Generate filter tags dynamically
        generateFilterTags();
        
        // Render all prompts initially
        renderPrompts();
        
        // Set up event listeners
        setupEventListeners();
    }
    
    function generateFilterTags() {
        // Get all unique tags
        const allTags = getAllTags();
        
        // Create the "All" tag (already in HTML)
        
        // Create tags for each unique tag
        allTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'filter-tag';
            tagElement.textContent = tag;
            filterTagsContainer.appendChild(tagElement);
        });
        
        // Set up event listeners for filter tags
        const filterTags = document.querySelectorAll('.filter-tag');
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                // Remove active class from all tags
                filterTags.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tag
                tag.classList.add('active');
                
                // Update filter and rerender
                activeFilter = tag.textContent;
                applyFiltersAndRender();
            });
        });
    }
    
    function setupEventListeners() {
        // Handle view tab selection
        viewTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                viewTabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Update view and rerender
                activeView = tab.textContent;
                applyFiltersAndRender();
            });
        });
        
        // Handle sort selection
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            applyFiltersAndRender();
        });
        
        // Handle search
        searchButton.addEventListener('click', () => {
            searchTerm = searchInput.value.trim().toLowerCase();
            applyFiltersAndRender();
        });
        
        // Also trigger search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
        
        // Close modal when clicking the close button
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside the content
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Add copy functionality to the "Copy Prompt" button in the modal
        const copyButton = document.querySelector('.primary-button');
        copyButton.addEventListener('click', () => {
            const promptContent = document.querySelector('.prompt-detail-content').textContent;
            navigator.clipboard.writeText(promptContent)
                .then(() => {
                    // Visual feedback that copy succeeded
                    const originalText = copyButton.textContent;
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        });
    }
    
    function applyFiltersAndRender() {
        // Start with all prompts
        let filteredPrompts = [...samplePrompts];
        
        // Apply search filter if search term exists
        if (searchTerm) {
            filteredPrompts = filteredPrompts.filter(prompt => 
                prompt.title.toLowerCase().includes(searchTerm) || 
                prompt.description.toLowerCase().includes(searchTerm) || 
                prompt.content.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply tag filter if not "All"
        if (activeFilter !== 'All') {
            filteredPrompts = filteredPrompts.filter(prompt => 
                prompt.tags.includes(activeFilter)
            );
        }
        
        // Apply view filter if "Favorites"
        if (activeView === 'Favorites') {
            filteredPrompts = filteredPrompts.filter(prompt => prompt.favorite);
        }
        
        // Apply sorting
        filteredPrompts = sortPrompts(filteredPrompts, currentSort);
        
        // Update current prompts and render
        currentPrompts = filteredPrompts;
        renderPrompts();
    }
    
    function sortPrompts(prompts, sortType) {
        switch (sortType) {
            case 'newest':
                return [...prompts].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
            case 'oldest':
                return [...prompts].sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
            case 'a-z':
                return [...prompts].sort((a, b) => a.title.localeCompare(b.title));
            case 'most-used':
                return [...prompts].sort((a, b) => b.useCount - a.useCount);
            default:
                return prompts;
        }
    }
    
    function renderPrompts() {
        // Clear the grid
        promptGrid.innerHTML = '';
        
        // If no prompts match the filters
        if (currentPrompts.length === 0) {
            promptGrid.innerHTML = `
                <div class="no-prompts">
                    <p>No prompts found matching your criteria.</p>
                </div>
            `;
            return;
        }
        
        // Render each prompt
        currentPrompts.forEach(prompt => {
            const promptCard = createPromptCard(prompt);
            promptGrid.appendChild(promptCard);
        });
        
        // Add event listeners to the newly created cards
        setupCardEventListeners();
    }
    
    function createPromptCard(prompt) {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        card.dataset.id = prompt.id;
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${prompt.title}</h3>
                <div class="card-tags">
                    ${prompt.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                </div>
                <button class="favorite-button ${prompt.favorite ? 'active' : ''}" 
                    style="color: ${prompt.favorite ? '#FFD700' : 'rgba(255,255,255,0.7)'}">★</button>
            </div>
            <div class="card-content">
                <p class="card-description">${prompt.description}</p>
                <div class="card-preview">${prompt.content}</div>
            </div>
        `;
        
        return card;
    }
    
    function setupCardEventListeners() {
        // Get all prompt cards again after rendering
        const promptCards = document.querySelectorAll('.prompt-card');
        
        // Open modal when clicking on a prompt card (except when clicking favorite button)
        promptCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('favorite-button')) {
                    const promptId = card.dataset.id;
                    const promptData = currentPrompts.find(p => p.id === promptId);
                    if (promptData) {
                        showPromptDetail(promptData);
                    }
                }
            });
        });
        
        // Handle favorite button clicks
        const favoriteButtons = document.querySelectorAll('.favorite-button');
        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening the modal
                
                // Find the prompt data
                const card = button.closest('.prompt-card');
                const promptId = card.dataset.id;
                const promptIndex = samplePrompts.findIndex(p => p.id === promptId);
                
                if (promptIndex !== -1) {
                    // Toggle favorite status
                    samplePrompts[promptIndex].favorite = !samplePrompts[promptIndex].favorite;
                    
                    // Update UI
                    button.classList.toggle('active');
                    if (button.classList.contains('active')) {
                        button.style.color = '#FFD700';
                    } else {
                        button.style.color = 'rgba(255,255,255,0.7)';
                    }
                    
                    // If in favorites view, may need to re-render
                    if (activeView === 'Favorites') {
                        applyFiltersAndRender();
                    }
                }
            });
        });
    }
    
    function showPromptDetail(prompt) {
        // Update the modal content with the prompt data
        document.querySelector('.prompt-detail-title').textContent = prompt.title;
        
        // Clear and repopulate tags
        const tagsContainer = document.querySelector('.prompt-detail-tags');
        tagsContainer.innerHTML = '';
        prompt.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'prompt-detail-tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        // Format date strings
        const createdDate = new Date(prompt.dateCreated);
        const formattedDate = createdDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Update meta information
        document.querySelector('.prompt-detail-meta').innerHTML = `
            <span>Added: ${formattedDate}</span>
            <span>Used: ${prompt.useCount} times</span>
        `;
        
        // Update description and content
        document.querySelector('.prompt-detail-description').innerHTML = `
            <p>${prompt.description}</p>
        `;
        document.querySelector('.prompt-detail-content').textContent = prompt.content;
        
        // Update favorite button
        const favoriteDetailButton = document.querySelector('.favorite-detail');
        favoriteDetailButton.textContent = prompt.favorite ? '★ Favorite' : '☆ Add to Favorites';
        
        // Set up favorite button event in modal
        favoriteDetailButton.onclick = () => {
            // Find the prompt data
            const promptIndex = samplePrompts.findIndex(p => p.id === prompt.id);
            
            if (promptIndex !== -1) {
                // Toggle favorite status
                samplePrompts[promptIndex].favorite = !samplePrompts[promptIndex].favorite;
                prompt.favorite = samplePrompts[promptIndex].favorite;
                
                // Update UI
                favoriteDetailButton.textContent = prompt.favorite ? '★ Favorite' : '☆ Add to Favorites';
                
                // If in favorites view, may need to re-render
                if (activeView === 'Favorites') {
                    applyFiltersAndRender();
                } else {
                    // Just update the card in the grid
                    const card = document.querySelector(`.prompt-card[data-id="${prompt.id}"]`);
                    if (card) {
                        const button = card.querySelector('.favorite-button');
                        button.classList.toggle('active');
                        button.style.color = prompt.favorite ? '#FFD700' : 'rgba(255,255,255,0.7)';
                    }
                }
            }
        };
        
        // Show the modal
        modal.style.display = 'block';
        
        // Increment the use count
        const promptIndex = samplePrompts.findIndex(p => p.id === prompt.id);
        if (promptIndex !== -1) {
            samplePrompts[promptIndex].useCount++;
        }
    }
});
