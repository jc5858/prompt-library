// Sample prompt data - in a real app, this would come from a database or API
const samplePrompts = [
    {
        id: 'prompt-1',
        title: 'Website Redesign Expert',
        description: 'Perfect for getting detailed website redesign suggestions with a focus on UX and conversion optimization.',
        content: 'Act as a senior UX designer with 15+ years of experience in conversion optimization. Review my website [URL] and suggest improvements focusing on: user flow, call-to-actions, visual hierarchy, and mobile responsiveness. Include specific examples and mockup descriptions.',
        tags: ['Business', 'Design'],
        favorite: false,
        dateCreated: '2025-04-01T12:00:00Z',
        usageCount: 7
    },
    {
        id: 'prompt-2',
        title: 'Python Debugging Assistant',
        description: 'Helps identify and fix bugs in your Python code with clear explanations of the issues.',
        content: 'You are an expert Python developer with strong debugging skills. I\'ll share Python code that has bugs or isn\'t working as expected. Please:\n1. Identify all bugs and issues\n2. Explain why each is problematic\n3. Provide fixed code with comments\n4. Suggest best practices improvements\n\nHere\'s my code:\n```python\n[paste your code here]\n```',
        tags: ['Coding', 'Python'],
        favorite: false,
        dateCreated: '2025-04-02T14:30:00Z',
        usageCount: 12
    },
    {
        id: 'prompt-3',
        title: 'Creative Story Generator',
        description: 'Generates imaginative short stories based on your inputs and preferences.',
        content: 'Write a captivating short story (800-1000 words) based on these parameters:\n\nGenre: [genre]\nMain character: [brief description]\nSetting: [place/time]\nTheme: [central theme]\nPlot element to include: [specific element]\nTone: [mood/tone]\n\nMake the story engaging with a clear beginning, middle, and end. Include vivid sensory details and meaningful dialogue. The ending should be [type of ending].',
        tags: ['Creative', 'Writing'],
        favorite: true,
        dateCreated: '2025-04-03T09:15:00Z',
        usageCount: 18
    },
    {
        id: 'prompt-4',
        title: 'Academic Research Helper',
        description: 'Helps organize research, structure papers, and formulate strong arguments for academic writing.',
        content: 'As an experienced academic research assistant, help me organize my research on [topic]. I need assistance with:\n\n1. Creating a structured outline for a [length] paper\n2. Identifying key areas to focus my research\n3. Formulating a strong thesis statement\n4. Suggesting how to approach the literature review\n5. Developing compelling arguments\n\nMy current approach is [brief description]. My deadline is [date].',
        tags: ['Academic', 'Research'],
        favorite: false,
        dateCreated: '2025-04-05T16:45:00Z',
        usageCount: 5
    },
    {
        id: 'prompt-5',
        title: 'Product Description Writer',
        description: 'Creates compelling product descriptions that highlight benefits and features effectively.',
        content: 'Act as an expert e-commerce copywriter. Write a compelling product description for [product name] with these details:\n\nProduct: [basic details]\nKey features: [list 3-5 features]\nTarget audience: [demographic]\nPrice point: [price range]\nBrand voice: [tone/style]\n\nCreate a description with:\n- An attention-grabbing headline\n- 3-4 paragraphs of persuasive copy (150-200 words total)\n- Bullet points highlighting key features and benefits\n- A clear call-to-action',
        tags: ['Business', 'Marketing'],
        favorite: false,
        dateCreated: '2025-04-07T11:20:00Z',
        usageCount: 9
    },
    {
        id: 'prompt-6',
        title: 'Code Refactoring Guide',
        description: 'Helps optimize and improve existing code for better performance and readability.',
        content: 'You are a senior software engineer with expertise in clean code and refactoring. Review my [language] code below and:\n\n1. Identify code smells and potential issues\n2. Suggest refactoring strategies to improve:\n   - Readability\n   - Maintainability\n   - Performance\n   - Test coverage opportunities\n3. Provide refactored code examples with explanations\n4. Recommend design patterns if applicable\n\nHere\'s my code:\n```\n[paste code here]\n```',
        tags: ['Coding', 'Best Practices'],
        favorite: true,
        dateCreated: '2025-04-08T13:10:00Z',
        usageCount: 15
    }
];

