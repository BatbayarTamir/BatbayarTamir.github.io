import { Song, PolaroidMemory, Milestone, LoveCoupon, GirlfriendSiteConfig } from '../types';

export const initialConfig: GirlfriendSiteConfig = {
  herName: 'My Beloved',
  herNickname: 'Sweetheart',
  hisName: 'Always Yours',
  anniversaryDate: '2026-05-21',
  letterTitle: 'To the girl who made my world so bright,',
  letterBody: `Happy Birthday, my love! 🌸

From the moment you came into my life, everything became softer, sweeter, and infinitely more colorful. You have this magical way of making even ordinary grocery runs and quiet rainy afternoons feel like poetry. 

Thank you for your warm giggles, your gentle heart, the way your eyes crinkle when you truly laugh, and the unconditional kindness you share with everyone around you. Being loved by you is the greatest privilege of my life.

I built this little sanctuary just for you—a celebration of every song we've loved, every memory we've made, and the endless adventures still waiting for us ahead. 

May this year bring you as much pure joy and magic as you effortlessly bring into my life every single day.`,
  letterSignoff: 'Forever and always yours,\nWith all my love ❤️'
};

export const defaultPlaylist: Song[] = [
  {
    id: 'song-1',
    title: 'Dear My Feelings',
    artist: 'IVE',
    duration: '3:24',
    dedication: 'The melody that plays in my head every time you smile at me.',
    tone: 'dreamy',
    lyricsSnippet: 'Like a soft spring breeze finding its way home...',
    accentColor: '#fb7185'
  },
  {
    id: 'song-waiting',
    title: 'Waiting for you',
    artist: 'Alex G',
    duration: '3:12',
    dedication: 'For the quiet afternoons, the gentle longing, and knowing every moment waiting for you was worth it.',
    tone: 'nostalgic',
    lyricsSnippet: 'I’ll be waiting right here for you, beneath the golden sky...',
    accentColor: '#6366f1'
  },
  {
    id: 'song-5',
    title: 'Lofi Starry Night',
    artist: 'Midnight Chimes',
    duration: '2:58',
    dedication: 'For our late night conversations when neither of us wants to say goodbye.',
    tone: 'dreamy',
    lyricsSnippet: 'Underneath a blanket of stars, counting my blessings one by one...',
    accentColor: '#ec4899'
  },
  {
    id: 'song-nexz',
    title: 'mchk mchk',
    artist: 'NEXZ',
    duration: '3:05',
    dedication: '⚡ Secret Easter Egg 1: Turn up the volume, high-voltage cyber groove!',
    tone: 'energetic',
    lyricsSnippet: 'Feel the rhythm bouncing, electrifying the heartbeat with high-voltage groove...',
    accentColor: '#06b6d4'
  },
  {
    id: 'song-saucin',
    title: 'Saucin',
    artist: 'NEXZ',
    duration: '2:52',
    dedication: '🥫 Secret Easter Egg 2: Drip, groove, and sauce it up with the red & yellow vibe!',
    tone: 'energetic',
    lyricsSnippet: 'Saucin on the beat, pure heat dripping with the mustard and spice...',
    accentColor: '#eab308'
  }
];

export const defaultMemories: PolaroidMemory[] = [
  {
    id: 'mem-1',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
    caption: 'Our First Walk in the Park',
    date: 'April 18',
    location: 'Central Rose Garden',
    backNote: 'You pointed at the stray cats and laughed so hard your ice cream almost dropped. I knew right then I wanted to make you laugh like that every day.',
    rotation: -3
  },
  {
    id: 'mem-2',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
    caption: 'Cozy Morning Matcha',
    date: 'July 04',
    location: 'Little Corner Cafe',
    backNote: 'You took 10 photos of the foam art before taking a sip, and ended up with a milk mustache. Most adorable human on earth.',
    rotation: 4
  },
  {
    id: 'mem-3',
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80',
    caption: 'Sunset Beach Escapade',
    date: 'August 22',
    location: 'Golden Coast Pier',
    backNote: 'The sea breeze was freezing, so you hid inside my oversized jacket. The sky was pink, but I could only look at you.',
    rotation: -2
  },
  {
    id: 'mem-4',
    imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
    caption: 'Under the Fairy Lights',
    date: 'December 24',
    location: 'Winter Festival',
    backNote: 'We drank warm spiced cider and tried to ice skate. You held on to my sleeves like your life depended on it!',
    rotation: 3
  },
  {
    id: 'mem-5',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    caption: 'Road Trip Sing-Alongs',
    date: 'October 12',
    location: 'Mountain Highway',
    backNote: 'Windows rolled all the way down, singing every single word off-key at the top of our lungs with the wind in your hair.',
    rotation: -4
  },
  {
    id: 'mem-6',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
    caption: 'Late Night Ramen Run',
    date: 'November 08',
    location: 'Downtown Diner',
    backNote: 'It was 1:30 AM, raining outside, and you said "I am craving dumplings right now". Best midnight adventure ever.',
    rotation: 2
  }
];

