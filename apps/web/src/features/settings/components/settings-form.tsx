"use client";

import { Bell, BrainCircuit, Shield, User } from "lucide-react";
import { useState } from "react";
import { AISettings } from "./ai-settings";
import { NotificationSettings } from "./notification-settings";
import { ProfileSettings } from "./profile-settings";
import { SecuritySettings } from "./security-settings";
import { cn } from "@/lib/utils";

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
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-all whitespace-nowrap lg:whitespace-normal group mb-1",
                    isActive
                      ? "bg-secondary/50 text-foreground shadow-ethereal"
                      : "text-muted-foreground/40 hover:text-foreground/70 hover:bg-secondary/20"
                  )}
                >
                  <tab.icon className={cn(
                    "h-4 w-4 flex-shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground/20 group-hover:text-muted-foreground/40"
                  )} />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.15em]">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area - Expansive exhibit */}
        <div className="flex-1 max-w-[800px]">
          <div className="bg-background rounded-section border border-border/50 p-12 shadow-premium">
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
