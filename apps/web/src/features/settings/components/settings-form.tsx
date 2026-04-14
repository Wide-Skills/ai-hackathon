"use client";

import { Bell, BrainCircuit, Shield, User } from "lucide-react";
import { useState } from "react";
import { AISettings } from "./ai-settings";
import { NotificationSettings } from "./notification-settings";
import { ProfileSettings } from "./profile-settings";
import { SecuritySettings } from "./security-settings";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "ai", label: "AI Settings", icon: BrainCircuit },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export function SettingsForm() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex gap-6">
        <div className="w-52 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 space-y-5">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "ai" && <AISettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}
