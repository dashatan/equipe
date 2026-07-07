import { PrismaClient, Category, ActivityStatus, PostType, AdminRole, ContentType, ContentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEMO_ID = 'demo-user-1'
const DEMO_EMAIL = 'demo@test.com'

async function getOrCreate<T>(
  model: { findFirst: (args: any) => Promise<T | null>; create: (args: any) => Promise<T> },
  where: Record<string, unknown>,
  create: Record<string, unknown>
): Promise<T> {
  const existing = await model.findFirst({ where })
  if (existing) return existing
  return model.create({ data: create })
}

async function main() {
  console.log('🌱 Seeding database...')

  const demoHash = await bcrypt.hash('demo', 12)
  const userHash = await bcrypt.hash('password123', 12)

  // ---------------- Users ----------------
  const demo = await prisma.user.upsert({
    where: { id: DEMO_ID },
    create: {
      id: DEMO_ID,
      name: 'Alex Thompson',
      email: DEMO_EMAIL,
      password: demoHash,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      bio: 'Adventure enthusiast and tech professional looking to connect with like-minded people for outdoor activities and learning experiences. Always excited to try new things!',
      location: 'San Francisco, CA',
      interests: ['🏔️ Hiking', '📷 Photography', '🎸 Music', '💻 Programming', '📚 Book Clubs', '🧗 Rock Climbing'],
      skills: ['Photography', 'Hiking', 'JavaScript', 'Guitar', 'Rock Climbing'],
      completedActivities: 47,
      rating: 4.8,
      joinedGroups: 12,
    },
    update: {
      name: 'Alex Thompson',
      password: demoHash,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      bio: 'Adventure enthusiast and tech professional looking to connect with like-minded people for outdoor activities and learning experiences. Always excited to try new things!',
      location: 'San Francisco, CA',
      interests: ['🏔️ Hiking', '📷 Photography', '🎸 Music', '💻 Programming', '📚 Book Clubs', '🧗 Rock Climbing'],
      skills: ['Photography', 'Hiking', 'JavaScript', 'Guitar', 'Rock Climbing'],
      completedActivities: 47,
      rating: 4.8,
      joinedGroups: 12,
    },
  })

  const maya = await prisma.user.upsert({
    where: { email: 'maya@groupfinder.com' },
    create: {
      name: 'Maya Chen',
      email: 'maya@groupfinder.com',
      password: userHash,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      bio: 'Music producer and hiker. Loves discovering new trails and new sounds.',
      location: 'Oakland, CA',
      interests: ['🎵 Music', '🏔️ Hiking', '📷 Photography', '🏃 Fitness'],
      skills: ['Music Production', 'Piano', 'Hiking', 'Photography'],
      completedActivities: 23,
      rating: 4.9,
      joinedGroups: 7,
    },
    update: {},
  })

  const jordan = await prisma.user.upsert({
    where: { email: 'jordan@groupfinder.com' },
    create: {
      name: 'Jordan Rivera',
      email: 'jordan@groupfinder.com',
      password: userHash,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      bio: 'Game dev by day, gamer by night. Always down for a co-op session.',
      location: 'San Jose, CA',
      interests: ['🎮 Gaming', '💻 Programming', '🎬 Movies', '📱 Technology'],
      skills: ['Game Design', 'Unity', 'Streaming', 'Chess'],
      completedActivities: 31,
      rating: 4.7,
      joinedGroups: 9,
    },
    update: {},
  })

  const sam = await prisma.user.upsert({
    where: { email: 'sam@groupfinder.com' },
    create: {
      name: 'Sam Okonkwo',
      email: 'sam@groupfinder.com',
      password: userHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a67a1c6?w=200&h=200&fit=crop',
      bio: 'Cooking instructor and foodie. Looking for supper clubs and culinary adventures.',
      location: 'Berkeley, CA',
      interests: ['🍳 Cooking', '🍷 Wine', '☕ Coffee', '🌱 Nature'],
      skills: ['Cooking', 'Baking', 'Wine Pairing', 'Gardening'],
      completedActivities: 18,
      rating: 5.0,
      joinedGroups: 5,
    },
    update: {},
  })

  const users = [demo, maya, jordan, sam]

  // ---------------- Admin role for demo user ----------------
  await prisma.admin.upsert({
    where: { userId: demo.id },
    create: {
      userId: demo.id,
      createdById: demo.id,
      role: AdminRole.super_admin,
      permissions: ['users', 'content', 'groups', 'media', 'messages', 'analytics'],
      isActive: true,
    },
    update: {
      role: AdminRole.super_admin,
      permissions: ['users', 'content', 'groups', 'media', 'messages', 'analytics'],
      isActive: true,
    },
  })

  // ---------------- Groups ----------------
  const groupDefs = [
    {
      name: 'Bay Area Hikers',
      description: 'Weekend warriors exploring the best trails around the Bay. From beginner-friendly walks to challenging summits — we hike them all.',
      category: Category.outdoor,
      location: 'San Francisco, CA',
      lat: 37.7749,
      lng: -122.4194,
      tags: ['hiking', 'outdoor', 'nature', 'weekend'],
      activityLevel: 'high' as const,
      maxMembers: 100,
      coverImage: 'https://images.unsplash.com/photo-1551632811-6107bcf5f5b3?w=600&h=400&fit=crop',
      creatorId: demo.id,
    },
    {
      name: 'Indie Music Collective',
      description: 'A community of musicians, producers, and listeners. We organize jam sessions, open mics, and listening parties across the East Bay.',
      category: Category.music,
      location: 'Oakland, CA',
      lat: 37.8044,
      lng: -122.2712,
      tags: ['music', 'jam', 'live', 'indie'],
      activityLevel: 'medium' as const,
      maxMembers: 50,
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop',
      creatorId: maya.id,
    },
    {
      name: 'Co-op Gaming Guild',
      description: 'PC, console, and tabletop gamers unite. Weekly co-op nights, tournaments, and chill hangouts. All skill levels welcome.',
      category: Category.gaming,
      location: 'San Jose, CA',
      lat: 37.3382,
      lng: -121.8863,
      tags: ['gaming', 'co-op', 'esports', 'tabletop'],
      activityLevel: 'medium' as const,
      maxMembers: 80,
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
      creatorId: jordan.id,
    },
    {
      name: 'Bay Area Supper Club',
      description: 'Monthly themed dinner parties and culinary workshops. Discover new cuisines and meet fellow food lovers.',
      category: Category.cooking,
      location: 'Berkeley, CA',
      lat: 37.8716,
      lng: -122.2727,
      tags: ['cooking', 'food', 'dinner', 'wine'],
      activityLevel: 'low' as const,
      maxMembers: 30,
      coverImage: 'https://images.unsplash.com/photo-1556910103-4c4824c5b9c1?w=600&h=400&fit=crop',
      creatorId: sam.id,
    },
  ]

  const groups = []
  for (const g of groupDefs) {
    const group = await getOrCreate(
      prisma.group,
      { name: g.name, creatorId: g.creatorId },
      {
        name: g.name,
        description: g.description,
        category: g.category,
        coverImage: g.coverImage,
        location: g.location,
        lat: g.lat,
        lng: g.lng,
        maxMembers: g.maxMembers,
        tags: g.tags,
        activityLevel: g.activityLevel,
        isPublic: true,
        isActive: true,
        creatorId: g.creatorId,
        currentMembers: 1,
      }
    )
    groups.push(group)
  }

  // ---------------- Group members + admins ----------------
  // demo joins all groups; cross-join others for social proof
  const memberships: Array<[number, typeof users[number]]> = [
    [0, demo], [0, maya], [0, jordan],
    [1, demo], [1, jordan], [1, sam],
    [2, demo], [2, maya],
    [3, demo], [3, maya], [3, jordan],
  ]
  for (const [gi, u] of memberships) {
    const g = groups[gi]
    await prisma.groupMember.upsert({
      where: { groupId_userId: { groupId: g.id, userId: u.id } },
      create: { groupId: g.id, userId: u.id },
      update: {},
    })
    await prisma.groupAdmin.upsert({
      where: { groupId_userId: { groupId: g.id, userId: g.creatorId } },
      create: { groupId: g.id, userId: g.creatorId },
      update: {},
    })
  }
  // refresh member counts
  for (const g of groups) {
    const count = await prisma.groupMember.count({ where: { groupId: g.id } })
    await prisma.group.update({ where: { id: g.id }, data: { currentMembers: Math.max(count, 1) } })
  }

  // ---------------- Activities ----------------
  const now = new Date()
  const days = (n: number) => new Date(now.getTime() + n * 86400000)

  const activityDefs = [
    {
      groupIdx: 0,
      organizerId: demo.id,
      title: 'Sunrise Hike at Mount Tamalpais',
      description: 'Early morning hike to catch the sunrise from the East Peak. Moderate difficulty, ~6 miles round trip. Bring water and a flashlight for the start.',
      category: Category.outdoor,
      date: days(7),
      endDate: days(7),
      location: 'Mount Tamalpais State Park, CA',
      lat: 37.9236,
      lng: -122.5963,
      maxParticipants: 20,
      cost: 0,
      difficulty: 'medium' as const,
      tags: ['hiking', 'sunrise', 'mount-tam'],
      status: ActivityStatus.upcoming,
      participants: [demo.id, maya.id, jordan.id],
    },
    {
      groupIdx: 0,
      organizerId: maya.id,
      title: 'Redwood Creek Loop Walk',
      description: 'Relaxed walk through redwoods. Family-friendly, flat terrain. Great for photography.',
      category: Category.outdoor,
      date: days(14),
      location: 'Muir Woods, CA',
      lat: 37.8952,
      lng: -122.5760,
      maxParticipants: 25,
      cost: 15,
      difficulty: 'easy' as const,
      tags: ['hiking', 'redwoods', 'family'],
      status: ActivityStatus.upcoming,
      participants: [maya.id, demo.id, sam.id],
    },
    {
      groupIdx: 1,
      organizerId: maya.id,
      title: 'Open Mic Night — Spring Edition',
      description: 'Bring your instrument, voice, or spoken word. 10-minute slots, sign up at the door. Free entry, donations welcome.',
      category: Category.music,
      date: days(3),
      endDate: days(3),
      location: 'The Starry Plough, Oakland, CA',
      lat: 37.8352,
      lng: -122.2486,
      maxParticipants: 40,
      cost: 5,
      difficulty: 'easy' as const,
      tags: ['music', 'open-mic', 'live'],
      status: ActivityStatus.upcoming,
      participants: [maya.id, demo.id, sam.id, jordan.id],
    },
    {
      groupIdx: 2,
      organizerId: jordan.id,
      title: 'Co-op Night: It Takes Two + Snacks',
      description: 'Casual co-op gaming evening. Consoles and PCs set up, plus pizza. Beginners especially welcome.',
      category: Category.gaming,
      date: days(-2),
      endDate: days(-2),
      location: 'San Jose, CA (DM for address)',
      lat: 37.3382,
      lng: -121.8863,
      maxParticipants: 16,
      cost: 0,
      difficulty: 'easy' as const,
      tags: ['gaming', 'co-op', 'social'],
      status: ActivityStatus.completed,
      participants: [jordan.id, demo.id, maya.id],
    },
    {
      groupIdx: 3,
      organizerId: sam.id,
      title: 'Italian Pasta Workshop',
      description: 'Hands-on workshop making fresh pasta from scratch. Ingredients provided. Limited spots.',
      category: Category.cooking,
      date: days(21),
      location: 'Berkeley, CA (DM for address)',
      lat: 37.8716,
      lng: -122.2727,
      maxParticipants: 12,
      cost: 35,
      difficulty: 'medium' as const,
      tags: ['cooking', 'pasta', 'workshop'],
      status: ActivityStatus.upcoming,
      participants: [sam.id, demo.id, maya.id],
    },
  ]

  const activities = []
  for (const a of activityDefs) {
    const activity = await getOrCreate(
      prisma.activity,
      { title: a.title, groupId: groups[a.groupIdx].id },
      {
        title: a.title,
        description: a.description,
        category: a.category,
        date: a.date,
        endDate: a.endDate,
        location: a.location,
        lat: a.lat,
        lng: a.lng,
        maxParticipants: a.maxParticipants,
        cost: a.cost,
        difficulty: a.difficulty,
        tags: a.tags,
        status: a.status,
        isPublic: true,
        groupId: groups[a.groupIdx].id,
        organizerId: a.organizerId,
        currentParticipants: 1,
        images: [],
        equipment: [],
        requirements: [],
      }
    )
    for (const pid of a.participants) {
      await prisma.activityParticipant.upsert({
        where: { activityId_userId: { activityId: activity.id, userId: pid } },
        create: { activityId: activity.id, userId: pid },
        update: {},
      })
    }
    const pcount = await prisma.activityParticipant.count({ where: { activityId: activity.id } })
    await prisma.activity.update({ where: { id: activity.id }, data: { currentParticipants: Math.max(pcount, 1) } })
    activities.push(activity)
  }

  // ---------------- Posts + Comments + Likes ----------------
  const postDefs = [
    { authorId: demo.id, content: 'Just booked my spot for the Mount Tam sunrise hike next week! Who else is coming? 🌄', type: PostType.activity, tags: ['hiking', 'mount-tam'], activityId: activities[0].id, groupId: groups[0].id },
    { authorId: maya.id, content: 'New track uploaded — recorded it during last week\'s jam session. Would love feedback 🎧', type: PostType.achievement, tags: ['music', 'production'], groupId: groups[1].id },
    { authorId: jordan.id, content: 'Co-op night was a blast last weekend! Thanks everyone who came. Next one in two weeks 🎮', type: PostType.group, tags: ['gaming', 'co-op'], groupId: groups[2].id },
    { authorId: sam.id, content: 'Reminder: pasta workshop spots are filling up fast. Only 4 left! 🍝', type: PostType.group, tags: ['cooking', 'pasta'], groupId: groups[3].id },
    { authorId: demo.id, content: 'Beautiful sunset over the Bay tonight. Sometimes the best adventures are close to home. 📷', type: PostType.general, tags: ['photography', 'sunset'] },
    { authorId: maya.id, content: 'Anyone want to carpool to the Muir Woods walk next weekend? I can take 3 people from Oakland.', type: PostType.activity, tags: ['hiking', 'carpool'], activityId: activities[1].id, groupId: groups[0].id },
    { authorId: jordan.id, content: 'Hot take: It Takes Two is the best co-op game of the decade. Change my mind.', type: PostType.general, tags: ['gaming'] },
    { authorId: demo.id, content: 'Hit 47 completed activities this year 🎉 Grateful for this community. Onward to 50!', type: PostType.achievement, tags: ['milestone'] },
  ]

  for (const p of postDefs) {
    const post = await getOrCreate(
      prisma.post,
      { authorId: p.authorId, content: p.content },
      {
        content: p.content,
        type: p.type,
        tags: p.tags,
        isPublic: true,
        images: [],
        authorId: p.authorId,
        groupId: p.groupId ?? null,
        activityId: p.activityId ?? null,
      }
    )
    // a couple of likes
    const likers = users.filter((u) => u.id !== p.authorId).slice(0, 3)
    for (const u of likers) {
      await prisma.postLike.upsert({
        where: { postId_userId: { postId: post.id, userId: u.id } },
        create: { postId: post.id, userId: u.id },
        update: {},
      })
    }
    // a couple of comments
    const commenters = users.filter((u) => u.id !== p.authorId).slice(0, 2)
    const commentTexts = ['Love this! 🔥', 'Count me in!', 'Great post 😊', 'Sounds amazing!']
    let ci = 0
    for (const u of commenters) {
      const txt = commentTexts[ci % commentTexts.length]
      ci++
      await getOrCreate(
        prisma.comment,
        { postId: post.id, authorId: u.id, content: txt },
        { content: txt, postId: post.id, authorId: u.id }
      )
    }
  }

  // ---------------- Messages (1:1) ----------------
  const messageDefs = [
    { from: demo.id, to: maya.id, content: 'Hey Maya! Are you joining the sunrise hike?' },
    { from: maya.id, to: demo.id, content: 'Absolutely! I wouldn\'t miss it. Need a ride?' },
    { from: demo.id, to: maya.id, content: 'Yes please! I can meet you in Oakland at 5am?' },
    { from: maya.id, to: demo.id, content: 'Perfect, see you then 🌄' },
    { from: jordan.id, to: demo.id, content: 'Thanks for coming to co-op night! Next one I\'m thinking Overcooked.' },
    { from: demo.id, to: jordan.id, content: 'Haha yes, Overcooked will destroy friendships 😂' },
    { from: sam.id, to: demo.id, content: 'Saved you a spot for the pasta workshop!' },
    { from: demo.id, to: sam.id, content: 'You\'re a legend, Sam. Can\'t wait 🍝' },
  ]
  for (const m of messageDefs) {
    await getOrCreate(
      prisma.message,
      { senderId: m.from, recipientId: m.to, content: m.content },
      { content: m.content, senderId: m.from, recipientId: m.to, isRead: m.to === demo.id }
    )
  }

  // ---------------- Content (admin) ----------------
  const contentDefs = [
    { slug: 'welcome-to-groupfinder', type: ContentType.announcement, title: 'Welcome to GroupFinder!', status: ContentStatus.published, body: 'Welcome aboard! GroupFinder helps you discover activities and meet people around you. Explore groups, join activities, and start your next adventure today.' },
    { slug: 'community-guidelines', type: ContentType.legal, title: 'Community Guidelines', status: ContentStatus.published, body: 'Be kind, be safe, be yourself. Respect all members, no spam, and follow local laws. Read the full guidelines before posting.' },
    { slug: 'privacy-policy', type: ContentType.legal, title: 'Privacy Policy', status: ContentStatus.published, body: 'We respect your privacy. This policy explains what data we collect and how we use it.' },
    { slug: 'getting-started-faq', type: ContentType.faq, title: 'Getting Started — FAQ', status: ContentStatus.published, body: 'Frequently asked questions about creating an account, joining groups, and attending activities.' },
  ]
  for (const c of contentDefs) {
    await prisma.content.upsert({
      where: { slug: c.slug },
      create: {
        slug: c.slug,
        type: c.type,
        title: c.title,
        content: c.body,
        status: c.status,
        authorId: demo.id,
        lastModifiedById: demo.id,
        tags: [],
        images: [],
        showInNavigation: c.type === ContentType.announcement,
      },
      update: {
        type: c.type,
        title: c.title,
        content: c.body,
        status: c.status,
      },
    })
  }

  console.log('✅ Seed complete!')
  console.log(`   Demo user: ${demo.email} / password: "demo"`)
  console.log(`   Users: ${users.length}, Groups: ${groups.length}, Activities: ${activities.length}, Posts: ${postDefs.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
