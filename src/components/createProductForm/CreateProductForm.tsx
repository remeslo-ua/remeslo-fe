'use client';

import { useForm } from 'react-hook-form';
import { PrimaryButton } from '@/components/common/primary/PrimaryButton';
import { PrimaryInput } from '@/components/common/primary/PrimaryInput';
import { productInputs } from './inputs';
import { CustomUploadModal } from '../common/modals/CustomUploadModal';
import { useState } from 'react';
import { PrimaryTextarea } from '../common/primary/PrimaryTextarea';
import { Image } from '@nextui-org/react';
import { ProductCard } from '../common/cards/ProductCard';

interface productFormInputs {
	name: string;
  description: string;
  price: string;
}

export const CreateProductForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<productFormInputs>({
		defaultValues: {
			name: '',
			description: '',
      price: '',
		},
	});
  const [isModal, setIsModal] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const photosUpload = (photos: File[]) => {
    console.log(photos);
    setPhotos((prev) => [...prev, ...photos]);
  };

  const phototsRemove = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

	const onSubmit = async ({ name, description, price }: productFormInputs) => {
    console.log(photos, name, description, price);
	};

  console.log(register('name', {}));

	return (
		<div className='grid grid-cols-2 h-[90vh]'>
      <section className='flex'>
        <ProductCard
          images={photos.length ? photos : ['https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg']}
          title='Name'
          price='100'
          description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus nam magnam, quo eveniet nostrum nemo nobis ipsum? Nisi, deserunt in.'
          currency='$'
        />
      </section>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col gap-3 p-5 justify-center'
			>

        <CustomUploadModal
            isOpen={isModal}
            onModalClose={() => setIsModal(false)}
            onFileUploaded={photosUpload}
            fileFormat='image/png, image/jpeg, image/gif, image/webp, , image/jpg'
            fileFormatTxt='png, jpeg, gif, jpg, webp'
            maxSize={5}
        />

        <div className='flex flex-row gap-3 items-center'>
          {photos.map((photo) => (
            <Image
              key={photo.lastModified}
              className='w-[50px] h-[50px]'
              alt='product_photo'
              src={URL.createObjectURL(photo)}
            />
          ))}

          {!photos.length && (
            <Image
              className='w-[50px] h-[50px]'
              alt='product_photo'
              src='https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg'
            />
          )}

          <PrimaryButton
            type='button'
            text='+'
            onClick={() => setIsModal(true)}
          />
        </div>

				{productInputs.map(
					({ name, label, id, type, validation }) => (
						<PrimaryInput
							key={id}
							name={name}
							label={label}
							type={type}
							register={register}
							validation={validation}
							errors={errors}
						/>
					)
				)}

        <PrimaryTextarea
          name='description'
          label='Description'
          register={register}
          validation={{ required: { value: true, message: 'Description is required' }, }}
          errors={errors}
        />

				<PrimaryButton text='Create Product' />
			</form>
		</div>
	);
};
