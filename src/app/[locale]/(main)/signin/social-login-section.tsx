"use client";

import { useCallback } from "react";

import { capitalize } from "lodash-es";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { socialLoginAction } from "@/lib/actions/auth";
import { AvailableProviders } from "@/lib/auth";

const availableProviders: {
  provider: AvailableProviders;
  icon: React.ReactNode;
}[] = [
  {
    provider: "github",
    icon: <FaGithub />,
  },
  {
    provider: "google",
    icon: <FaGoogle />,
  },
  {
    provider: "facebook",
    icon: <FaFacebook />,
  },
];

export default function SocialLoginSection() {
  const handleSocialLogin = useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >((e) => {
    socialLoginAction(e.currentTarget.id as AvailableProviders);
  }, []);

  return (
    <div className="flex gap-2">
      {availableProviders.map(({ provider, icon }) => {
        return (
          <Button
            key={provider}
            id={provider}
            variant={"outline"}
            className={"flex-1"}
            onClick={handleSocialLogin}
          >
            {icon}
            {capitalize(provider)}
          </Button>
        );
      })}
    </div>
  );
}
