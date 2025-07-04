export class TagExtractor {
  constructor() {
    // Predefined categories of tags to look for
    this.tagCategories = {
      interests: [
        'music', 'reading', 'books', 'movies', 'films', 'cooking', 'travel', 'photography', 
        'hiking', 'running', 'fitness', 'yoga', 'meditation', 'art', 'painting', 'drawing',
        'dancing', 'singing', 'gaming', 'sports', 'football', 'basketball', 'tennis',
        'swimming', 'cycling', 'climbing', 'skiing', 'surfing', 'netflix', 'anime',
        'podcasts', 'wine', 'coffee', 'tea', 'gardening', 'pets', 'dogs', 'cats',
        'fashion', 'shopping', 'makeup', 'skincare', 'technology', 'coding', 'programming'
      ],
      personality: [
        'funny', 'humor', 'humorous', 'witty', 'sarcastic', 'intelligent', 'smart',
        'kind', 'caring', 'compassionate', 'empathetic', 'loyal', 'honest', 'trustworthy',
        'adventurous', 'spontaneous', 'organized', 'ambitious', 'driven', 'creative',
        'artistic', 'introverted', 'extroverted', 'outgoing', 'social', 'quiet',
        'confident', 'humble', 'patient', 'optimistic', 'positive', 'romantic',
        'passionate', 'independent', 'family-oriented', 'career-focused', 'spiritual',
        'religious', 'philosophical', 'analytical', 'emotional', 'sensitive'
      ],
      values: [
        'family', 'career', 'education', 'learning', 'growth', 'health', 'wellness',
        'environment', 'sustainability', 'equality', 'justice', 'honesty', 'integrity',
        'loyalty', 'friendship', 'relationships', 'commitment', 'marriage', 'children',
        'kids', 'parenting', 'success', 'achievement', 'balance', 'work-life',
        'adventure', 'stability', 'security', 'freedom', 'independence', 'community',
        'volunteering', 'charity', 'giving', 'helping', 'supporting'
      ],
      lifestyle: [
        'active', 'athletic', 'healthy', 'vegan', 'vegetarian', 'foodie', 'party',
        'nightlife', 'homebody', 'cozy', 'minimalist', 'luxury', 'budget', 'frugal',
        'urban', 'city', 'rural', 'country', 'suburban', 'beach', 'mountains',
        'outdoors', 'nature', 'indoor', 'morning', 'night', 'early', 'late',
        'organized', 'messy', 'clean', 'neat', 'casual', 'formal', 'professional'
      ],
      relationship: [
        'serious', 'casual', 'long-term', 'short-term', 'commitment', 'marriage',
        'dating', 'friendship', 'companionship', 'partnership', 'romance', 'love',
        'affection', 'intimacy', 'connection', 'chemistry', 'compatibility',
        'understanding', 'communication', 'trust', 'respect', 'support', 'adventure',
        'fun', 'laughter', 'growth', 'learning', 'exploring', 'sharing'
      ]
    };

    // Combine all categories into one array for easier searching
    this.allTags = Object.values(this.tagCategories).flat();
  }

  extractTags(text) {
    if (!text || typeof text !== 'string') {
      return [];
    }

    // Convert to lowercase for matching
    const lowerText = text.toLowerCase();
    
    // Find matching tags
    const foundTags = [];
    
    this.allTags.forEach(tag => {
      // Check for exact word matches (with word boundaries)
      const regex = new RegExp(`\\b${tag}\\b`, 'i');
      if (regex.test(lowerText)) {
        foundTags.push(tag);
      }
    });

    // Also extract some common patterns and keywords
    const additionalTags = this.extractAdditionalTags(lowerText);
    foundTags.push(...additionalTags);

    // Remove duplicates and return
    return [...new Set(foundTags)];
  }

  extractAdditionalTags(text) {
    const additionalTags = [];

    // Age-related tags
    if (text.includes('young') || text.includes('youthful')) {
      additionalTags.push('young');
    }
    if (text.includes('mature') || text.includes('experienced')) {
      additionalTags.push('mature');
    }

    // Education-related tags
    if (text.includes('college') || text.includes('university') || text.includes('graduate')) {
      additionalTags.push('educated');
    }
    if (text.includes('professional') || text.includes('career')) {
      additionalTags.push('professional');
    }

    // Physical activity tags
    if (text.includes('gym') || text.includes('workout') || text.includes('exercise')) {
      additionalTags.push('fitness');
    }

    // Social tags
    if (text.includes('friends') || text.includes('social') || text.includes('people')) {
      additionalTags.push('social');
    }

    // Location tags
    if (text.includes('beach') || text.includes('ocean') || text.includes('sea')) {
      additionalTags.push('beach');
    }
    if (text.includes('mountain') || text.includes('hiking') || text.includes('nature')) {
      additionalTags.push('outdoors');
    }

    return additionalTags;
  }

  getTagsByCategory(tags) {
    const categorizedTags = {};
    
    Object.keys(this.tagCategories).forEach(category => {
      categorizedTags[category] = tags.filter(tag => 
        this.tagCategories[category].includes(tag)
      );
    });

    return categorizedTags;
  }

  getTagWeight(tag) {
    // Return a weight based on how specific/important the tag is
    // This could be used for matching algorithms
    const highValueTags = ['marriage', 'children', 'family', 'career', 'education'];
    const mediumValueTags = ['travel', 'fitness', 'music', 'reading', 'cooking'];
    
    if (highValueTags.includes(tag)) return 3;
    if (mediumValueTags.includes(tag)) return 2;
    return 1;
  }
} 