"use client";

import { IKContext } from "imagekitio-react";
import { SessionProvider } from "next-auth/react";

const publicKey = process.env.NEXT_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_IMAGEKIT_URL_ENDPOINT;

export default function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      console.error(error);
      throw new Error("Image Authentication request failed.");
    }
  };
  return (
    <SessionProvider>
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        {children}
      </IKContext>
    </SessionProvider>
  );
}
