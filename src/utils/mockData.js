import { TagExtractor } from './tagExtractor';

export class MockDataGenerator {
  constructor() {
    this.tagExtractor = new TagExtractor();
    this.mockProfiles = [
      {
        name: "Sarah",
        selfDescription: "I'm a creative person who loves art and photography. I enjoy hiking on weekends and I'm passionate about cooking new recipes. I'm introverted but love meaningful conversations. I value honesty and kindness above all else. I'm looking for someone who shares my love for adventure and creativity.",
        lookingFor: "I'm looking for someone who is adventurous, creative, and values deep conversations. Someone who enjoys outdoor activities like hiking and is passionate about their hobbies. I'd love to find someone who is honest, kind, and has a good sense of humor."
      },
      {
        name: "Michael",
        selfDescription: "I'm a software engineer who loves technology and coding. In my free time, I enjoy reading books, playing video games, and watching movies. I'm pretty introverted and prefer quiet nights in over parties. I'm ambitious about my career but also value work-life balance. I love learning new things and I'm quite analytical.",
        lookingFor: "I'm looking for someone who is intelligent, understanding, and shares some of my interests. Someone who appreciates quiet time together and doesn't mind staying in. I'd love to find someone who is supportive of my career goals and enjoys intellectual conversations."
      },
      {
        name: "Emma",
        selfDescription: "I'm very outgoing and social - I love meeting new people and trying new experiences. I'm into fitness and go to the gym regularly. I enjoy traveling and have been to over 15 countries. I'm optimistic and always try to see the positive side of things. I love dancing, music, and going out with friends. Family is very important to me.",
        lookingFor: "I'm looking for someone who is adventurous and loves to travel. Someone who is social and enjoys going out but also values family time. I want someone who is active and takes care of their health. A positive attitude and good sense of humor are must-haves for me."
      },
      {
        name: "David",
        selfDescription: "I'm a teacher who is passionate about education and helping others learn. I enjoy reading, writing, and intellectual discussions. I'm quite philosophical and enjoy pondering life's big questions. I love coffee, books, and spending time in nature. I'm patient, empathetic, and believe in making a positive impact on the world.",
        lookingFor: "I'm looking for someone who is thoughtful, compassionate, and intellectually curious. Someone who enjoys deep conversations and shares my passion for learning. I'd love to find someone who cares about making a difference in the world and values personal growth."
      },
      {
        name: "Jessica",
        selfDescription: "I'm a yoga instructor who is deeply spiritual and values mindfulness. I love meditation, healthy living, and being in nature. I'm vegetarian and care deeply about the environment. I enjoy art, music, and creative expression. I'm peaceful, patient, and believe in living authentically. I love animals and have two cats.",
        lookingFor: "I'm looking for someone who shares my values about healthy living and spirituality. Someone who is mindful, peaceful, and cares about the environment. I'd love to find someone who enjoys nature, meditation, and living a balanced life. Animal lovers are a plus!"
      },
      {
        name: "Alex",
        selfDescription: "I'm a marketing professional who loves being creative at work. I enjoy sports, especially football and basketball. I'm competitive but also team-oriented. I love trying new restaurants and exploring the city. I'm confident, ambitious, and always up for a challenge. I value loyalty and honesty in relationships.",
        lookingFor: "I'm looking for someone who is ambitious and driven like me. Someone who enjoys sports or at least doesn't mind watching games. I'd love to find someone who is confident, independent, and shares my love for trying new things. Loyalty and trustworthiness are very important to me."
      },
      {
        name: "Olivia",
        selfDescription: "I'm a nurse who is very caring and compassionate. I love helping people and making a difference in their lives. In my free time, I enjoy gardening, cooking, and spending time with family. I'm organized, responsible, and value stability. I enjoy quiet evenings at home but also like occasional adventures. I'm looking for something serious and long-term.",
        lookingFor: "I'm looking for someone who is ready for a serious relationship and values commitment. Someone who is kind, responsible, and family-oriented. I'd love to find someone who appreciates the simple things in life and enjoys creating a warm home together. Honesty and communication are key for me."
      },
      {
        name: "Ryan",
        selfDescription: "I'm a freelance graphic designer who loves art and creativity. I enjoy photography, painting, and exploring new design trends. I'm pretty laid-back and go with the flow. I love music festivals, concerts, and discovering new artists. I'm independent, creative, and value freedom in my life. I enjoy traveling and experiencing different cultures.",
        lookingFor: "I'm looking for someone who is creative and open-minded. Someone who enjoys art, music, and cultural experiences. I'd love to find someone who is independent but also wants to share adventures together. Creativity and a free spirit are very attractive to me."
      },
      {
        name: "Sophia",
        selfDescription: "I'm a financial advisor who is very organized and detail-oriented. I enjoy planning and setting goals. I love fitness and maintain a healthy lifestyle. I'm disciplined about my routines but also enjoy relaxing with wine and good food. I'm looking for stability and someone who shares my professional ambitions. I value trust and communication.",
        lookingFor: "I'm looking for someone who is financially responsible and career-focused. Someone who takes care of their health and has their life together. I'd love to find someone who is reliable, trustworthy, and shares my goals for the future. Professional ambition and stability are important to me."
      },
      {
        name: "James",
        selfDescription: "I'm a chef who is passionate about food and cooking. I love experimenting with new recipes and flavors. I'm also into wine and enjoy learning about different varieties. I'm creative, detail-oriented, and perfectionist about my work. I enjoy hosting dinner parties and bringing people together through food. I'm romantic and believe in grand gestures.",
        lookingFor: "I'm looking for someone who appreciates good food and enjoys trying new cuisines. Someone who doesn't mind being spoiled with home-cooked meals. I'd love to find someone who is romantic, appreciates the finer things in life, and enjoys intimate dinners together. A good appetite is definitely a plus!"
      },
      {
        name: "Maya",
        selfDescription: "I'm a environmental scientist who is passionate about sustainability and protecting our planet. I love hiking, camping, and spending time outdoors. I'm minimalist in my lifestyle and believe in living simply. I enjoy rock climbing, yoga, and meditation. I'm independent, strong-willed, and value authenticity. I care deeply about social justice and making a positive impact.",
        lookingFor: "I'm looking for someone who shares my environmental values and loves the outdoors. Someone who is genuine, down-to-earth, and cares about making a difference. I'd love to find someone who enjoys adventures in nature and supports causes they believe in. Authenticity and shared values are crucial for me."
      },
      {
        name: "Daniel",
        selfDescription: "I'm a musician who plays guitar and writes songs. Music is my passion and I perform at local venues. I'm creative, sensitive, and express myself through my art. I enjoy poetry, literature, and deep conversations about life. I'm introverted but passionate about the things I care about. I value emotional connection and understanding.",
        lookingFor: "I'm looking for someone who appreciates music and the arts. Someone who is emotionally intelligent and enjoys deep, meaningful conversations. I'd love to find someone who supports my creative pursuits and shares my love for artistic expression. Emotional connection and understanding are what I value most."
      }
    ];
  }

