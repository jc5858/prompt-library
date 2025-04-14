// Initial sample data (will be replaced with localStorage in Phase 3)
const samplePrompts = [
    {
        id: 'prompt-1',
        title: 'Website Redesign Expert',
        description: 'Perfect for getting detailed website redesign suggestions with a focus on UX and conversion optimization.',
        content: `Act as a senior UX designer with 15+ years of experience in conversion optimization. Review my website [URL] and suggest improvements focusing on: user flow, call-to-actions, visual hierarchy, and mobile responsiveness. Include specific examples and mockup descriptions.`,
        tags: ['Business', 'Design'],
        favorite: false,
        dateCreated: '2025-04-01T10:30:00Z',
        dateModified: '2025-04-01T10:30:00Z',
        useCount: 5
    },
    {
        id: 'prompt-2',
        title: 'Python Debugging Assistant',
        description: 'Helps identify and fix bugs in your Python code with clear explanations of the issues.',
        content: `You are an expert Python developer with strong debugging skills. I'll share Python code that has bugs or isn't working as expected. Please:
1. Identify all bugs and issues
2. Explain why each is problematic
3. Provide fixed code with comments
4. Suggest best practices improvements

Here's my code:
\`\`\`python
[paste your code here]
\`\`\``,
        tags: ['Coding', 'Python'],
        favorite: false,
        dateCreated: '2025-04-02T14:15:00Z',
        dateModified: '2025-04-02T14:15:00Z',
        useCount: 8
    },
    {
        id: 'prompt-3',
        title: 'Creative Story Generator',
        description: 'Generates imaginative short stories based on your inputs and preferences.',
        content: `Write a captivating short story (800-1000 words) based on these parameters:

Genre: [genre]
Main character: [brief description]
Setting: [place/time]
Theme: [central theme]
Plot element to include: [specific element]
Tone: [mood/tone]

Make the story engaging with a clear beginning, middle, and end. Include vivid sensory details and meaningful dialogue. The ending should be [type of ending].`,
        tags: ['Creative', 'Writing'],
        favorite: true,
        dateCreated: '2025-04-03T09:45:00Z',
        dateModified: '2025-04-03T09:45:00Z',
        useCount: 12
    },
    {
        id: 'prompt-4',
        title: 'Academic Research Helper',
        description: 'Helps organize research, structure papers, and formulate strong arguments for academic writing.',
        content: `As an experienced academic research assistant, help me organize my research on [topic]. I need assistance with:

1. Creating a structured outline for a [length] paper
2. Identifying key areas to focus my research
3. Formulating a strong thesis statement
4. Suggesting how to approach the literature review
5. Developing compelling arguments

My current approach is [brief description]. My deadline is [date].`,
        tags: ['Academic', 'Research'],
        favorite: false,
        dateCreated: '2025-04-04T16:20:00Z',
        dateModified: '2025-04-04T16:20:00Z',
        useCount: 3
    },
    {
        id: 'prompt-5',
        title: 'Product Description Writer',
        description: 'Creates compelling product descriptions that highlight benefits and features effectively.',
        content: `Act as an expert e-commerce copywriter. Write a compelling product description for [product name] with these details:

Product: [basic details]
Key features: [list 3-5 features]
Target audience: [demographic]
Price point: [price range]
Brand voice: [tone/style]

Create a description with:
- An attention-grabbing headline
- 3-4 paragraphs of persuasive copy (150-200 words total)
- Bullet points highlighting key features and benefits
- A clear call-to-action`,
        tags: ['Business', 'Marketing'],
        favorite: false,
        dateCreated: '2025-04-05T11:10:00Z',
        dateModified: '2025-04-05T11:10:00Z',
        useCount: 7
    },
    {
        id: 'prompt-6',
        title: 'Code Refactoring Guide',
        description: 'Helps optimize and improve existing code for better performance and readability.',
        content: `You are a senior software engineer with expertise in clean code and refactoring. Review my [language] code below and:

1. Identify code smells and potential issues
2. Suggest refactoring strategies to improve:
   - Readability
   - Maintainability
   - Performance
   - Test coverage opportunities
3. Provide refactored code examples with explanations
4. Recommend design patterns if applicable

Here's my code:
\`\`\`
[paste code here]
\`\`\``,
        tags: ['Coding', 'Best Practices'],
        favorite: true,
        dateCreated: '2025-04-06T13:25:00Z',
        dateModified: '2025-04-06T13:25:00Z',
        useCount: 10
    }
];

// Get all unique tags from the prompts
function getAllTags() {
    const tagSet = new Set();
    samplePrompts.forEach(prompt => {
        prompt.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
}