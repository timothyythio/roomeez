"use server";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { SignInFormSchema, SignUpFormSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
// import z from "zod";

export async function getCurrentUser() {
  const session = await auth();
  if (!session) return null;

  return session.user;
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) return null;
  return user;
}

//sign in user with credentials (using credentials provider)

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = SignInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    console.log("signInWithCredentials called", user);

    await signIn("credentials", user);
    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error) {
    //let NextJS handle any redirection errors
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid email or password" };
  }
}

//sign out user

export async function signOutUser() {
  //calls the sign out from /auth
  await signOut({ redirectTo: "/", redirect: true });
  console.log("Signed Out Succesfully!");
}

//sign up users

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = SignUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
    const plainPass = user.password;
    user.password = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPass,
    });

    return { success: true, message: "Registered successfully!" };
  } catch (error) {
    //let NextJS handle any redirection errors
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

export async function getHouseholdByUserId(id: string) {
  const res = await prisma.householdMember.findFirst({
    where: { userId: id },
    include: {
      household: {
        include: {
          members: {
            include: {
              user: true, // get name, email, etc.
            },
          },
        },
      },
    },
  });

  return res?.household;
}

export async function getCurrentHousehold() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const res = await prisma.householdMember.findFirst({
    where: { userId },
    include: {
      household: {
        include: {
          members: {
            include: {
              user: true, // get name, email, etc.
            },
          },
        },
      },
    },
  });

  const household = res?.household;
  if (household) {
    household.members = household.members.sort((a, b) => {
      if (a.role === "owner") return -1;
      if (b.role === "owner") return 1;
      return 0;
    });
  }

  return res?.household;
}
