'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useState } from 'react';

interface AgencyAlertModalProps {
  isOpen: boolean;
  onModalClose: () => void;
  onFileUploaded: (file: File[]) => void;
  fileFormat: string;
  fileFormatTxt: string;
  maxSize: number;
}

export const CustomUploadModal = ({
  isOpen,
  onModalClose,
  onFileUploaded,
  fileFormat,
  fileFormatTxt,
  maxSize,
}: AgencyAlertModalProps) => {
  const [error, setError] = useState('');
  return (
    <Modal
      isOpen={isOpen}
      onClose={onModalClose}
      placement="center"
      hideCloseButton
      size="2xl"
      style={{ border: error ? '2px solid #B11B1B' : '' }}
    >
      <ModalContent className="px-4 md:px-14 py-8 bg-white">
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center p-0 mb-5">
              <p className="prose-titleH6 md:prose-titleH5 text-[#2B2E2D]">
                UPLOAD FILE
              </p>
            </ModalHeader>
            <ModalBody className="flex flex-col items-center">
              <div className="h-14">
                {error && (
                  <div className="flex items-center w-full justify-center gap-2">
                    <div>
                      <i className="fa-solid fa-triangle-exclamation fa-2xl" style={{ 'color': '#facc00' }} />
                    </div>
                    <p className="prose-bodyBold md:prose-titleH6 text-[#B11B1B] md:text-[#B11B1B]">
                      {error}
                    </p>
                  </div>
                )}
              </div>
              <div className="bg-[#F3F5F7] p-6 flex flex-col items-center gap-4 border-dashed border-[#0D3460] border-1 md:min-w-[600px] rounded">
                <i className="fa-solid fa-cloud-arrow-down fa-2xl"></i>

                <h5 className="text-center text-[#2B2E2D] prose-bodyBold md:prose-titleH6 mt-4">
                  Select your photo or drag it in here
                </h5>
                <p className="text-xs md:prose-bodyRegular text-[#2B2E2D] text-center">
                  {fileFormatTxt}
                </p>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center p-0">
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                accept={fileFormat}
                onChange={(event) => {
                  setError('');
                  const files: File[] = Array.from(
                    event.target.files ? event.target.files : []
                  );

                  for (const file of files) {
                    const fileSize = file.size / 1024 / 1024; // Convert bytes to megabytes

                    if (fileSize > maxSize) {
                      setError(`file size exceeds ${maxSize}Mb`);
                      return;
                    }
                  };

                  onFileUploaded(files);
                  onModalClose();
                }}
                multiple
              />
              <Button
                variant="ghost"
                onPress={() => document.getElementById('fileInput')?.click()}
                radius="lg"
                className="font-bold text-[#0D3460] w-[360px] mt-4 md:mt-12"
              >
                SELECT FILE
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};