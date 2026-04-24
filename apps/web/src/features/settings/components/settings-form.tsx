"use client";

import { Bell, BrainCircuit, Shield, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AISettings } from "./ai-settings";
import { NotificationSettings } from "./notification-settings";
import { ProfileSettings } from "./profile-settings";
import { SecuritySettings } from "./security-settings";

const tabs = [
  { id: "profile", label: "Profile Details", icon: User },
  { id: "ai", label: "Model Intelligence", icon: BrainCircuit },
  { id: "notifications", label: "Alert Configuration", icon: Bell },
  { id: "security", label: "Access & Security", icon: Shield },
];

export function SettingsForm() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="w-full">
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Settings Navigation */}
        <div className="w-full flex-shrink-0 lg:w-64">
          <nav className="scrollbar-hide flex gap-1 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "group mb-1 flex items-center gap-4 whitespace-nowrap rounded-xl px-3 py-2.5 text-left transition-all lg:whitespace-normal",
                    isActive
                      ? "bg-secondary/50 text-foreground shadow-md"
                      : "text-muted-foreground/40 hover:bg-secondary/20 hover:text-foreground/70",
                  )}
                >
                  <tab.icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground/20 group-hover:text-muted-foreground/40",
                    )}
                  />
                  <span className="font-semibold text-[12px] uppercase tracking-[0.15em]">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area - Expansive exhibit */}
        <div className="max-w-[800px] flex-1">
          <div className="rounded-3xl border border-border/50 bg-background p-12 shadow-lg">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "ai" && <AISettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "security" && <SecuritySettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
