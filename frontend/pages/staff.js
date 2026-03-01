import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import UserRole from '../components/UserRole'

// Current staff team data based on https://docs.fusion-network.xyz/credits.html
const staffMembers = [
  // Leadership Team
  {
    id: '1',
    username: 'CoolAllRounder',
    role: 'owner',
    roleColor: '#FFAA00',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-01-01T00:00:00.000Z',
    bio: 'Server Founder of Fusion Network. Responsible for overall direction and vision of the server.',
    discord: 'CoolAllRounder',
  },
  {
    id: '2',
    username: 'Beast',
    role: 'owner',
    roleColor: '#FFAA00',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-02-01T00:00:00.000Z',
    bio: 'Server Owner of Fusion Network. Manages server operations and development.',
    discord: 'Beast',
  },
  
  // Development Team
  {
    id: '3',
    username: 'MstrChief100',
    role: 'developer',
    roleColor: '#AA00AA',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-03-01T00:00:00.000Z',
    bio: 'System Admin & Website Developer. Maintains server infrastructure and develops web applications.',
    discord: 'MstrChief100',
  },
  {
    id: '4',
    username: 'Laggpixel',
    role: 'developer',
    roleColor: '#AA00AA',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-03-15T00:00:00.000Z',
    bio: 'Lead Developer. Oversees plugin development and implementation of new features.',
    discord: 'Laggpixel',
  },
  {
    id: '5',
    username: 'n0step_',
    role: 'developer',
    roleColor: '#AA00AA',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-04-01T00:00:00.000Z',
    bio: 'Developer. Creates and maintains server plugins and custom features.',
    discord: 'n0step_',
  },
  {
    id: '6',
    username: 'Kespyy',
    role: 'developer',
    roleColor: '#AA00AA',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-04-15T00:00:00.000Z',
    bio: 'Developer. Specializes in game mechanics and feature implementation.',
    discord: 'Kespyy',
  },
  {
    id: '7',
    username: 'Lished',
    role: 'developer',
    roleColor: '#AA00AA',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-05-01T00:00:00.000Z',
    bio: 'Developer. Works on server optimization and performance improvements.',
    discord: 'Lished',
  },
  {
    id: '8',
    username: 'Airzz_',
    role: 'developer',
    roleColor: '#AA00AA',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-05-15T00:00:00.000Z',
    bio: 'Developer. Focuses on gameplay enhancements and bug fixes.',
    discord: 'Airzz_',
  },
  
  // Moderation Team
  {
    id: '9',
    username: 'KiriNaved',
    role: 'admin',
    roleColor: '#FF5555',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-06-01T00:00:00.000Z',
    bio: 'Admin. Oversees server moderation and handles administrative tasks.',
    discord: 'KiriNaved',
  },
  {
    id: '10',
    username: 'Winnowed',
    role: 'moderator',
    roleColor: '#00AA00',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-07-01T00:00:00.000Z',
    bio: 'Moderator. Enforces server rules and maintains a positive community environment.',
    discord: 'Winnowed',
  },
  {
    id: '11',
    username: '_Aquaking',
    role: 'moderator',
    roleColor: '#00AA00',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-07-15T00:00:00.000Z',
    bio: 'Moderator. Monitors chat and gameplay to ensure a fair experience for all players.',
    discord: '_Aquaking',
  },
  {
    id: '12',
    username: '³',
    role: 'moderator',
    roleColor: '#00AA00',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-08-01T00:00:00.000Z',
    bio: 'Moderator. Helps resolve player disputes and enforces server policies.',
    discord: '³',
  },
  {
    id: '13',
    username: 'zWillX0',
    role: 'moderator',
    roleColor: '#00AA00',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-08-15T00:00:00.000Z',
    bio: 'Moderator. Assists with community management and player support.',
    discord: 'zWillX0',
  },
  
  // Helper Team
  {
    id: '14',
    username: 'Winzyy_y',
    role: 'helper',
    roleColor: '#55FF55',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-09-01T00:00:00.000Z',
    bio: 'Helper. Assists new players and answers questions about the server.',
    discord: 'Winzyy_y',
  },
  {
    id: '15',
    username: 'As_h_',
    role: 'helper',
    roleColor: '#55FF55',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-09-15T00:00:00.000Z',
    bio: 'Helper. Provides guidance to players and helps with basic issues.',
    discord: 'As_h_',
  },
  {
    id: '16',
    username: 'Hatch',
    role: 'helper',
    roleColor: '#55FF55',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-10-01T00:00:00.000Z',
    bio: 'Helper. Supports players with gameplay questions and server features.',
    discord: 'Hatch',
  },
  {
    id: '17',
    username: 'v7try',
    role: 'helper',
    roleColor: '#55FF55',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-10-15T00:00:00.000Z',
    bio: 'Helper. Assists with player onboarding and community integration.',
    discord: 'v7try',
  },
  {
    id: '18',
    username: 'Valor',
    role: 'helper',
    roleColor: '#55FF55',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-11-01T00:00:00.000Z',
    bio: 'Helper. Guides new players and provides information about server features.',
    discord: 'Valor',
  },
  {
    id: '19',
    username: 'Vorduen',
    role: 'helper',
    roleColor: '#55FF55',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-11-15T00:00:00.000Z',
    bio: 'Helper. Supports the community with gameplay advice and server knowledge.',
    discord: 'Vorduen',
  },
  {
    id: '20',
    username: 'Searce',
    role: 'helper',
    roleColor: '#55FF55',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2022-12-01T00:00:00.000Z',
    bio: 'Helper. Assists players with understanding server mechanics and features.',
    discord: 'Searce',
  },
  
  // Editor Team
  {
    id: '21',
    username: 'Haunter',
    role: 'media',
    roleColor: '#55AAFF',
    avatar: '/static/images/default-avatar.png',
    joinDate: '2023-01-01T00:00:00.000Z',
    bio: 'Editor. Creates visual content and promotional materials for the server.',
    discord: 'Haunter',
  }
];

