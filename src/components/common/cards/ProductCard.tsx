import React from 'react';
import { Image } from '@nextui-org/react';

interface Props {
  images: File[] | string[];
  title: string;
  description: string;
  price: string;
  currency: '$';
}

// Product Card don't finished look
export const ProductCard: React.FC<Props> = ({
  images,
  title,
  description,
  price,
  currency,
}) => (
  <article className='flex flex-col justify-between w-[250px] h-[330px] bg-[#fefefe] m-auto p-[15px] rounded-lg'>
    <div className='w-[250px]'>
      {images.map((img) => (
        <Image
          key={img instanceof File ? img.lastModified : img}
          className='w-[220px] h-[140px] rounded-sm'
          alt='product_photo'
          src={img instanceof File ? URL.createObjectURL(img) : img}
        />
      ))}
    </div>
    <h2 className='text-lg'>{title || 'Product Name'}</h2>
    <p className='w-[70%] h-[65px] text-xs line-clamp-4 overflow-hidden text-ellipsis'>{description || 'Description...'}</p>
    <p className='ml-auto px-[10px] py-[3px] bg-gray-100 rounded text-lg font-bold text-black-300'>
      {price || '0'}{currency}
    </p>
  </article>
);