export const defaultMilestones: Milestone[] = [
  {
    id: 'm-1',
    title: 'The First Spark',
    date: 'The Beginning',
    story: 'That first conversation where time simply disappeared. Five minutes turned into four hours of non-stop texting and smiling at my screen like a fool.',
    icon: 'Sparkles',
    tag: 'Chapter 1'
  },
  {
    id: 'm-2',
    title: 'Our First Official Date',
    date: 'The Butterfly Day',
    story: 'I was so nervous I checked my hair fifteen times in the car mirror. Then you walked up wearing that warm smile, and all the nervousness melted into pure bliss.',
    icon: 'Heart',
    tag: 'Chapter 2'
  },
  {
    id: 'm-3',
    title: 'Saying "I Love You"',
    date: 'Under the Stars',
    story: 'No rehearsed speeches, just the quiet realization that my heart was already completely yours. Whispering it to you and watching your face light up.',
    icon: 'Flame',
    tag: 'Chapter 3'
  },
  {
    id: 'm-4',
    title: 'Our First Trip Together',
    date: 'Getting Lost & Loving It',
    story: 'Missed a train, took the scenic route, and discovered the best hidden bakery. Proved that anywhere with you is paradise.',
    icon: 'Compass',
    tag: 'Chapter 4'
  },
  {
    id: 'm-5',
    title: 'Celebrating You Today',
    date: 'Your Special Day',
    story: 'Another year of watching you bloom, achieve your dreams, and make this world kinder. I promise to stand by your side for every chapter ahead.',
    icon: 'Crown',
    tag: 'Today & Always'
  }
];

export const defaultReasonsWhy: string[] = [
  "The way your eyes crinkle when you giggle at silly memes",
  "How passionate you get when talking about things you love",
  "The warm, comforting hug you give after a long exhausting day",
  "Your kindness towards stray animals and little birds",
  "How cute you look when you're sleepy and rubbing your eyes",
  "The fact that you remember the tiniest details about my stories",
  "Your beautiful, radiant smile that instantly brightens any room",
  "How you make even ordinary grocery shopping feel like a fun date",
  "Your gentle patience whenever I'm being stubborn",
  "The way you scrunch your nose when you're thinking hard",
  "How safe and at peace I feel whenever you're beside me",
  "Your adorable happy dance when delicious food arrives",
  "How fiercely you care for your family and close friends",
  "The sweet little good morning texts that start my day off right",
  "The way you steal my oversized hoodies and look 10x better in them",
  "How you sing along to songs even when you don't know the lyrics",
  "Your courage to try new things even when you feel scared",
  "The soft warmth of your hand resting inside mine",
  "How you always know exactly what to say to comfort my worries",
  "Your infectious laugh that makes everyone around you happy",
  "The way you fall asleep on my shoulder during movie nights",
  "How much you appreciate small, thoughtful gestures",
  "Your endless curiosity about the world and new places",
  "The way you look at me across a crowded room",
  "Because you are my home, my peace, and my greatest blessing"
];

export const defaultCoupons: LoveCoupon[] = [
  {
    id: 'c-1',
    title: 'Unlimited Back & Shoulder Massage',
    description: 'Good for a relaxing, lavender-oil massage session anytime you feel tired or stressed.',
    emoji: '💆‍♀️',
    color: 'from-rose-400 to-pink-500',
    redeemed: false
  },
  {
    id: 'c-2',
    title: 'Midnight Sweet Treats Run',
    description: 'Any dessert, ice cream, boba, or midnight snacks of your choice, delivered with love.',
    emoji: '🍨',
    color: 'from-amber-400 to-rose-400',
    redeemed: false
  },
  {
    id: 'c-3',
    title: 'Movie Night Dictator Pass',
    description: 'You pick the movie, the snacks, the blanket setup—zero complaints or vetoes allowed.',
    emoji: '🍿',
    color: 'from-purple-400 to-pink-500',
    redeemed: false
  },
  {
    id: 'c-4',
    title: 'Breakfast in Bed Luxury Service',
    description: 'Fresh warm pancakes or avocado toast with your favorite coffee/tea served while you stay cozy in bed.',
    emoji: '🥞',
    color: 'from-orange-400 to-rose-400',
    redeemed: false
  },
  {
    id: 'c-5',
    title: 'Free Pass from Any Chores Day',
    description: 'I will handle the dishes, laundry, and tidying up all day long while you relax like a queen.',
    emoji: '✨',
    color: 'from-teal-400 to-rose-400',
    redeemed: false
  },
  {
    id: 'c-6',
    title: 'Emergency 5-Minute Bear Hug',
    description: 'Instant, tight, warm hug with forehead kisses whenever you need comfort.',
    emoji: '🧸',
    color: 'from-pink-500 to-rose-600',
    redeemed: false
  }
];
