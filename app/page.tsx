import fs from "fs";
import path from "path";
import PhotoGalleryClient from "../components/photo-gallery-client";

export const revalidate = 3600;

interface Photo {
	id: string;
	src: string;
	alt: string;
}

export default function PhotoGalleryPage() {
	const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
	const photosDirectory = path.join(process.cwd(), "public", "photos");

	let photos: Photo[] = [];

	try {
		if (fs.existsSync(photosDirectory)) {
			const files = fs.readdirSync(photosDirectory);
			const imageExtensions = [
				".jpg",
				".jpeg",
				".png",
				".gif",
				".webp",
				".bmp",
				".svg",
			];

			photos = files
				.filter((file) => {
					const ext = path.extname(file).toLowerCase();
					return imageExtensions.includes(ext) && !file.startsWith(".");
				})
				.map((filename, index) => ({
					id: (index + 1).toString(),
					src: `${basePath}/photos/${filename}`,
					alt: filename.replace(/\.[^/.]+$/, "").replace(/-|_/g, " "),
				}));
		}
	} catch (error) {
		console.error("Error reading photos directory:", error);
	}

	return <PhotoGalleryClient initialPhotos={photos} basePath={basePath} />;
}
