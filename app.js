/**
 * PromptVault - Phase 1
 * Basic static site with minimal interactivity
 * This is the first phase implementation with UI interactions only
 * Future phases will add data persistence and CRUD operations
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const modal = document.getElementById('promptModal');
    const promptCards = document.querySelectorAll('.prompt-card');
    const closeButton = document.querySelector('.close-button');
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    const filterTags = document.querySelectorAll('.filter-tag');
    const viewTabs = document.querySelectorAll('.view-tab');
    const copyButton = document.querySelector('.primary-button');
    
    // Open modal when clicking on a prompt card (except when clicking favorite button)
    promptCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-button')) {
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
    favoriteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent opening the modal
            
            // Toggle star icon
            const starIcon = button.querySelector('i');
            if (starIcon.classList.contains('far')) {
                starIcon.classList.remove('far');
                starIcon.classList.add('fas');
                button.classList.add('favorite-active');
            } else {
                starIcon.classList.remove('fas');
                starIcon.classList.add('far');
                button.classList.remove('favorite-active');
            }
        });
    });
    
    // Handle filter tag clicks
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active class from all tags
            filterTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            tag.classList.add('active');
            
            // In Phase 1, we don't implement actual filtering yet
            console.log(`Filter selected: ${tag.textContent}`);
        });
    });
    
    // Handle view tab clicks
    viewTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            viewTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // In Phase 1, we don't implement actual view switching yet
            console.log(`View selected: ${tab.textContent}`);
        });
    });
    
    // Handle copy button in modal
    copyButton.addEventListener('click', () => {
        const promptContent = document.querySelector('.prompt-detail-content').textContent;
        
        // Create a temporary textarea element to copy the text
        const textarea = document.createElement('textarea');
        textarea.value = promptContent;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            // Copy the text
            document.execCommand('copy');
            
            // Show feedback (in a production app, you'd want a proper toast notification)
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            // Reset button text after 2 seconds
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
        
        // Remove the temporary textarea
        document.body.removeChild(textarea);
    });
    
    // For Phase 1, we're not implementing these functions yet, but adding the listeners
    // for UI consistency
    
    // Add Prompt Button
    const addPromptButton = document.querySelector('.add-prompt-button');
    addPromptButton.addEventListener('click', () => {
        console.log('Add new prompt clicked (not implemented in Phase 1)');
        alert('Adding new prompts will be available in the next version!');
    });
    
    // Edit Button
    const editButton = document.querySelector('.secondary-button:nth-child(2)');
    editButton.addEventListener('click', () => {
        console.log('Edit prompt clicked (not implemented in Phase 1)');
        alert('Editing prompts will be available in the next version!');
    });
    
    // Delete Button
    const deleteButton = document.querySelector('.secondary-button:nth-child(3)');
    deleteButton.addEventListener('click', () => {
        console.log('Delete prompt clicked (not implemented in Phase 1)');
        alert('Deleting prompts will be available in the next version!');
    });
    
    // Favorite Button in Detail View
    const favoriteDetailButton = document.querySelector('.favorite-detail');
    favoriteDetailButton.addEventListener('click', () => {
        const starIcon = favoriteDetailButton.querySelector('i');
        if (starIcon.classList.contains('far')) {
            starIcon.classList.remove('far');
            starIcon.classList.add('fas');
            favoriteDetailButton.innerHTML = '<i class="fas fa-star"></i> Favorited';
        } else {
            starIcon.classList.remove('fas');
            starIcon.classList.add('far');
            favoriteDetailButton.innerHTML = '<i class="far fa-star"></i> Favorite';
        }
    });
