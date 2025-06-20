import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import { usersTable, playlistsTable, tracksTable, playlistTracksTable } from './schema'

const db = drizzle(process.env.DATABASE_URL!)

async function main() {
  try {
    // Get the admin user to create playlists for
    const adminUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, 'john@example.com'))
      .limit(1)

    if (adminUser.length === 0) {
      console.log('Admin user not found. Please run seed.ts first.')
      return
    }

    const userId = adminUser[0].id

    // Sample tracks data
    const sampleTracks = [
      {
        external_id: '7qiZfU4dY1lWllzX7mPBI3',
        name: 'Shape of You',
        artists: [{ name: 'Ed Sheeran', id: 'ed001' }],
        album: {
          name: '÷ (Divide)',
          images: [
            {
              url: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
              height: 300,
              width: 300,
            },
          ],
        },
        sources: ['Spotify', 'YouTube Music', 'Apple Music'],
        platform_urls: {
          Spotify: 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3',
          'YouTube Music': 'https://music.youtube.com/watch?v=JGwWNGJdvx8',
          'Apple Music': 'https://music.apple.com/us/album/shape-of-you/1193701073?i=1193701392',
        },
        result_type: 'song',
        source: 'Spotify',
      },
      {
        external_id: '0VjIjW4GlUZAMYd2vXMi3b',
        name: 'Blinding Lights',
        artists: [{ name: 'The Weeknd', id: 'weeknd001' }],
        album: {
          name: 'After Hours',
          images: [
            {
              url: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
              height: 300,
              width: 300,
            },
          ],
        },
        sources: ['Spotify', 'YouTube Music'],
        platform_urls: {
          Spotify: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
          'YouTube Music': 'https://music.youtube.com/watch?v=4NRXx6U8ABQ',
        },
        result_type: 'song',
        source: 'Spotify',
      },
      {
        external_id: '4saklk6nie3yiGePpBwUoc',
        name: 'Dynamite',
        artists: [{ name: 'BTS', id: 'bts001' }],
        album: {
          name: 'Dynamite (DayTime Version)',
          images: [
            {
              url: 'https://i.scdn.co/image/ab67616d0000b273a7ea08ab3914c5fb2084a8ac',
              height: 300,
              width: 300,
            },
          ],
        },
        sources: ['Spotify', 'Apple Music', 'YouTube Music'],
        platform_urls: {
          Spotify: 'https://open.spotify.com/track/4saklk6nie3yiGePpBwUoc',
          'Apple Music': 'https://music.apple.com/us/album/dynamite/1528831887?i=1528831890',
          'YouTube Music': 'https://music.youtube.com/watch?v=gdZLi9oWNZg',
        },
        result_type: 'song',
        source: 'Spotify',
      },
      {
        video_id: 'kXYiU_JCYtU',
        title: 'Levitating',
        artists: [{ name: 'Dua Lipa' }],
        thumbnails: [
          {
            url: 'https://i.ytimg.com/vi/kXYiU_JCYtU/mqdefault.jpg',
            width: 320,
            height: 180,
          },
        ],
        external_url: 'https://music.youtube.com/watch?v=kXYiU_JCYtU',
        result_type: 'song',
        source: 'YouTube Music',
        sources: ['YouTube Music'],
        platform_urls: {
          'YouTube Music': 'https://music.youtube.com/watch?v=kXYiU_JCYtU',
        },
      },
      {
        external_id: '1301WleyT98MSxVHPZCA6M',
        name: 'Heat Waves',
        artists: [{ name: 'Glass Animals', id: '4yvcSjfu4PC0CYQyLy4wSq' }],
        album: {
          name: 'Dreamland',
          images: [
            {
              url: 'https://i.scdn.co/image/ab67616d0000b273b0dce1e9fb0d6d7344b5c571',
              height: 300,
              width: 300,
            },
          ],
        },
        sources: ['Spotify', 'YouTube Music'],
        platform_urls: {
          Spotify: 'https://open.spotify.com/track/1301WleyT98MSxVHPZCA6M',
          'YouTube Music': 'https://music.youtube.com/watch?v=mRD0-GxqHVo',
        },
        result_type: 'song',
        source: 'Spotify',
      },
    ]

    // Insert tracks first
    const insertedTracks: Array<typeof tracksTable.$inferSelect> = []
    for (const track of sampleTracks) {
      const [insertedTrack] = await db
        .insert(tracksTable)
        .values({
          external_id: track.external_id,
          video_id: track.video_id,
          name: track.name,
          title: track.title,
          artists: track.artists,
          album: track.album,
          thumbnails: track.thumbnails,
          external_url: track.external_url || track.platform_urls?.[track.source!],
          result_type: track.result_type,
          source: track.source,
          sources: track.sources,
          platform_urls: track.platform_urls,
        })
        .returning()
      insertedTracks.push(insertedTrack)
    }

    console.log(`Inserted ${insertedTracks.length} tracks`)

    // Create sample playlists
    const playlists = [
      {
        name: 'My Favorite Pop Hits',
        description: 'A collection of the best pop songs from recent years',
        user_id: userId,
      },
      {
        name: 'Chill Vibes',
        description: 'Relaxing songs for a peaceful evening',
        user_id: userId,
      },
    ]

    const insertedPlaylists: Array<typeof playlistsTable.$inferSelect> = []
    for (const playlist of playlists) {
      const [insertedPlaylist] = await db.insert(playlistsTable).values(playlist).returning()
      insertedPlaylists.push(insertedPlaylist)
    }

    console.log(`Created ${insertedPlaylists.length} playlists`)

    // Add tracks to playlists
    const playlistTracks = [
      // First playlist: Pop Hits (tracks 0, 1, 2, 3)
      { playlist_id: insertedPlaylists[0].id, track_id: insertedTracks[0].id, position: 0 },
      { playlist_id: insertedPlaylists[0].id, track_id: insertedTracks[1].id, position: 1 },
      { playlist_id: insertedPlaylists[0].id, track_id: insertedTracks[2].id, position: 2 },
      { playlist_id: insertedPlaylists[0].id, track_id: insertedTracks[3].id, position: 3 },

      // Second playlist: Chill Vibes (tracks 1, 4)
      { playlist_id: insertedPlaylists[1].id, track_id: insertedTracks[1].id, position: 0 },
      { playlist_id: insertedPlaylists[1].id, track_id: insertedTracks[4].id, position: 1 },
    ]

    await db.insert(playlistTracksTable).values(playlistTracks)

    console.log(`Added tracks to playlists`)

    // Display created playlists
    console.log('\nCreated playlists:')
    for (const playlist of insertedPlaylists) {
      const tracks = await db
        .select({
          track: tracksTable,
          position: playlistTracksTable.position,
        })
        .from(playlistTracksTable)
        .innerJoin(tracksTable, eq(playlistTracksTable.track_id, tracksTable.id))
        .where(eq(playlistTracksTable.playlist_id, playlist.id))
        .orderBy(playlistTracksTable.position)

      console.log(`\n${playlist.name} (${tracks.length} tracks):`)
      tracks.forEach((item, index) => {
        const track = item.track
        console.log(
          `  ${index + 1}. ${track.name || track.title} - ${track.artists
            .map((a: any) => a.name)
            .join(', ')}`
        )
      })
    }
  } catch (error) {
    console.error('Error seeding playlists:', error)
  }
}

main().finally(() => {
  process.exit(0)
})
