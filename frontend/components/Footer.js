import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-minecraft-black border-t-2 border-minecraft-gold py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Server Info */}
          <div>
            <h3 className="font-minecraft text-minecraft-gold text-lg mb-4">Fusion Network</h3>
            <p className="mb-2">Join our Minecraft server at:</p>
            <div className="minecraft-panel inline-block px-4 py-2">
              <span className="font-minecraft text-minecraft-green">fusion-network.xyz</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-minecraft text-minecraft-gold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rules" className="text-white hover:text-minecraft-green transition">
                  Server Rules
                </Link>
              </li>
              <li>
                <Link href="/staff" className="text-white hover:text-minecraft-green transition">
                  Staff Team
                </Link>
              </li>
              <li>
                <Link href="/forums" className="text-white hover:text-minecraft-green transition">
                  Forums
                </Link>
              </li>
              <li>
                <Link href="https://discord.gg/wk6yJGHkKP" className="text-white hover:text-minecraft-green transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h3 className="font-minecraft text-minecraft-gold text-lg mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://discord.gg/wk6yJGHkKP" target="_blank" rel="noopener noreferrer" className="text-white hover:text-minecraft-blue transition">
                <FontAwesomeIcon icon={faDiscord} size="2x" />
              </a>
              <a href="https://www.instagram.com/fusionnetworkofficial/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-minecraft-pink transition">
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              <a href="https://www.youtube.com/@FusionNetworkMC" target="_blank" rel="noopener noreferrer" className="text-white hover:text-minecraft-red transition">
                <FontAwesomeIcon icon={faYoutube} size="2x" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-minecraft-stone mt-6 pt-6 text-center">
          <p>&copy; {currentYear} Fusion Network. All rights reserved.</p>
          <p className="text-sm mt-2">
            This site is not affiliated with Mojang or Microsoft.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
