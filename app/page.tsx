import fs from "fs";
import path from "path";
import PhotoGalleryClient from "../components/photo-gallery-client";

export const revalidate = 3600;

interface Photo {
	id: string;
	src: string;
	thumbnailSrc: string;
	alt: string;
}

const imageExtensions = new Set([
	".jpg",
	".jpeg",
	".png",
	".gif",
	".webp",
	".bmp",
	".svg",
]);

function getPhotoFiles(directory: string, rootDirectory = directory): string[] {
	return fs
		.readdirSync(directory, { withFileTypes: true })
		.filter((entry) => !entry.name.startsWith("."))
		.flatMap((entry) => {
			const entryPath = path.join(directory, entry.name);

			if (entry.isDirectory()) {
				return getPhotoFiles(entryPath, rootDirectory);
			}

			return imageExtensions.has(path.extname(entry.name).toLowerCase())
				? [path.relative(rootDirectory, entryPath)]
				: [];
		})
		.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export default function PhotoGalleryPage() {
	const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
	const photosDirectory = path.join(process.cwd(), "public", "photos");

	let photos: Photo[] = [];

	try {
		if (fs.existsSync(photosDirectory)) {
			photos = getPhotoFiles(photosDirectory).map((relativePath) => {
				const photoPath = relativePath.split(path.sep).join("/");
				const filename = path.basename(relativePath);

				return {
					id: photoPath,
					src: `${basePath}/photos/${photoPath}`,
					thumbnailSrc: `${basePath}/thumbnails/${photoPath}`,
					alt: filename.replace(/\.[^/.]+$/, "").replace(/-|_/g, " "),
				};
			});
		}
	} catch (error) {
		console.error("Error reading photos directory:", error);
	}

	return <PhotoGalleryClient initialPhotos={photos} basePath={basePath} />;
}
