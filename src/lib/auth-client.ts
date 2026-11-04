"use client";

import { createAuthClient } from "better-auth/react";
import { emailOTPClient, twoFactorClient } from "better-auth/client/plugins";

// The sign-in form handles the two-step redirect itself, so it can keep the ?next= destination.
export const authClient = createAuthClient({ plugins: [emailOTPClient(), twoFactorClient()] });

export const { signIn, signUp, signOut, useSession } = authClient;
