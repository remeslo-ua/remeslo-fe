import React from 'react';
import { Image } from '@nextui-org/react';

interface Props {
  images: File[] | string[];
  title: string;
  price: string;
  description: string;
  currency: '$';
}

export const ProductCard: React.FC<Props> = ({
  images,
  title,
  price,
  description,
  currency,
}) => (
  <article className='w-[250px] h-[330px] bg-[#fefefe] m-auto p-[15px] rounded-lg relative'>
    <div className='w-[250px]'>
      {images.map((img) => (
        <Image
          key={img instanceof File ? img.lastModified : img}
          className='w-[220px] h-[140px] rounded-sm mb-[5px]'
          alt='product_photo'
          src={img instanceof File ? URL.createObjectURL(img) : img}
        />
      ))}
    </div>
    <h2 className='text-lg mb-[5px]'>{title}</h2>
    <p className='w-[70%] h-[65px] text-xs line-clamp-4 overflow-hidden text-ellipsis'>{description}</p>
    <p className='absolute bottom-[15px] right-[15px] px-[10px] py-[3px] bg-gray-100 rounded text-lg font-bold text-black-300'>
      {price}{currency}
    </p>
  </article>
);
