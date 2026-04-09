"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LuShuffle } from "react-icons/lu";

interface Photo {
	id: string;
	src: string;
	alt: string;
}

interface PhotoGalleryClientProps {
	initialPhotos: Photo[];
	basePath: string;
}

export default function PhotoGalleryClient({
	initialPhotos,
	basePath,
}: PhotoGalleryClientProps) {
	const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
	const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

	function shufflePhotos() {
		setPhotos((prevPhotos) => {
			const shuffled = [...prevPhotos];
			for (let i = shuffled.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}
			return shuffled;
		});
	}

	return (
		<div className="min-h-screen bg-[#0F172A]">
			<header className="border-b border-gray-800 bg-[#0F172A]/50 backdrop-blur-sm sticky top-0 z-40">
				<div className="container mx-auto px-6 py-8 flex justify-between items-center">
					<h1 className="text-2xl font-light text-white tracking-wide">
						Dev's 📷 Gallery
					</h1>
					<LuShuffle
						onClick={shufflePhotos}
						className="h-6 w-6 text-white cursor-pointer hover:text-gray-300 transition"
					/>
				</div>
			</header>

			<main className="container mx-auto px-6 py-12">
				{photos.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<svg
								className="h-16 w-16 mx-auto mb-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-light text-white mb-2">
							No photos found
						</h3>
						<p className="text-gray-400 max-w-md mx-auto">
							Add your photos to the
							<span className="bg-gray-800 px-2 py-1 rounded text-sm mx-1">
								/public/photos/
							</span>
							folder.
						</p>
					</div>
				) : (
					<div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
						{photos.map((photo, index) => (
							<div
								key={photo.id}
								className="break-inside-avoid mb-4 group cursor-pointer overflow-hidden bg-gray-900 hover:bg-gray-800 transition-all duration-300 rounded-lg"
								onClick={() => setSelectedPhoto(photo)}
							>
								<div className="relative overflow-hidden">
									<Image
										src={photo.src || `${basePath}/placeholder.svg`}
										alt={photo.alt}
										width={400}
										height={600}
										priority={index < 3}
										className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
										sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.src = `${basePath}/placeholder.svg?height=600&width=400`;
										}}
									/>
									<div className="absolute inset-0 bg-[#0F172A]/0 group-hover:bg-[#0F172A]/10 transition-colors duration-300" />
								</div>
							</div>
						))}
					</div>
				)}
			</main>

			{selectedPhoto && (
				<Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
					<DialogContent className="max-w-[95vw] max-h-[95vh] bg-[#0F172A] border-gray-800 p-0 overflow-hidden">
						<DialogTitle className="sr-only">{selectedPhoto.alt}</DialogTitle>
						<div className="relative w-full h-full flex items-center justify-center">
							<div className="relative max-w-full max-h-full">
								<Image
									src={selectedPhoto.src || `${basePath}/placeholder.svg`}
									alt={selectedPhoto.alt}
									width={1200}
									height={800}
									className="max-w-full max-h-[95vh] object-contain"
									onError={(e) => {
										const target = e.target as HTMLImageElement;
										target.src = `${basePath}/placeholder.svg?height=800&width=1200`;
									}}
								/>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
