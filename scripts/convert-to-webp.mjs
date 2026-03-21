import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'

const IMG_DIR = 'public/img'
const LOGO_FILE = 'public/logo.png'

async function convertToWebp(inputPath) {
  const outputPath = inputPath.replace(/\.png$/i, '.webp')
  const before = (await stat(inputPath)).size
  await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath)
  const after = (await stat(outputPath)).size
  const saved = ((1 - after / before) * 100).toFixed(0)
  console.log(`  ${basename(inputPath)}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (${saved}% saved)`)
}

async function main() {
  console.log('Converting images to WebP...\n')

  // Convert all PNGs in img directory
  const files = await readdir(IMG_DIR)
  const pngs = files.filter(f => f.endsWith('.png'))

  for (const file of pngs) {
    await convertToWebp(join(IMG_DIR, file))
  }

  // Convert logo
  await convertToWebp(LOGO_FILE)

  console.log('\nDone!')
}

main().catch(console.error)
