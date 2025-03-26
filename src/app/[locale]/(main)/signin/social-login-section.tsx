"use client";

import { useActionState } from "react";

import { capitalize } from "lodash-es";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { initState } from "@/lib/action";
import { AvailableProviders } from "@/lib/auth";
import { socialLoginAction } from "@/server-actions/auth";

const socialLoginTypes: {
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
  return (
    <div className="flex gap-2">
      {socialLoginTypes.map((socialLoginType) => {
        return (
          <SocialLoginForm
            key={socialLoginType.provider}
            {...socialLoginType}
          />
        );
      })}
    </div>
  );
}

function SocialLoginForm({
  provider,
  icon,
}: (typeof socialLoginTypes)[number]) {
  const [state, dispatch, isPending] = useActionState(
    socialLoginAction.bind(null, provider),
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

  return (
    <form action={dispatch} className="flex-1">
      <Button variant="outline" className="w-full" disabled={isPending}>
        {icon}
        {capitalize(provider)}
      </Button>
    </form>
  );
}
