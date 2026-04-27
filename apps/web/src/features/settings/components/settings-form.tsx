"use client";

import {
  RiBrainLine,
  RiNotification3Line,
  RiShieldLine,
  RiUserLine,
} from "@remixicon/react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AISettings } from "./ai-settings";
import { NotificationSettings } from "./notification-settings";
import { ProfileSettings } from "./profile-settings";
import { SecuritySettings } from "./security-settings";

const tabs = [
  { id: "profile", label: "Profile", icon: RiUserLine },
  { id: "ai", label: "AI Config", icon: RiBrainLine },
  {
    id: "notifications",
    label: "Notifications",
    icon: RiNotification3Line,
  },
  { id: "security", label: "Security", icon: RiShieldLine },
];

export function SettingsForm() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="w-full pb-section-padding">
      <div className="flex flex-col gap-hero lg:flex-row">
        {/* settings navigation */}
        <div className="w-full flex-shrink-0 lg:w-64">
          <nav className="scrollbar-hide flex gap-1 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "group relative mb-1 flex items-center gap-3 whitespace-nowrap rounded-standard px-3 py-2 text-left transition-all lg:whitespace-normal",
                    isActive
                      ? "bg-bg-deep font-medium text-primary shadow-none"
                      : "text-ink-muted hover:bg-bg-alt hover:text-ink-full",
                  )}
                >
                  <tab.icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-ink-faint group-hover:text-ink-muted",
                    )}
                  />
                  <span className="font-medium font-sans text-[12px] tracking-[0.06em]">
                    {tab.label}
                  </span>

                  {isActive && (
                    <div className="absolute top-1/2 left-0 hidden h-4 w-1 -translate-y-1/2 rounded-r-pill bg-primary lg:block" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* content area */}
        <div className="max-w-[800px] flex-1">
          <Card
            variant="default"
            className="overflow-hidden border-line shadow-none"
            size="none"
          >
            <div className="p-comfortable">
              {activeTab === "profile" && <ProfileSettings />}
              {activeTab === "ai" && <AISettings />}
              {activeTab === "notifications" && <NotificationSettings />}
              {activeTab === "security" && <SecuritySettings />}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
