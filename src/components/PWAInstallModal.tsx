"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const PWAInstallModal: React.FC<Props> = ({ isOpen, onOpenChange }) => (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm" placement="center">
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">Install on iOS</ModalHeader>
          <ModalBody>
            <ol className="list-decimal space-y-2 pl-4 text-sm">
              <li>Open this site in Safari.</li>
              <li>Tap the Share icon (square with an arrow).</li>
              <li>Select “Add to Home Screen”, then tap Add.</li>
            </ol>
            <p className="text-xs text-default-500">
              Tip: If the toolbar is hidden, tap the top of the screen to reveal the Share button.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose} fullWidth>
              Got it
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);

export default PWAInstallModal;
