"use client";

import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  image_url: string;
  volume_ml: number;
  rating?: number | null;
}

export default function ProductCard({
  id,
  name,
  price,
  original_price,
  image_url,
  volume_ml,
  rating = 0,
}: ProductCardProps) {
  const router = useRouter();

  const hasDiscount = original_price && original_price > price;

  function volumeLabel(ml: number) {
    if (ml >= 1700) return `${(ml / 1000).toFixed(2)} L (Large)`;
    return `${ml} ML (Standard)`;
  }

  return (
    <div
    className="cursor-pointer overflow-hidden rounded-xl"
    onClick={() => router.push(`/product/${id}`)}
    >
      {/* SALE badge */}
      {hasDiscount && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          SALE
        </div>
      )}

      {/* Image */}
      <div className="flex justify-center p-5">
        <img src={image_url} alt={name} className="h-40 object-contain" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-medium text-gray-800 text-sm">{name}</h3>
        <p className="text-xs text-gray-500">{volumeLabel(volume_ml)}</p>

        {/* Price */}
        <div className="mt-1">
          {hasDiscount && (
            <span className="text-gray-400 line-through text-sm mr-1">
              ${original_price?.toFixed(2)}
            </span>
          )}
          <span className="text-red-700 font-semibold">
            ${price.toFixed(2)}
          </span>
        </div>

        {/* Rating */}
        <div className="mt-1 flex items-center gap-1 text-yellow-500 text-sm">
          <span>★</span>
          <span className="text-gray-700">{rating?.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