// Group staff by role
const staffByRole = staffMembers.reduce((acc, member) => {
  if (!acc[member.role]) {
    acc[member.role] = [];
  }
  acc[member.role].push(member);
  return acc;
}, {});

// Role order and display names
const roleOrder = ['owner', 'developer', 'admin', 'moderator', 'helper', 'media'];
const roleDisplayNames = {
  owner: 'Server Owner',
  developer: 'Developers',
  admin: 'Administrators',
  moderator: 'Moderators',
  helper: 'Helpers',
  media: 'Media Team'
};

export default function Staff() {
  return (
    <>
      <Head>
        <title>Staff Team - Fusion Network</title>
        <meta name="description" content="Meet the staff team behind the Fusion Network Minecraft server" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-minecraft text-minecraft-gold mb-6">
          Our Staff Team
        </h1>
        
        <div className="minecraft-panel mb-8">
          <div className="p-6">
            <p className="text-lg mb-4">
              Meet the dedicated team behind Fusion Network. Our staff members work hard to ensure 
              the server runs smoothly, the community stays friendly, and everyone has a great time.
            </p>
            <p>
              If you need assistance, don't hesitate to contact any of our staff members through 
              Discord or in-game. For serious issues, please contact an Administrator or the Owner directly.
            </p>
          </div>
        </div>
        
        {/* Staff Sections by Role */}
        {roleOrder.map(role => (
          staffByRole[role] && (
            <div key={role} className="mb-12">
              <h2 className="text-2xl font-minecraft text-minecraft-green mb-6 flex items-center">
                <span 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: staffByRole[role][0].roleColor }}
                ></span>
                {roleDisplayNames[role]}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffByRole[role].map(member => (
                  <div key={member.id} className="minecraft-panel">
                    <div className="p-6">
                      {/* Staff Header */}
                      <div className="flex items-center mb-4">
                        <div className="relative w-16 h-16 mr-4">
                          <div className="w-16 h-16 bg-minecraft-black rounded-full flex items-center justify-center overflow-hidden">
                            {/* We'd use actual images in production */}
                            <span className="text-3xl">
                              {member.username.charAt(0)}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-minecraft mb-1">{member.username}</h3>
                          <UserRole role={member.role} roleColor={member.roleColor} />
                        </div>
                      </div>
                      
                      {/* Staff Bio */}
                      <div className="mb-4">
                        <p className="text-sm">{member.bio}</p>
                      </div>
                      
                      {/* Staff Member Since */}
                      <div className="text-xs text-minecraft-stone mb-4">
                        Member since: {new Date(member.joinDate).toISOString().split('T')[0].replace(/-/g, '/')}
                      </div>
                      
                      {/* Contact Links */}
                      <div className="flex flex-wrap gap-3">
                        {member.discord && (
                          <div className="bg-[#5865F2] bg-opacity-30 text-white font-medium rounded px-3 py-2 text-sm flex items-center border border-[#5865F2] shadow-sm hover:bg-opacity-50 transition-all">
                            <FontAwesomeIcon icon={faDiscord} className="mr-2 text-[#5865F2]" />
                            {member.discord}
                          </div>
                        )}
                        
                        {member.twitter && (
                          <a 
                            href={`https://twitter.com/${member.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#1DA1F2] bg-opacity-20 text-[#1DA1F2] rounded px-2 py-1 text-sm flex items-center hover:bg-opacity-30"
                          >
                            <FontAwesomeIcon icon={faTwitter} className="mr-2" />
                            @{member.twitter}
                          </a>
                        )}
                        
                        {member.email && (
                          <a 
                            href={`mailto:${member.email}`}
                            className="bg-minecraft-blue bg-opacity-20 text-minecraft-blue rounded px-2 py-1 text-sm flex items-center hover:bg-opacity-30"
                          >
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                            Email
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
        
        {/* Apply to be Staff */}
        <div className="minecraft-panel mb-8">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-minecraft text-minecraft-gold mb-4">
              Interested in Joining Our Team?
            </h2>
            <p className="mb-6">
              We occasionally open applications for Helper positions. 
              Active and helpful community members with a good record may be considered.
            </p>
            <Link href="https://discord.gg/wk6yJGHkKP" className="minecraft-button inline-block">
              Staff Application
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
