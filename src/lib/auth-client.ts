"use client";

import { createAuthClient } from "better-auth/react";
import { emailOTPClient, inferAdditionalFields, twoFactorClient } from "better-auth/client/plugins";

// The sign-in form handles the two-step redirect itself, so it can keep the ?next= destination.
export const authClient = createAuthClient({ plugins: [emailOTPClient(), twoFactorClient(), inferAdditionalFields({ user: { phone: { type: "string", required: false } } })] });

export const { signIn, signUp, signOut, useSession } = authClient;
