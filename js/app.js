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
    const promptGrid = document.querySelector('.prompt-grid');
    
    // Data structure to hold our prompts
    // In a future phase, this will be loaded from localStorage
    const prompts = [
        {
            id: 'website-redesign',
            title: 'Website Redesign Expert',
            description: 'Perfect for getting detailed website redesign suggestions with a focus on UX and conversion optimization.',
            content: 'Act as a senior UX designer with 15+ years of experience in conversion optimization. Review my website [URL] and suggest improvements focusing on: user flow, call-to-actions, visual hierarchy, and mobile responsiveness. Include specific examples and mockup descriptions.',
            tags: ['Business', 'Design'],
            favorite: false,
            dateCreated: '2025-04-05T10:30:00Z',
            dateModified: '2025-04-05T10:30:00Z'
        },
        {
            id: 'python-debugging',
            title: 'Python Debugging Assistant',
            description: 'Helps identify and fix bugs in your Python code with clear explanations of the issues.',
            content: 'You are an expert Python developer with strong debugging skills. I\'ll share Python code that has bugs or isn\'t working as expected. Please:\n1. Identify all bugs and issues\n2. Explain why each is problematic\n3. Provide fixed code with comments\n4. Suggest best practices improvements\n\nHere\'s my code:\n```python\n[paste your code here]\n```',
            tags: ['Coding', 'Python'],
            favorite: false,
            dateCreated: '2025-04-06T14:15:00Z',
            dateModified: '2025-04-06T14:15:00Z'
        },
        {
            id: 'creative-story',
            title: 'Creative Story Generator',
            description: 'Generates imaginative short stories based on your inputs and preferences.',
            content: 'Write a captivating short story (800-1000 words) based on these parameters:\n\nGenre: [genre]\nMain character: [brief description]\nSetting: [place/time]\nTheme: [central theme]\nPlot element to include: [specific element]\nTone: [mood/tone]\n\nMake the story engaging with a clear beginning, middle, and end. Include vivid sensory details and meaningful dialogue. The ending should be [type of ending].',
            tags: ['Creative', 'Writing'],
            favorite: true,
            dateCreated: '2025-04-07T09:45:00Z',
            dateModified: '2025-04-07T09:45:00Z'
        },
        {
            id: 'academic-research',
            title: 'Academic Research Helper',
            description: 'Helps organize research, structure papers, and formulate strong arguments for academic writing.',
            content: 'As an experienced academic research assistant, help me organize my research on [topic]. I need assistance with:\n\n1. Creating a structured outline for a [length] paper\n2. Identifying key areas to focus my research\n3. Formulating a strong thesis statement\n4. Suggesting how to approach the literature review\n5. Developing compelling arguments\n\nMy current approach is [brief description]. My deadline is [date].',
            tags: ['Academic', 'Research'],
            favorite: false,
            dateCreated: '2025-04-08T16:20:00Z',
            dateModified: '2025-04-08T16:20:00Z'
        },
        {
            id: 'product-description',
            title: 'Product Description Writer',
            description: 'Creates compelling product descriptions that highlight benefits and features effectively.',
            content: 'Act as an expert e-commerce copywriter. Write a compelling product description for [product name] with these details:\n\nProduct: [basic details]\nKey features: [list 3-5 features]\nTarget audience: [demographic]\nPrice point: [price range]\nBrand voice: [tone/style]\n\nCreate a description with:\n- An attention-grabbing headline\n- 3-4 paragraphs of persuasive copy (150-200 words total)\n- Bullet points highlighting key features and benefits\n- A clear call-to-action',
            tags: ['Business', 'Marketing'],
            favorite: false,
            dateCreated: '2025-04-09T11:10:00Z',
            dateModified: '2025-04-09T11:10:00Z'
        },
        {
            id: 'code-refactoring',
            title: 'Code Refactoring Guide',
            description: 'Helps optimize and improve existing code for better performance and readability.',
            content: 'You are a senior software engineer with expertise in clean code and refactoring. Review my [language] code below and:\n\n1. Identify code smells and potential issues\n2. Suggest refactoring strategies to improve:\n   - Readability\n   - Maintainability\n   - Performance\n   - Test coverage opportunities\n3. Provide refactored code examples with explanations\n4. Recommend design patterns if applicable\n\nHere\'s my code:\n```\n[paste code here]\n```',
            tags: ['Coding', 'Best Practices'],
            favorite: true,
            dateCreated: '2025-04-10T13:25:00Z',
            dateModified: '2025-04-10T13:25:00Z'
        }
    ];
    
    // Current filter and view state
    let currentState = {
        activeFilter: 'All',
        activeView: 'All Prompts',
        searchTerm: '',
        sortBy: 'newest'
    };
    
    // Function to render prompts based on current state
    function renderPrompts() {
        // Clear the existing grid
        promptGrid.innerHTML = '';
        
        // Filter prompts based on the current state
        let filteredPrompts = prompts.filter(prompt => {
            // Filter by tag
            const tagMatch = currentState.activeFilter === 'All' || 
                            prompt.tags.includes(currentState.activeFilter);
            
            // Filter by view (All or Favorites)
            const viewMatch = currentState.activeView === 'All Prompts' || 
                            (currentState.activeView === 'Favorites' && prompt.favorite);
            
            // Filter by search term
            const searchMatch = currentState.searchTerm === '' ||
                            prompt.title.toLowerCase().includes(currentState.searchTerm.toLowerCase()) ||
                            prompt.description.toLowerCase().includes(currentState.searchTerm.toLowerCase()) ||
                            prompt.content.toLowerCase().includes(currentState.searchTerm.toLowerCase()) ||
                            prompt.tags.some(tag => tag.toLowerCase().includes(currentState.searchTerm.toLowerCase()));
            
            return tagMatch && viewMatch && searchMatch;
        });
        
        // Sort prompts
        filteredPrompts = sortPrompts(filteredPrompts, currentState.sortBy);
        
        // Render each prompt
        filteredPrompts.forEach(prompt => {
            const promptCard = createPromptCard(prompt);
            promptGrid.appendChild(promptCard);
        });
        
        // Reattach event listeners to new cards
        attachCardEventListeners();
    }
    
    // Sort prompts based on selected criteria
    function sortPrompts(prompts, sortBy) {
        const sortedPrompts = [...prompts];
        
        switch (sortBy) {
            case 'newest':
                return sortedPrompts.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
            case 'oldest':
                return sortedPrompts.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
            case 'a-z':
                return sortedPrompts.sort((a, b) => a.title.localeCompare(b.title));
            case 'most-used':
                // Most used would require usage tracking, for now it's just alphabetical
                return sortedPrompts.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return sortedPrompts;
        }
    }
    
    // Create a prompt card element
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
                        style="${prompt.favorite ? 'color: #FFD700;' : ''}">★</button>
            </div>
            <div class="card-content">
                <p class="card-description">${prompt.description}</p>
                <div class="card-preview">${prompt.content}</div>
            </div>
        `;
        
        return card;
    }
    
    // Attach event listeners to prompt cards
    function attachCardEventListeners() {
        const promptCards = document.querySelectorAll('.prompt-card');
        const favoriteButtons = document.querySelectorAll('.favorite-button');
        
        // Open modal when clicking on a prompt card (except when clicking favorite button)
        promptCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('favorite-button')) {
                    const promptId = card.dataset.id;
                    const prompt = prompts.find(p => p.id === promptId);
                    if (prompt) {
                        openPromptModal(prompt);
                    }
                }
            });
        });
        
        // Handle favorite button clicks
        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening the modal
                const card = button.closest('.prompt-card');
                const promptId = card.dataset.id;
                const prompt = prompts.find(p => p.id === promptId);
                
                if (prompt) {
                    prompt.favorite = !prompt.favorite;
                    button.classList.toggle('active');
                    
                    if (prompt.favorite) {
                        button.style.color = '#FFD700';
                    } else {
                        button.style.color = 'rgba(255,255,255,0.7)';
                    }
                    
                    // If we're in favorites view and we just unfavorited something, re-render
                    if (currentState.activeView === 'Favorites' && !prompt.favorite) {
                        renderPrompts();
                    }
                }
            });
        });
    }
    
    // Open modal with prompt details
    function openPromptModal(prompt) {
        const modalTitle = document.querySelector('.prompt-detail-title');
        const modalTags = document.querySelector('.prompt-detail-tags');
        const modalMeta = document.querySelector('.prompt-detail-meta');
        const modalDescription = document.querySelector('.prompt-detail-description');
        const modalContent = document.querySelector('.prompt-detail-content');
        const favoriteButton = document.querySelector('.favorite-detail');
        
        // Set modal content
        modalTitle.textContent = prompt.title;
        
        // Set tags
        modalTags.innerHTML = '';
        prompt.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'prompt-detail-tag';
            tagEl.textContent = tag;
            modalTags.appendChild(tagEl);
        });
        
        // Set metadata
        const createdDate = new Date(prompt.dateCreated).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        modalMeta.innerHTML = `<span>Added: ${createdDate}</span>`;
        
        // Set description
        modalDescription.innerHTML = `<p>${prompt.description}</p>`;
        
        // Set content
        modalContent.textContent = prompt.content;
        
        // Set favorite button state
        favoriteButton.textContent = prompt.favorite ? '★ Favorite' : '☆ Add to Favorites';
        
        // Update favorite button click handler
        favoriteButton.onclick = () => {
            prompt.favorite = !prompt.favorite;
            favoriteButton.textContent = prompt.favorite ? '★ Favorite' : '☆ Add to Favorites';
            
            // Update the card in the background
            renderPrompts();
        };
        
        // Display the modal
        modal.style.display = 'block';
    }
    
    // Handle filter tag selection
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active class from all tags
            filterTags.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tag
            tag.classList.add('active');
            
            // Update current state and re-render
            currentState.activeFilter = tag.textContent;
            renderPrompts();
        });
    });
    
    // Handle view tab selection
    viewTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            viewTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Update current state and re-render
            currentState.activeView = tab.textContent;
            renderPrompts();
        });
    });
    
    // Handle sort selection
    sortSelect.addEventListener('change', () => {
        currentState.sortBy = sortSelect.value;
        renderPrompts();
    });
    
    // Handle search
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        currentState.searchTerm = searchTerm;
        renderPrompts();
    });
    
    // Also trigger search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
    
    // Clear search when the input is cleared
    searchInput.addEventListener('input', () => {
        if (searchInput.value === '' && currentState.searchTerm !== '') {
            currentState.searchTerm = '';
            renderPrompts();
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
    
    // Initial render
    renderPrompts();
});