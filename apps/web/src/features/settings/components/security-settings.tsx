import { Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SecuritySettings() {
  const handleSave = () => toast.success("Settings saved successfully");

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <Label className="font-medium text-foreground/80 text-sm">
            Current Password
          </Label>
          <Input
            type="password"
            placeholder="••••••••"
            className="h-9 border-border text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="font-medium text-foreground/80 text-sm">
            New Password
          </Label>
          <Input
            type="password"
            placeholder="••••••••"
            className="h-9 border-border text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="font-medium text-foreground/80 text-sm">
            Confirm New Password
          </Label>
          <Input
            type="password"
            placeholder="••••••••"
            className="h-9 border-border text-sm"
          />
        </div>
        <Button
          onClick={handleSave}
          className="h-9 gap-2 bg-primary text-foreground text-sm hover:bg-primary/90"
        >
          <Shield className="h-4 w-4" />
          Update Password
        </Button>
      </CardContent>
    </Card>
  );
}
