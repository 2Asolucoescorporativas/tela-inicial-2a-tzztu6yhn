import { copyFileSync, mkdirSync, existsSync, rmSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = dirname(__dirname)

const publicDir = join(root, 'public')

const sources = [
  join(root, 'src', 'assets', '2arural192x192-6858d.png'),
  join(root, 'src', 'assets', '2arural512x512-224ac.png'),
]

const targets = [join(publicDir, '2ARural192x192.png'), join(publicDir, '2ARural512x512.png')]

for (let i = 0; i < sources.length; i++) {
  if (!existsSync(sources[i])) {
    console.error(`Source file not found: ${sources[i]}`)
    process.exit(1)
  }
  copyFileSync(sources[i], targets[i])
  console.log(`Copied: ${sources[i]} -> ${targets[i]}`)
}

const oldIconsDir = join(publicDir, 'icons')
if (existsSync(oldIconsDir)) {
  rmSync(oldIconsDir, { recursive: true, force: true })
  console.log(`Removed old icons directory: ${oldIconsDir}`)
}

console.log('All icons copied successfully.')
