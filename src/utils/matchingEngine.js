export class MatchingEngine {
  constructor() {
    this.weights = {
      sharedInterests: 0.4,
      personalityMatch: 0.3,
      valueAlignment: 0.2,
      lifestyleCompatibility: 0.1
    };
  }

  // Filter users based on gender and sexuality preferences
  filterByGenderAndSexuality(userProfile, candidates) {
    // If user is looking for friends only or both, show all genders
    if (userProfile.matchPreferences === 'friends' || userProfile.matchPreferences === 'both') {
      return candidates;
    }

    // If user is looking for dating only, filter by gender based on sexuality
    if (userProfile.matchPreferences === 'dating') {
      const userGender = userProfile.gender?.toLowerCase();
      const userSexuality = userProfile.sexuality?.toLowerCase();

      return candidates.filter(candidate => {
        const candidateGender = candidate.gender?.toLowerCase();
        
        // Handle different sexualities
        switch (userSexuality) {
          case 'straight':
            // Straight users prefer opposite gender
            if (userGender === 'man') return candidateGender === 'woman';
            if (userGender === 'woman') return candidateGender === 'man';
            // For non-binary users who are straight, show all genders
            return true;
          
          case 'gay':
          case 'lesbian':
            // Gay/lesbian users prefer same gender
            return candidateGender === userGender;
          
          case 'bisexual':
          case 'pansexual':
          case 'queer':
            // Bisexual/pansexual/queer users can match with any gender
            return true;
          
          default:
            // For unknown sexualities, show all genders
            return true;
        }
      });
    }

    // Default: return all candidates
    return candidates;
  }

  // New method for search functionality
  findMatchesFromSearchTags(searchTags, allUsers, excludeUserId = null, userProfile = null) {
    if (!searchTags || !allUsers || allUsers.length === 0) {
      return [];
    }

    // Filter out the current user if specified
    let candidateUsers = excludeUserId 
      ? allUsers.filter(user => user.id !== excludeUserId)
      : allUsers;

    // Apply gender and sexuality filtering if userProfile is provided
    if (userProfile) {
      candidateUsers = this.filterByGenderAndSexuality(userProfile, candidateUsers);
    }

    // Extract tag names from search tags
    const searchTagNames = searchTags.map(tag => tag.name);

    // Calculate match scores for each user
    const matchesWithScores = candidateUsers.map(user => {
      const matchScore = this.calculateSearchMatchScore(searchTagNames, user);
      const sharedTags = this.findSharedTagsWithSearch(searchTagNames, user);
      
      return {
        user,
        compatibility: Math.round(matchScore * 100),
        sharedTags,
        matchScore
      };
    });

    // Sort by match score (highest first) and return matches
    return matchesWithScores
      .filter(match => match.matchScore > 0.1) // Only return matches with some compatibility
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 50); // Return top 50 search results
  }

  calculateSearchMatchScore(searchTagNames, user) {
    if (!searchTagNames || !user || searchTagNames.length === 0) {
      return 0;
    }

    // Get all user tags (profile + preferences)
    const userAllTags = [
      ...(user.profileTags || []),
      ...(user.preferenceTags || []),
      ...(user.selfTags || [])
    ];

    // Calculate how many search tags match user's profile
    const matchingTags = searchTagNames.filter(searchTag => 
      userAllTags.some(userTag => userTag.toLowerCase().includes(searchTag.toLowerCase()))
    );

    // Base score from tag matches
    const tagMatchScore = matchingTags.length / searchTagNames.length;

    // Bonus for having many matching tags
    const bonusMultiplier = 1 + (matchingTags.length * 0.1);

    // Additional scoring based on user's description matching search intent
    const descriptionScore = this.calculateDescriptionMatch(searchTagNames, user);

    // Combine scores
    const finalScore = (tagMatchScore * 0.7) + (descriptionScore * 0.3);

    return Math.min(finalScore * bonusMultiplier, 1);
  }

  calculateDescriptionMatch(searchTagNames, user) {
    if (!user.description && !user.lookingFor) {
      return 0;
    }

    const userText = `${user.description || ''} ${user.lookingFor || ''}`.toLowerCase();
    const matchingKeywords = searchTagNames.filter(tag => 
      userText.includes(tag.toLowerCase())
    );

    return matchingKeywords.length / searchTagNames.length;
  }

  findSharedTagsWithSearch(searchTagNames, user) {
    const userAllTags = [
      ...(user.profileTags || []),
      ...(user.preferenceTags || []),
      ...(user.selfTags || [])
    ];

    const sharedTags = searchTagNames.filter(searchTag => 
      userAllTags.some(userTag => userTag.toLowerCase().includes(searchTag.toLowerCase()))
    );

    return [...new Set(sharedTags)];
  }

  findMatches(userProfile, allUsers) {
    if (!userProfile || !allUsers || allUsers.length === 0) {
      return [];
    }

    // Filter out the current user
    let otherUsers = allUsers.filter(user => user.id !== userProfile.id);
    
    // Apply gender and sexuality filtering
    otherUsers = this.filterByGenderAndSexuality(userProfile, otherUsers);
    
    // Calculate match scores for each user
    const matchesWithScores = otherUsers.map(otherUser => {
      const matchScore = this.calculateMatchScore(userProfile, otherUser);
      const sharedTags = this.findSharedTags(userProfile, otherUser);
      
      return {
        ...otherUser,
        matchScore,
        sharedTags
      };
    });

    // Sort by match score (highest first) and return top matches
    return matchesWithScores
      .filter(match => match.matchScore > 0.1) // Only return matches with some compatibility
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20); // Return top 20 matches
  }

  calculateMatchScore(user1, user2) {
    // Calculate how well user1's preferences match user2's self-description
    const user1WantsUser2 = this.calculateDirectionalMatch(user1.preferenceTags, user2.selfTags);
    
    // Calculate how well user2's preferences match user1's self-description
    const user2WantsUser1 = this.calculateDirectionalMatch(user2.preferenceTags, user1.selfTags);
    
    // Calculate shared interests between their self-descriptions
    const sharedInterests = this.calculateSharedInterests(user1.selfTags, user2.selfTags);
    
    // Calculate mutual compatibility (average of both directional matches)
    const mutualCompatibility = (user1WantsUser2 + user2WantsUser1) / 2;
    
    // Combine scores with weights
    const finalScore = (mutualCompatibility * 0.7) + (sharedInterests * 0.3);
    
    return Math.min(finalScore, 1); // Cap at 1.0
  }

  calculateDirectionalMatch(preferenceTags, selfTags) {
    if (!preferenceTags || !selfTags || preferenceTags.length === 0 || selfTags.length === 0) {
      return 0;
    }

    const sharedTags = preferenceTags.filter(tag => selfTags.includes(tag));
    const matchRatio = sharedTags.length / preferenceTags.length;
    
    // Bonus for having many shared tags
    const bonusMultiplier = 1 + (sharedTags.length * 0.1);
    
    return Math.min(matchRatio * bonusMultiplier, 1);
  }

  calculateSharedInterests(selfTags1, selfTags2) {
    if (!selfTags1 || !selfTags2 || selfTags1.length === 0 || selfTags2.length === 0) {
      return 0;
    }

    const sharedTags = selfTags1.filter(tag => selfTags2.includes(tag));
    const totalUniqueTags = new Set([...selfTags1, ...selfTags2]).size;
    
    return sharedTags.length / totalUniqueTags;
  }

  findSharedTags(user1, user2) {
    const user1AllTags = [...user1.selfTags, ...user1.preferenceTags];
    const user2AllTags = [...user2.selfTags, ...user2.preferenceTags];
    
    const sharedTags = user1AllTags.filter(tag => user2AllTags.includes(tag));
    
    // Remove duplicates and return
    return [...new Set(sharedTags)];
  }

  getMatchReasons(user1, user2) {
    const reasons = [];
    
    // Check for shared interests
    const sharedInterests = this.findSharedTags(user1, user2);
    if (sharedInterests.length > 0) {
      reasons.push(`You both share interests in: ${sharedInterests.slice(0, 3).join(', ')}`);
    }
    
    // Check for preference matches
    const user1WantsUser2Tags = user1.preferenceTags.filter(tag => user2.selfTags.includes(tag));
    if (user1WantsUser2Tags.length > 0) {
      reasons.push(`They have qualities you're looking for: ${user1WantsUser2Tags.slice(0, 2).join(', ')}`);
    }
    
    const user2WantsUser1Tags = user2.preferenceTags.filter(tag => user1.selfTags.includes(tag));
    if (user2WantsUser1Tags.length > 0) {
      reasons.push(`You have qualities they're looking for: ${user2WantsUser1Tags.slice(0, 2).join(', ')}`);
    }
    
    return reasons;
  }

  // Advanced matching features for future enhancement
  calculatePersonalityCompatibility(user1Tags, user2Tags) {
    const personalityTags = [
      'introverted', 'extroverted', 'adventurous', 'homebody', 'spontaneous', 'organized',
      'creative', 'analytical', 'emotional', 'logical', 'optimistic', 'realistic'
    ];
    
    const user1PersonalityTags = user1Tags.filter(tag => personalityTags.includes(tag));
    const user2PersonalityTags = user2Tags.filter(tag => personalityTags.includes(tag));
    
    // Some personality traits complement each other rather than match exactly
    const complementaryPairs = [
      ['introverted', 'extroverted'],
      ['creative', 'analytical'],
      ['emotional', 'logical'],
      ['spontaneous', 'organized']
    ];
    
    let compatibilityScore = 0;
    
    // Check for complementary traits
    complementaryPairs.forEach(pair => {
      if ((user1PersonalityTags.includes(pair[0]) && user2PersonalityTags.includes(pair[1])) ||
          (user1PersonalityTags.includes(pair[1]) && user2PersonalityTags.includes(pair[0]))) {
        compatibilityScore += 0.2;
      }
    });
    
    // Check for shared personality traits
    const sharedPersonalityTraits = user1PersonalityTags.filter(tag => user2PersonalityTags.includes(tag));
    compatibilityScore += sharedPersonalityTraits.length * 0.1;
    
    return Math.min(compatibilityScore, 1);
  }
}

// Create a singleton instance for exports
const matchingEngine = new MatchingEngine();

// Export standalone functions for easy importing
export const findMatches = (currentUser, allUsers, searchTags = null, userProfile = null) => {
  if (searchTags && searchTags.length > 0) {
    // Use search functionality
    return matchingEngine.findMatchesFromSearchTags(searchTags, allUsers, currentUser?.id, userProfile || currentUser);
  } else {
    // Use regular matching
    return matchingEngine.findMatches(currentUser, allUsers);
  }
};

export const calculateMatchScore = (user1, user2) => {
  return matchingEngine.calculateMatchScore(user1, user2);
};

export const getMatchReasons = (user1, user2) => {
  return matchingEngine.getMatchReasons(user1, user2);
};

export default matchingEngine;