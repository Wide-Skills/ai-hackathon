import { Building, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function ProfileSettings() {
  const handleSave = () => toast.success("Settings saved successfully");

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Organization Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
            <Building className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Umurava Inc.</p>
            <p className="text-muted-foreground text-sm">
              Technology & AI Solutions
            </p>
            <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">
              Change logo
            </Button>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-medium text-foreground/80 text-sm">
              First Name
            </Label>
            <Input defaultValue="HR" className="h-9 border-border text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="font-medium text-foreground/80 text-sm">
              Last Name
            </Label>
            <Input
              defaultValue="Manager"
              className="h-9 border-border text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-medium text-foreground/80 text-sm">
              Email
            </Label>
            <Input
              defaultValue="recruiter@umurava.com"
              className="h-9 border-border text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-medium text-foreground/80 text-sm">
              Role
            </Label>
            <Input
              defaultValue="Recruitment Manager"
              className="h-9 border-border text-sm"
            />
          </div>
        </div>
        <Button
          onClick={handleSave}
          className="h-9 gap-2 bg-primary text-foreground text-sm hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