// Main app class
class PromptLibrary {
    constructor() {
        this.prompts = [];
        this.filteredPrompts = [];
        this.activeFilter = 'All';
        this.activeView = 'All Prompts';
        this.sortOption = 'newest';
        this.searchTerm = '';
        
        // DOM Elements
        this.promptGrid = document.querySelector('.prompt-grid');
        this.modal = document.getElementById('promptModal');
        this.filterTags = document.querySelectorAll('.filter-tag');
        this.viewTabs = document.querySelectorAll('.view-tab');
        this.sortSelect = document.getElementById('sort-by');
        this.searchInput = document.querySelector('.search-input');
        this.searchButton = document.querySelector('.search-button');
        this.closeButton = document.querySelector('.close-button');
        
        this.initialize();
    }
    
    // Initialize the application
    initialize() {
        this.loadPromptsFromStorage();
        this.bindEventListeners();
        this.renderPrompts();
    }
    
    // Load prompts from localStorage, or use sample data if none exists
    loadPromptsFromStorage() {
        const savedPrompts = localStorage.getItem('promptLibrary');
        if (savedPrompts) {
            this.prompts = JSON.parse(savedPrompts);
        } else {
            // First time use - load sample prompts
            this.prompts = samplePrompts;
            this.savePromptsToStorage();
        }
        this.filteredPrompts = [...this.prompts];
    }
    
    // Save prompts to localStorage
    savePromptsToStorage() {
        localStorage.setItem('promptLibrary', JSON.stringify(this.prompts));
    }
    
