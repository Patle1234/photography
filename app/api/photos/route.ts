import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Ensure this route is statically rendered for GitHub Pages export
export const dynamic = "force-static"

export async function GET() {
  try {
    const photosDirectory = path.join(process.cwd(), "public", "photos")

    if (!fs.existsSync(photosDirectory)) {
      return NextResponse.json({ photos: [] })
    }

    const files = fs.readdirSync(photosDirectory)

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"]
    const photoFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return imageExtensions.includes(ext) && !file.startsWith(".")
    })

    return NextResponse.json({ photos: photoFiles })
  } catch (error) {
    console.error("Error reading photos directory:", error)
    return NextResponse.json({ photos: [] })
  }
}
