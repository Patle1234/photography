import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Ensure this route is statically rendered for GitHub Pages export
export const dynamic = "force-static"

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"])

function getPhotoFiles(directory: string, rootDirectory = directory): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith("."))
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        return getPhotoFiles(entryPath, rootDirectory)
      }

      return imageExtensions.has(path.extname(entry.name).toLowerCase())
        ? [path.relative(rootDirectory, entryPath).split(path.sep).join("/")]
        : []
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

export async function GET() {
  try {
    const photosDirectory = path.join(process.cwd(), "public", "photos")

    if (!fs.existsSync(photosDirectory)) {
      return NextResponse.json({ photos: [] })
    }

    return NextResponse.json({ photos: getPhotoFiles(photosDirectory) })
  } catch (error) {
    console.error("Error reading photos directory:", error)
    return NextResponse.json({ photos: [] })
  }
}
