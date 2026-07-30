import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = dirname(__dirname)

const iconsDir = join(root, 'public', 'icons')
mkdirSync(iconsDir, { recursive: true })

const publicDir = join(root, 'public')

const copies = [
  {
    from: join(root, 'src', 'assets', '2arural192x192-6858d.png'),
    to: join(publicDir, '2ARural192x192.png'),
  },
  {
    from: join(root, 'src', 'assets', '2arural512x512-224ac.png'),
    to: join(publicDir, '2ARural512x512.png'),
  },
  {
    from: join(root, 'src', 'assets', '2arural192x192-6858d.png'),
    to: join(iconsDir, '2ARural192x192.png'),
  },
  {
    from: join(root, 'src', 'assets', '2arural512x512-224ac.png'),
    to: join(iconsDir, '2ARural512x512.png'),
  },
]

for (const { from, to } of copies) {
  if (!existsSync(from)) {
    console.error(`Source file not found: ${from}`)
    process.exit(1)
  }
  copyFileSync(from, to)
  console.log(`Copied: ${from} -> ${to}`)
}

console.log('All icons copied successfully.')
