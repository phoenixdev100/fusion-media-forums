import Head from 'next/head'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faServer, faUsers, faCalendarAlt, faGamepad } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

export default function ServerInfo() {
  const [copied, setCopied] = useState(false)
  
  const copyServerAddress = () => {
    navigator.clipboard.writeText('fusion-network.xyz')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <>
      <Head>
        <title>Server Information - Fusion Network</title>
        <meta name="description" content="Information about the Fusion Network Minecraft server" />
      </Head>
      
      <div className="mb-8">
        <h1 className="text-3xl font-minecraft text-minecraft-gold mb-4">
          Server Information
        </h1>
        <p className="text-lg mb-6">
          Everything you need to know about joining and playing on our Minecraft server
        </p>
        
        {/* Server Address */}
        <div className="minecraft-panel mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="font-minecraft text-xl text-minecraft-green mb-2">
                Server Address
              </h2>
              <p className="mb-2">Connect to our server using this address:</p>
            </div>
            
            <div className="flex items-center mt-4 md:mt-0">
              <div className="bg-minecraft-black p-3 rounded-l">
                <span className="font-minecraft text-minecraft-green select-all">fusion-network.xyz</span>
              </div>
              <button 
                onClick={copyServerAddress} 
                className="minecraft-button rounded-l-none"
                aria-label="Copy server address"
              >
                <FontAwesomeIcon icon={faCopy} />
                <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Server Features */}
        <div className="minecraft-panel mb-8">
          <h2 className="font-minecraft text-xl text-minecraft-gold mb-4">
            Server Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex">
              <div className="mr-4 text-minecraft-green">
                <FontAwesomeIcon icon={faServer} size="2x" />
              </div>
              <div>
                <h3 className="font-minecraft text-lg mb-1">Powerful Hardware</h3>
                <p>Our server runs on high-performance hardware to ensure a lag-free experience for all players.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 text-minecraft-blue">
                <FontAwesomeIcon icon={faUsers} size="2x" />
              </div>
              <div>
                <h3 className="font-minecraft text-lg mb-1">Active Community</h3>
                <p>Join our friendly community of players who are always ready to help and collaborate.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 text-minecraft-gold">
                <FontAwesomeIcon icon={faCalendarAlt} size="2x" />
              </div>
              <div>
                <h3 className="font-minecraft text-lg mb-1">Regular Events</h3>
                <p>Participate in weekly events and competitions with exciting prizes and rewards.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 text-minecraft-red">
                <FontAwesomeIcon icon={faGamepad} size="2x" />
              </div>
              <div>
                <h3 className="font-minecraft text-lg mb-1">Multiple Game Modes</h3>
                <p>Enjoy intense PVP experiences with our PVP Duels and Lifesteal game modes!</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Game Modes */}
        <div className="minecraft-panel mb-8">
          <h2 className="font-minecraft text-xl text-minecraft-gold mb-4">
            Game Modes
          </h2>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
                <div className="relative h-48 w-full rounded overflow-hidden">
                  <img 
                    src="/static/images/pvp-duels.avif"
                    alt="PVP Duels Mode"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="font-minecraft text-lg text-minecraft-red mb-2">PVP Duels</h3>
                <p className="mb-2">
                  Test your combat skills in our competitive PVP arena. Challenge other players to 1v1 duels and climb the leaderboards.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Multiple arena themes and layouts</li>
                  <li>Different kit options for varied gameplay</li>
                  <li>Seasonal tournaments with prizes</li>
                  <li>Global ranking system</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
                <div className="relative h-48 w-full rounded overflow-hidden">
                  <img 
                    src="/static/images/lifesteal.jpg"
                    alt="Lifesteal Mode"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="font-minecraft text-lg text-minecraft-blue mb-2">Lifesteal</h3>
                <p className="mb-2">
                  In this hardcore survival mode, defeating other players grants you one of their hearts. Lose all your hearts and you're banned until the next season!
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Heart crafting and trading system</li>
                  <li>Special items to regain hearts</li>
                  <li>Monthly server resets with new maps</li>
                  <li>Limited lives add intense gameplay</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Server Rules */}
        <div className="minecraft-panel">
          <h2 className="font-minecraft text-xl text-minecraft-gold mb-4">
            Server Rules
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-minecraft text-lg text-minecraft-red mb-2">1. Respect All Players</h3>
              <p>Treat everyone with respect. Harassment, discrimination, and excessive toxicity are not tolerated.</p>
            </div>
            
            <div>
              <h3 className="font-minecraft text-lg text-minecraft-red mb-2">2. No Cheating or Hacking</h3>
              <p>Using hacked clients, exploits, or any unfair advantage is strictly prohibited and will result in a ban.</p>
            </div>
            
            <div>
              <h3 className="font-minecraft text-lg text-minecraft-red mb-2">3. No Spamming</h3>
              <p>Avoid spamming chat, commands, or any server features. This includes excessive caps and repetitive messages.</p>
            </div>
            
            <div>
              <h3 className="font-minecraft text-lg text-minecraft-red mb-2">4. Appropriate Language</h3>
              <p>Keep language appropriate. Excessive swearing, hate speech, and inappropriate discussions are not allowed.</p>
            </div>
            
            <div>
              <h3 className="font-minecraft text-lg text-minecraft-red mb-2">5. No Advertising</h3>
              <p>Advertising other servers or services is not permitted in any form.</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-minecraft-green font-minecraft">
              By joining our server, you agree to follow these rules.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
