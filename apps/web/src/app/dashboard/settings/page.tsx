"use client";

import {
  Bell,
  BrainCircuit,
  Building,
  Save,
  Shield,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "ai", label: "AI Settings", icon: BrainCircuit },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [autoScreen, setAutoScreen] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highScoreAlert, setHighScoreAlert] = useState(true);

  const handleSave = () => toast.success("Settings saved successfully");

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
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-gray-100 hover:text-slate-900"
                }`}
              >
                <tab.icon className="h-4 w-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 space-y-5">
          {activeTab === "profile" && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">
                  Organization Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50">
                    <Building className="h-7 w-7 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Umurava Inc.</p>
                    <p className="text-slate-500 text-sm">
                      Technology & AI Solutions
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 h-7 text-xs"
                    >
                      Change logo
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-medium text-slate-700 text-sm">
                      First Name
                    </Label>
                    <Input
                      defaultValue="HR"
                      className="h-9 border-gray-200 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-medium text-slate-700 text-sm">
                      Last Name
                    </Label>
                    <Input
                      defaultValue="Manager"
                      className="h-9 border-gray-200 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-medium text-slate-700 text-sm">
                      Email
                    </Label>
                    <Input
                      defaultValue="recruiter@umurava.com"
                      className="h-9 border-gray-200 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-medium text-slate-700 text-sm">
                      Role
                    </Label>
                    <Input
                      defaultValue="Recruitment Manager"
                      className="h-9 border-gray-200 text-sm"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSave}
                  className="h-9 gap-2 bg-blue-600 text-sm text-white hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "ai" && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base">
                    AI Screening Configuration
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <p className="font-semibold text-blue-800 text-sm">
                      Model: Gemini 2.5 Pro
                    </p>
                  </div>
                  <p className="text-blue-600 text-xs">
                    847 / 1,000 screening credits used this month
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blue-200">
                    <div className="h-full w-[84.7%] rounded-full bg-blue-500" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  {[
                    {
                      id: "auto",
                      label: "Auto-screen new applicants",
                      desc: "Automatically run AI screening when a new application is submitted",
                      state: autoScreen,
                      set: setAutoScreen,
                    },
                    {
                      id: "email",
                      label: "Email screening reports",
                      desc: "Send detailed AI analysis to your email after batch screening",
                      state: emailAlerts,
                      set: setEmailAlerts,
                    },
                    {
                      id: "high",
                      label: "High-score notifications",
                      desc: "Get notified when a candidate scores above 85%",
                      state: highScoreAlert,
                      set: setHighScoreAlert,
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium text-slate-900 text-sm">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-slate-500 text-xs">
                          {item.desc}
                        </p>
                      </div>
                      <Switch checked={item.state} onCheckedChange={item.set} />
                    </div>
                  ))}
                </div>

                <Separator />
                <div className="space-y-1.5">
                  <Label className="font-medium text-slate-700 text-sm">
                    Minimum score threshold for shortlisting
                  </Label>
                  <Input
                    type="number"
                    defaultValue="75"
                    className="h-9 w-28 border-gray-200 text-sm"
                    min={0}
                    max={100}
                  />
                  <p className="text-slate-400 text-xs">
                    Candidates above this score are flagged for review
                  </p>
                </div>
                <Button
                  onClick={handleSave}
                  className="h-9 gap-2 bg-blue-600 text-sm text-white hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  Save AI Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  {
                    label: "New application received",
                    desc: "When someone applies to one of your jobs",
                  },
                  {
                    label: "AI screening complete",
                    desc: "When batch AI screening finishes",
                  },
                  {
                    label: "Strong candidate identified",
                    desc: "When AI scores a candidate 85%+",
                  },
                  {
                    label: "Weekly digest",
                    desc: "Summary of pipeline activity every Monday",
                  },
                ].map((n, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium text-slate-900 text-sm">
                        {n.label}
                      </p>
                      <p className="mt-0.5 text-slate-500 text-xs">{n.desc}</p>
                    </div>
                    <Switch defaultChecked={i < 3} />
                  </div>
                ))}
                <Button
                  onClick={handleSave}
                  className="h-9 gap-2 bg-blue-600 text-sm text-white hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="font-medium text-slate-700 text-sm">
                    Current Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-9 border-gray-200 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-medium text-slate-700 text-sm">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-9 border-gray-200 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-medium text-slate-700 text-sm">
                    Confirm New Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-9 border-gray-200 text-sm"
                  />
                </div>
                <Button
                  onClick={handleSave}
                  className="h-9 gap-2 bg-blue-600 text-sm text-white hover:bg-blue-700"
                >
                  <Shield className="h-4 w-4" />
                  Update Password
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
