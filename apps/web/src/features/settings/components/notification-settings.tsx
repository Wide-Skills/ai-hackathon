import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  const handleSave = () => toast.success("Settings saved successfully");

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Notification Preferences</CardTitle>
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
          <div key={i} className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-foreground text-sm">{n.label}</p>
              <p className="mt-0.5 text-muted-foreground text-xs">{n.desc}</p>
            </div>
            <Switch defaultChecked={i < 3} />
          </div>
        ))}
        <Button
          onClick={handleSave}
          className="h-9 gap-2 bg-primary text-sm text-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
