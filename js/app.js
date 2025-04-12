document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const modal = document.getElementById('promptModal');
    const promptCards = document.querySelectorAll('.prompt-card');
    const closeButton = document.querySelector('.close-button');
    const filterTags = document.querySelectorAll('.filter-tag');
    const viewTabs = document.querySelectorAll('.view-tab');
    const sortSelect = document.getElementById('sort-by');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    // Open modal when clicking on a prompt card (except when clicking favorite button)
    promptCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('favorite-button')) {
                modal.style.display = 'block';
            }
        });
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
    
    // Handle favorite button clicks
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent opening the modal
            button.classList.toggle('active');
            if (button.classList.contains('active')) {
                button.style.color = '#FFD700';
            } else {
                button.style.color = 'rgba(255,255,255,0.7)';
            }
        });
    });
    
    // Handle filter tag selection
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active class from all tags
            filterTags.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tag
            tag.classList.add('active');
            
            // In a real app, we would filter the prompts here
            console.log(`Filter selected: ${tag.textContent}`);
        });
    });
    
    // Handle view tab selection
    viewTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            viewTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // In a real app, we would switch views here
            console.log(`View selected: ${tab.textContent}`);
        });
    });
    
    // Handle sort selection
    sortSelect.addEventListener('change', () => {
        // In a real app, we would sort the prompts here
        console.log(`Sort selected: ${sortSelect.value}`);
    });
    
    // Handle search
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            // In a real app, we would search the prompts here
            console.log(`Search term: ${searchTerm}`);
        }
    });
    
    // Also trigger search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
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
    
    // Handle the favorite button in the modal
    const favoriteDetailButton = document.querySelector('.favorite-detail');
    favoriteDetailButton.addEventListener('click', () => {
        const isFavorite = favoriteDetailButton.textContent.includes('★ Favorite');
        if (isFavorite) {
            favoriteDetailButton.textContent = '☆ Add to Favorites';
        } else {
            favoriteDetailButton.textContent = '★ Favorite';
        }
    });
});
