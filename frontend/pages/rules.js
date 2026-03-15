import Head from 'next/head'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faUserShield, faComments, faHandPaper, faLanguage, faGlobe, faUserSecret, faCode, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

export default function Rules() {
  return (
    <>
      <Head>
        <title>Server Rules - Fusion Network</title>
        <meta name="description" content="Official rules and guidelines for the Fusion Network Minecraft server and forums" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-minecraft text-minecraft-gold mb-6">
          Fusion Network Rules
        </h1>
        
        <div className="minecraft-panel mb-8">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-minecraft-red text-3xl mr-4" />
              <p className="text-lg">
                By using our server and forums, you agree to follow these rules. 
                Breaking these rules may result in warnings, temporary bans, or permanent bans 
                depending on the severity and frequency of the violations.
              </p>
            </div>
            
            <p className="mb-6">
              Our goal is to maintain a friendly, welcoming, and safe environment for all players. 
              These rules apply to both in-game behavior and forum interactions.
            </p>
          </div>
        </div>
        
        {/* Server Rules */}
        <h2 className="text-2xl font-minecraft text-minecraft-green mb-4">
          Server Rules
        </h2>
        
        <div className="space-y-4 mb-10">
          <div className="minecraft-panel">
            <div className="p-6">
              <h3 className="flex items-center text-xl font-minecraft text-minecraft-red mb-3">
                <FontAwesomeIcon icon={faUserShield} className="mr-3" />
                1. Respect All Players
              </h3>
              <p className="mb-2">
                Treat everyone with respect and courtesy. We have a zero-tolerance policy for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-6">
                <li>Harassment or bullying of any kind</li>
                <li>Discrimination based on race, gender, sexuality, religion, etc.</li>
                <li>Personal attacks or excessive toxicity</li>
                <li>Targeting specific players or groups</li>
              </ul>
            </div>
          </div>
          
          <div className="minecraft-panel">
            <div className="p-6">
              <h3 className="flex items-center text-xl font-minecraft text-minecraft-red mb-3">
                <FontAwesomeIcon icon={faCode} className="mr-3" />
                2. No Cheating or Exploiting
              </h3>
              <p className="mb-2">
                Play fair and don't use unfair advantages:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-6">
                <li>No hacked clients or mods that give unfair advantages</li>
                <li>No exploiting bugs or glitches</li>
                <li>No automated tools, bots, or macros</li>
                <li>No using multiple accounts to circumvent rules</li>
              </ul>
              <p className="mt-3 text-sm">
                <strong>Allowed mods:</strong> Optifine, minimaps without entity radar, 
                performance enhancers, cosmetic mods
              </p>
            </div>
          </div>
          
          <div className="minecraft-panel">
            <div className="p-6">
              <h3 className="flex items-center text-xl font-minecraft text-minecraft-red mb-3">
                <FontAwesomeIcon icon={faComments} className="mr-3" />
                3. Appropriate Chat Behavior
              </h3>
              <p className="mb-2">
                Keep conversations appropriate and friendly:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-6">
                <li>No spamming or flooding chat</li>
                <li>No excessive caps or symbols</li>
                <li>No advertising other servers or services</li>
                <li>No sharing personal information of others</li>
              </ul>
            </div>
          </div>
          
          <div className="minecraft-panel">
            <div className="p-6">
              <h3 className="flex items-center text-xl font-minecraft text-minecraft-red mb-3">
                <FontAwesomeIcon icon={faLanguage} className="mr-3" />
                4. Appropriate Language
              </h3>
              <p className="mb-2">
                We aim to be family-friendly:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-6">
                <li>No excessive swearing</li>
                <li>No hate speech or slurs of any kind</li>
                <li>No sexual or explicit content</li>
                <li>No discussions of illegal activities</li>
              </ul>
            </div>
          </div>
          
          <div className="minecraft-panel">
            <div className="p-6">
              <h3 className="flex items-center text-xl font-minecraft text-minecraft-red mb-3">
                <FontAwesomeIcon icon={faGlobe} className="mr-3" />
                5. Respect the Server
              </h3>
              <p className="mb-2">
                Help us maintain a good gameplay experience:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-6">
                <li>No intentional lag machines or server-straining builds</li>
                <li>No griefing or stealing from other players</li>
                <li>Respect land claims and protected areas</li>
                <li>Follow specific rules for each game mode</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Forum Rules */}
        <h2 className="text-2xl font-minecraft text-minecraft-green mb-4">
          Forum Rules
        </h2>
        
        <div className="space-y-4 mb-10">
          <div className="minecraft-panel">
            <div className="p-6">
              <h3 className="flex items-center text-xl font-minecraft text-minecraft-red mb-3">
                <FontAwesomeIcon icon={faComments} className="mr-3" />
                1. Quality Content
              </h3>
              <p className="mb-2">
                Maintain high-quality discussions:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-6">
                <li>Post in the appropriate categories</li>
                <li>Use descriptive titles for threads</li>
                <li>No low-effort posts or spam</li>
                <li>No necroposting (reviving very old threads without good reason)</li>
              </ul>
            </div>
          </div>
          
          <div className="minecraft-panel">
            <div className="p-6">
              <h3 className="flex items-center text-xl font-minecraft text-minecraft-red mb-3">
                <FontAwesomeIcon icon={faUserSecret} className="mr-3" />
                2. Privacy and Safety
              </h3>
              <p className="mb-2">
                Protect yourself and others:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-6">
                <li>No sharing personal information (yours or others')</li>
                <li>No requesting personal information</li>
                <li>No sharing links to suspicious or harmful websites</li>
                <li>Report any concerning behavior to moderators</li>
              </ul>
            </div>
          </div>
          
          <div className="minecraft-panel">
            <div className="p-6">
              <h3 className="flex items-center text-xl font-minecraft text-minecraft-red mb-3">
                <FontAwesomeIcon icon={faHandPaper} className="mr-3" />
                3. Respect Staff Decisions
              </h3>
              <p className="mb-2">
                Our staff work hard to maintain the community:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-6">
                <li>Follow staff instructions</li>
                <li>Do not argue with staff in public threads</li>
                <li>Use private messages or the appeal system for disputes</li>
                <li>No impersonating staff members</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Enforcement */}
        <h2 className="text-2xl font-minecraft text-minecraft-green mb-4">
          Rule Enforcement
        </h2>
        
        <div className="minecraft-panel mb-8">
          <div className="p-6">
            <h3 className="flex items-center text-xl font-minecraft text-minecraft-red mb-3">
              <FontAwesomeIcon icon={faExclamationCircle} className="mr-3" />
              Consequences for Breaking Rules
            </h3>
            <p className="mb-4">
              Our staff team uses a progressive discipline system:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-yellow-500 bg-opacity-20 text-yellow-500 px-2 py-1 rounded mr-3 font-minecraft">Warning</div>
                <p>First-time or minor offenses will result in a warning.</p>
              </div>
              
              <div className="flex items-start">
                <div className="bg-orange-500 bg-opacity-20 text-orange-500 px-2 py-1 rounded mr-3 font-minecraft">Mute/Temp Ban</div>
                <p>Repeated or more serious offenses will result in temporary mutes or bans (1 hour to 30 days).</p>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-500 bg-opacity-20 text-red-500 px-2 py-1 rounded mr-3 font-minecraft">Permanent Ban</div>
                <p>Severe violations or repeated offenses after multiple temporary bans may result in a permanent ban.</p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="mb-2">
                <strong className="font-minecraft">Appeals:</strong> If you believe you were unfairly punished, you may appeal through our Discord server.
              </p>
              <p>
                <strong className="font-minecraft">Rule Updates:</strong> These rules may be updated at any time. It's your responsibility to stay informed of any changes.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-10">
          <p className="text-lg mb-4">
            If you have any questions about these rules, please contact a staff member.
          </p>
          <Link href="/server-info" className="minecraft-button inline-block">
            Return to Server Info
          </Link>
        </div>
      </div>
    </>
  )
}