  generateMockProfiles() {
    return this.mockProfiles.map((profile, index) => {
      // Extract tags from the responses
      const selfTags = this.tagExtractor.extractTags(profile.selfDescription);
      const preferenceTags = this.tagExtractor.extractTags(profile.lookingFor);
      
      return {
        id: `mock_${index + 1}`,
        name: profile.name,
        selfDescription: profile.selfDescription,
        lookingFor: profile.lookingFor,
        selfTags: selfTags,
        preferenceTags: preferenceTags,
        completed: true,
        isMock: true
      };
    });
  }

  // Generate profiles with specific themes for testing
  generateThemeProfiles() {
    const themes = {
      creative: [
        {
          name: "Luna",
          selfDescription: "I'm an artist who loves painting, photography, and creative writing. I find inspiration in nature and enjoy visiting art galleries. I'm imaginative, sensitive, and express myself through various art forms. I love music, especially indie and alternative genres.",
          lookingFor: "I'm looking for someone who appreciates art and creativity. Someone who enjoys visiting museums, attending concerts, and exploring creative neighborhoods. I'd love to find someone who is imaginative and supports artistic expression."
        },
        {
          name: "Gabriel",
          selfDescription: "I'm a filmmaker who is passionate about storytelling and visual arts. I love cinema, photography, and creative projects. I'm artistic, thoughtful, and always looking for inspiration. I enjoy coffee shop conversations and independent films.",
          lookingFor: "I'm looking for someone who loves movies and appreciates cinematic art. Someone who enjoys creative discussions and doesn't mind long conversations about films and storytelling. Artistic sensibility is very attractive to me."
        }
      ],
      outdoorsy: [
        {
          name: "Sierra",
          selfDescription: "I'm an outdoor enthusiast who loves hiking, rock climbing, and camping. I enjoy being in nature and feel most alive when I'm outside. I'm adventurous, active, and love challenging myself physically. I also enjoy photography and capturing beautiful landscapes.",
          lookingFor: "I'm looking for someone who shares my love for the outdoors and adventure. Someone who enjoys hiking, camping, and exploring new places. I'd love to find an adventure partner who is active and loves nature as much as I do."
        },
        {
          name: "Trek",
          selfDescription: "I'm a park ranger who is passionate about conservation and wildlife. I love hiking, fishing, and spending time in the wilderness. I'm knowledgeable about nature and enjoy sharing that knowledge with others. I'm patient, observant, and deeply connected to the natural world.",
          lookingFor: "I'm looking for someone who appreciates nature and enjoys outdoor adventures. Someone who is curious about wildlife and doesn't mind getting their hands dirty. I'd love to find someone who shares my passion for conservation and environmental protection."
        }
      ],
      intellectual: [
        {
          name: "Athena",
          selfDescription: "I'm a researcher who loves learning and intellectual discussions. I enjoy reading, writing, and exploring new ideas. I'm curious, analytical, and passionate about knowledge. I love philosophy, science, and deep conversations about complex topics.",
          lookingFor: "I'm looking for someone who is intellectually curious and enjoys meaningful conversations. Someone who loves learning and isn't afraid to discuss complex topics. I'd love to find someone who challenges me mentally and shares my love for knowledge."
        },
        {
          name: "Sage",
          selfDescription: "I'm a philosophy professor who loves teaching and learning. I enjoy debating ideas, reading classic literature, and exploring different perspectives. I'm thoughtful, articulate, and passionate about intellectual growth. I love libraries, bookstores, and academic discussions.",
          lookingFor: "I'm looking for someone who enjoys intellectual discussions and values education. Someone who is curious about life's big questions and enjoys exploring different viewpoints. I'd love to find someone who appreciates depth in conversation and thought."
        }
      ]
    };

    const allThemeProfiles = [];
    
    Object.keys(themes).forEach(theme => {
      themes[theme].forEach((profile, index) => {
        const selfTags = this.tagExtractor.extractTags(profile.selfDescription);
        const preferenceTags = this.tagExtractor.extractTags(profile.lookingFor);
        
        allThemeProfiles.push({
          id: `theme_${theme}_${index + 1}`,
          name: profile.name,
          selfDescription: profile.selfDescription,
          lookingFor: profile.lookingFor,
          selfTags: selfTags,
          preferenceTags: preferenceTags,
          completed: true,
          isMock: true,
          theme: theme
        });
      });
    });

    return allThemeProfiles;
  }

  // Get all mock profiles (main + theme)
  getAllMockProfiles() {
    return [
      ...this.generateMockProfiles(),
      ...this.generateThemeProfiles()
    ];
  }

  // Generate a specific number of random profiles for testing
  generateRandomProfiles(count) {
    const allProfiles = this.getAllMockProfiles();
    const shuffled = [...allProfiles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Get profiles that would be good matches for testing
  getTestMatchProfiles() {
    // Return profiles that should match well with each other
    const profiles = this.generateMockProfiles();
    return [
      profiles[0], // Sarah (creative, hiking, cooking)
      profiles[7], // Ryan (creative, art, music)
      profiles[1], // Michael (tech, introverted, books)
      profiles[3], // David (intellectual, books, teaching)
      profiles[2], // Emma (outgoing, travel, fitness)
      profiles[5], // Alex (sports, ambitious, social)
      profiles[4], // Jessica (yoga, spiritual, nature)
      profiles[10] // Maya (environmental, outdoors, authentic)
    ];
  }
} 