import { BrainCircuit, Save, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function AISettings() {
  const [autoScreen, setAutoScreen] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highScoreAlert, setHighScoreAlert] = useState(true);

  const handleSave = () => toast.success("Settings saved successfully");

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">AI Screening Configuration</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
          <div className="mb-1 flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <p className="font-semibold text-primary/90 text-sm">
              Model: Gemini 2.5 Pro
            </p>
          </div>
          <p className="text-primary text-xs">
            847 / 1,000 screening credits used this month
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary/20">
            <div className="h-full w-[84.7%] rounded-full bg-primary" />
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
                <p className="font-medium text-foreground text-sm">
                  {item.label}
                </p>
                <p className="mt-0.5 text-muted-foreground text-xs">
                  {item.desc}
                </p>
              </div>
              <Switch checked={item.state} onCheckedChange={item.set} />
            </div>
          ))}
        </div>

        <Separator />
        <div className="space-y-1.5">
          <Label className="font-medium text-foreground/80 text-sm">
            Minimum score threshold for shortlisting
          </Label>
          <Input
            type="number"
            defaultValue="75"
            className="h-9 w-28 border-border text-sm"
            min={0}
            max={100}
          />
          <p className="text-muted-foreground/70 text-xs">
            Candidates above this score are flagged for review
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="h-9 gap-2 bg-primary text-sm text-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          Save AI Settings
        </Button>
      </CardContent>
    </Card>
  );
}
