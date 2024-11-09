import { ISocialLogin, telegramLoginAuth } from "@portkey/did-ui-react";

export const socialLoginAuthBySocket = async (): Promise<{
  token: string;
  idToken?: string;
  nonce?: string;
  timestamp?: number;
  provider: ISocialLogin;
} | void> => {
  const token = await telegramLoginAuth();
  return { token, provider: "Telegram" };
};
