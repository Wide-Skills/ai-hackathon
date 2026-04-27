"use client";

import { RiCameraLine, RiLoader2Line } from "@remixicon/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function ProfileSettings() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const [isUpdating, setIsUpdating] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // update local state when session loads
  useState(() => {
    if (session?.user?.name) {
      const parts = session.user.name.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
    }
  });

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const { error } = await authClient.updateUser({
        name: `${firstName} ${lastName}`.trim(),
      });

      if (error) {
        toast.error(error.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (_err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RiLoader2Line className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-section-gap">
      <section>
        <div className="mb-section-gap border-line border-b pb-base">
          <span className="mb-micro block font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
            User Account
          </span>
          <h3 className="font-serif text-[28px] text-primary leading-tight">
            Profile Details
          </h3>
        </div>

        <div className="mb-section-gap flex items-center gap-base">
          <div className="group relative">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="h-20 w-20 rounded-micro border border-line object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-micro border border-line bg-bg2 font-serif text-[24px] text-ink-faint shadow-none transition-all group-hover:bg-bg-alt/40">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <button className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface shadow-none transition-all hover:bg-bg2 active:scale-90">
              <RiCameraLine className="size-3.5 text-ink-faint" />
            </button>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-[20px] text-primary leading-tight">
              {session?.user?.name || "User"}
            </p>
            <p className="font-light font-sans text-[13px] text-ink-muted">
              {session?.user?.email}
            </p>
            <button className="pt-1 font-medium font-sans text-[11px] text-primary/60 uppercase tracking-[0.06em] transition-colors hover:text-primary">
              Update avatar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-comfortable gap-y-base md:grid-cols-2">
          <div className="space-y-micro">
            <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
              First Name
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-10 w-full rounded-standard border border-line bg-bg2 px-4 font-normal font-sans text-[13px] text-primary outline-none transition-all focus:bg-surface focus:ring-4 focus:ring-primary-alpha/5"
            />
          </div>
          <div className="space-y-micro">
            <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
              Last Name
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-10 w-full rounded-standard border border-line bg-bg2 px-4 font-normal font-sans text-[13px] text-primary outline-none transition-all focus:bg-surface focus:ring-4 focus:ring-primary-alpha/5"
            />
          </div>
          <div className="space-y-micro">
            <label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
              Email Address
            </label>
            <input
              value={session?.user?.email || ""}
              disabled
              className="h-10 w-full cursor-not-allowed rounded-standard border border-line bg-bg-deep/50 px-4 font-normal font-sans text-[13px] text-primary opacity-40 outline-none grayscale"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end border-line border-t pt-section-gap">
        <Button
          onClick={handleSave}
          disabled={isUpdating}
          className="h-10 rounded-standard px-8 font-medium font-sans text-[13px]"
        >
          {isUpdating ? (
            <>
              <RiLoader2Line className="mr-2 size-3.5 animate-spin" />
              Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