    // Bind all event listeners
    bindEventListeners() {
        // Filter tag clicks
        this.filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.filterTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                this.activeFilter = tag.textContent;
                this.applyFilters();
            });
        });
        
        // View tab clicks
        this.viewTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.viewTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.activeView = tab.textContent;
                this.applyFilters();
            });
        });
        
        // Sort selection
        this.sortSelect.addEventListener('change', () => {
            this.sortOption = this.sortSelect.value;
            this.applyFilters();
        });
        
        // Search button click
        this.searchButton.addEventListener('click', () => {
            this.searchTerm = this.searchInput.value.trim();
            this.applyFilters();
        });
        
        // Search on Enter key
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchButton.click();
            }
        });
        
        // Close modal
        this.closeButton.addEventListener('click', () => {
            this.modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.modal.style.display = 'none';
            }
        });
        
        // Copy prompt button in modal
        document.querySelector('.primary-button').addEventListener('click', () => {
            const promptContent = document.querySelector('.prompt-detail-content').textContent;
            navigator.clipboard.writeText(promptContent)
                .then(() => {
                    const copyButton = document.querySelector('.primary-button');
                    const originalText = copyButton.textContent;
                    copyButton.textContent = 'Copied!';
                    
                    // Update usage count
                    const promptId = this.modal.dataset.promptId;
                    this.incrementUsageCount(promptId);
                    
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        });
    }
    
    // Apply all active filters, search, and sort options
    applyFilters() {
        let filtered = [...this.prompts];
        
        // Apply tag filter
        if (this.activeFilter !== 'All') {
            filtered = filtered.filter(prompt => 
                prompt.tags.includes(this.activeFilter)
            );
        }
        
        // Apply view filter (all or favorites)
        if (this.activeView === 'Favorites') {
            filtered = filtered.filter(prompt => prompt.favorite);
        }
        
        // Apply search term
        if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(prompt => 
                prompt.title.toLowerCase().includes(searchLower) || 
                prompt.description.toLowerCase().includes(searchLower) ||
                prompt.content.toLowerCase().includes(searchLower) ||
                prompt.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }
        
        // Apply sorting
        filtered = this.sortPrompts(filtered, this.sortOption);
        
        this.filteredPrompts = filtered;
        this.renderPrompts();
    }
    
    // Sort prompts based on selected option
    sortPrompts(prompts, sortOption) {
        switch(sortOption) {
            case 'newest':
                return [...prompts].sort((a, b) => 
                    new Date(b.dateCreated) - new Date(a.dateCreated)
                );
            case 'oldest':
                return [...prompts].sort((a, b) => 
                    new Date(a.dateCreated) - new Date(b.dateCreated)
                );
            case 'a-z':
                return [...prompts].sort((a, b) => 
                    a.title.localeCompare(b.title)
                );
            case 'most-used':
                return [...prompts].sort((a, b) => 
                    b.usageCount - a.usageCount
                );
            default:
                return prompts;
        }
    }
    
    // Render prompts to the DOM
    renderPrompts() {
        this.promptGrid.innerHTML = '';
        
        if (this.filteredPrompts.length === 0) {
            this.promptGrid.innerHTML = `
                <div class="no-results">
                    <p>No prompts found matching your criteria.</p>
                </div>
            `;
            return;
        }
        
        this.filteredPrompts.forEach(prompt => {
            const promptCard = document.createElement('div');
            promptCard.className = 'prompt-card';
            promptCard.dataset.id = prompt.id;
            
            // Create the tags HTML
            const tagsHtml = prompt.tags.map(tag => 
                `<span class="card-tag">${tag}</span>`
            ).join('');
            
            promptCard.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${prompt.title}</h3>
                    <div class="card-tags">
                        ${tagsHtml}
                    </div>
                    <button class="favorite-button ${prompt.favorite ? 'active' : ''}" 
                            style="color: ${prompt.favorite ? '#FFD700' : 'rgba(255,255,255,0.7)'}">★</button>
                </div>
                <div class="card-content">
                    <p class="card-description">${prompt.description}</p>
                    <div class="card-preview">${prompt.content}</div>
                </div>
            `;
            
            // Add event listener for card click
            promptCard.addEventListener('click', (e) => {
                if (!e.target.classList.contains('favorite-button')) {
                    this.openPromptDetail(prompt.id);
                }
            });
            
            // Add event listener for favorite button
            const favoriteButton = promptCard.querySelector('.favorite-button');
            favoriteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(prompt.id);
            });
            
            this.promptGrid.appendChild(promptCard);
        });
    }
    
    // Toggle favorite status for a prompt
    toggleFavorite(promptId) {
        const promptIndex = this.prompts.findIndex(p => p.id === promptId);
        if (promptIndex !== -1) {
            this.prompts[promptIndex].favorite = !this.prompts[promptIndex].favorite;
            this.savePromptsToStorage();
            this.applyFilters(); // Re-render with updated data
        }
    }
    
    // Increment usage count for a prompt
    incrementUsageCount(promptId) {
        const promptIndex = this.prompts.findIndex(p => p.id === promptId);
        if (promptIndex !== -1) {
            this.prompts[promptIndex].usageCount += 1;
            this.savePromptsToStorage();
            
            // Update the usage count in the modal if it's currently showing this prompt
            const usageElement = document.querySelector('.prompt-detail-meta span:nth-child(2)');
            if (usageElement) {
                usageElement.textContent = `Used: ${this.prompts[promptIndex].usageCount} times`;
            }
        }
    }
    
    // Open the detail modal for a prompt
    openPromptDetail(promptId) {
        const prompt = this.prompts.find(p => p.id === promptId);
        if (!prompt) return;
        
        // Format the date for display
        const dateCreated = new Date(prompt.dateCreated);
        const formattedDate = dateCreated.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Create the tags HTML
        const tagsHtml = prompt.tags.map(tag => 
            `<span class="prompt-detail-tag">${tag}</span>`
        ).join('');
        
        // Update the modal content
        document.querySelector('.prompt-detail-title').textContent = prompt.title;
        document.querySelector('.prompt-detail-tags').innerHTML = tagsHtml;
        document.querySelector('.prompt-detail-meta').innerHTML = `
            <span>Added: ${formattedDate}</span>
            <span>Used: ${prompt.usageCount} times</span>
        `;
        document.querySelector('.prompt-detail-description').innerHTML = `
            <p>${prompt.description}</p>
        `;
        document.querySelector('.prompt-detail-content').textContent = prompt.content;
        
        // Update the favorite button in the modal
        const favoriteDetailButton = document.querySelector('.favorite-detail');
        favoriteDetailButton.textContent = prompt.favorite ? '★ Favorite' : '☆ Add to Favorites';
        favoriteDetailButton.dataset.id = promptId;
        
        // Remove any existing event listeners
        const newFavoriteButton = favoriteDetailButton.cloneNode(true);
        favoriteDetailButton.parentNode.replaceChild(newFavoriteButton, favoriteDetailButton);
        
        // Add new event listener
        newFavoriteButton.addEventListener('click', () => {
            this.toggleFavorite(promptId);
            newFavoriteButton.textContent = prompt.favorite ? '☆ Add to Favorites' : '★ Favorite';
        });
        
        // Store the prompt ID in the modal for reference
        this.modal.dataset.promptId = promptId;
        
        // Display the modal
        this.modal.style.display = 'block';
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PromptLibrary();
});