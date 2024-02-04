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
import { PrimaryIconBtn } from '../common/primary/PrimaryIconBtn';

interface productFormInputs {
  photos: File[];
  name: string;
  description: string;
  price: string;
}

export const CreateProductForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<productFormInputs>({
    defaultValues: {
      photos: [],
      name: '',
      description: '',
      price: '',
    },
  });
  const [isModal, setIsModal] = useState(false);

  const addPhotos = (photos: File[]) => {
    setValue('photos', photos);
  };

  const onSubmit = async ({ photos, name, description, price }: productFormInputs) => {
    console.log(photos, name, description, price);
  };

  return (
    <div className='grid grid-cols-2'>
      <section className='flex'>
        <ProductCard
          // rebase or change it logic
          images={watch('photos').length ? watch('photos') : ['https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg']}
          title={watch('name')}
          description={watch('description')}
          price={watch('price')}
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
            onFileUploaded={addPhotos}
            fileFormat='image/png, image/jpeg, image/gif, image/webp, , image/jpg'
            fileFormatTxt='png, jpeg, gif, jpg, webp'
            maxSize={5}
        />

        <div className='flex flex-row gap-3 items-center'>
          {watch('photos').map((photo) => (
            <Image
              key={photo.name}
              className='w-[50px] h-[50px]'
              alt={photo.name}
              src={URL.createObjectURL(photo)}
            />
          ))}

          {!watch('photos').length && (
            <Image
              className='w-[50px] h-[50px]'
              alt='product_photo'
              // donwload another photo with the same content
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
          ({ name, label, id, type, validation, fieldType }) => (
            (fieldType === 'input')
              ? (
                <PrimaryInput
                  key={id}
                  name={name}
                  label={label}
                  type={type}
                  register={register}
                  validation={validation}
                  errors={errors}
                />
              ) : (
                <PrimaryTextarea
                  key={id}
                  name={name}
                  label={label}
                  register={register}
                  validation={validation}
                  errors={errors}
                />
              )
          )
        )}

        <PrimaryButton text='Create Product' />
      </form>
    </div>
  );
};
