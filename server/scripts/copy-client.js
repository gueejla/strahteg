import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function copyClientFiles() {
  const clientDist = resolve(__dirname, '../../client/dist')
  const publicDir = resolve(__dirname, '../public')
  
  try {
    // Create public directory if it doesn't exist
    await fs.mkdir(publicDir, { recursive: true })
    
    // Copy all files from client dist to public
    const files = await fs.readdir(clientDist)
    for (const file of files) {
      const sourcePath = resolve(clientDist, file)
      const destPath = resolve(publicDir, file)
      await fs.copyFile(sourcePath, destPath)
    }
    console.log('Successfully copied client files to Next.js public directory')
  } catch (error) {
    console.error('Error copying client files:', error)
    process.exit(1)
  }
}

copyClientFiles() 