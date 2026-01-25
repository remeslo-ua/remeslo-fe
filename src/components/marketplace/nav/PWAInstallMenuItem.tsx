"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, NavbarMenuItem, useDisclosure } from "@nextui-org/react";
import amplitude from "@/analitics/amplitude/amplitude";
import PWAInstallModal from "@/components/PWAInstallModal";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string[] }>;
};

const track = (eventName: string, properties?: Record<string, unknown>) => {
  try {
    (amplitude as any)?.track?.(eventName, properties);
  } catch (_error) {
    // ignore tracking errors
  }
};

const isStandalone = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
};

export const PWAInstallMenuItem: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canShowInstall, setCanShowInstall] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const isIOS = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  }, []);

  useEffect(() => {
    setIsInstalled(isStandalone());

    const media = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = () => setIsInstalled(isStandalone());
    media.addEventListener("change", handleDisplayModeChange);

    const onInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      track("pwa_appinstalled");
    };

    const handleBeforeInstall = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(promptEvent);
      setCanShowInstall(true);
      track("pwa_beforeinstallprompt_captured");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall as EventListener);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      media.removeEventListener("change", handleDisplayModeChange);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall as EventListener);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (isIOS && !isInstalled) {
      setCanShowInstall(true);
    }
  }, [isIOS, isInstalled]);

  const handleInstallClick = useCallback(async () => {
    if (isInstalled) return;

    if (isIOS) {
      onOpen();
      track("pwa_ios_instructions_shown");
      return;
    }

    if (deferredPrompt) {
      track("pwa_install_prompt_shown");
      deferredPrompt.prompt();

      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === "accepted") {
        track("pwa_install_accept");
      } else {
        track("pwa_install_dismiss");
      }
      setDeferredPrompt(null);
    }
  }, [deferredPrompt, isIOS, isInstalled, onOpen]);

  if (!canShowInstall || isInstalled) {
    return null;
  }

  return (
    <>
      <NavbarMenuItem>
        <Button
          fullWidth
          color="primary"
          variant="flat"
          onPress={handleInstallClick}
          aria-label="Install app"
        >
          Install app
        </Button>
      </NavbarMenuItem>
      <PWAInstallModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default PWAInstallMenuItem;
