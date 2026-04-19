"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { RootState } from "@/store";
import { setCreateModalOpen } from "@/store/slices/jobsSlice";
import { trpc } from "@/utils/trpc";

interface CreateJobDialogProps {
  trigger?: React.ReactElement;
}

const initialFormState = {
  title: "",
  description: "",
  department: "",
  location: "",
  type: "Full-time" as const,
  requirements: [] as string[],
  skills: [] as string[],
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  closingDate: "",
  status: "active" as const,
};

export function CreateJobDialog({ trigger }: CreateJobDialogProps) {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.jobs.isCreateModalOpen);
  const setOpen = (isOpen: boolean) => dispatch(setCreateModalOpen(isOpen));

  const [form, setForm] = useState(initialFormState);
  const [requirementInput, setRequirementInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const queryClient = useQueryClient();

  const createJob = useMutation(
    trpc.jobs.create.mutationOptions({
      onSuccess: () => {
        toast.success("Job created successfully!");
        queryClient.invalidateQueries({ queryKey: trpc.jobs.list.queryKey() });
        setOpen(false);
        setForm(initialFormState);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create job");
      },
    }),
  );

  const addRequirement = () => {
    const trimmed = requirementInput.trim();
    if (trimmed && !form.requirements.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        requirements: [...prev.requirements, trimmed],
      }));
      setRequirementInput("");
    }
  };

  const removeRequirement = (req: string) => {
    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((r) => r !== req),
    }));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    action: () => void,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Job description is required");
      return;
    }
    if (form.requirements.length === 0) {
      toast.error("At least one requirement is needed");
      return;
    }

    const parseSalary = (val: string) => {
      const cleaned = val.replace(/[^0-9.]/g, "");
      return cleaned ? Number(cleaned) : undefined;
    };

    createJob.mutate({
      title: form.title,
      description: form.description,
      department: form.department || undefined,
      location: form.location || undefined,
      type: form.type,
      requirements: form.requirements,
      skills: form.skills,
      salaryMin: parseSalary(form.salaryMin),
      salaryMax: parseSalary(form.salaryMax),
      currency: form.currency,
      closingDate: form.closingDate || undefined,
      status: form.status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          (trigger as React.ReactElement) || (
            <Button
              size="sm"
              className="h-9 gap-1.5 rounded-lg bg-primary font-semibold text-white hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              New Job
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-bold text-lg">
                Create New Job
              </DialogTitle>
              <DialogDescription className="text-sm">
                Define the position and AI will screen candidates against these
                requirements.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Title & Department */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="font-medium text-sm">
                Job Title <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g. Senior Backend Engineer"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="h-9 border-border text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-medium text-sm">Department</Label>
              <Input
                placeholder="e.g. Engineering"
                value={form.department}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, department: e.target.value }))
                }
                className="h-9 border-border text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="font-medium text-sm">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Describe the role, responsibilities, and ideal candidate profile..."
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="min-h-24 resize-none border-border text-sm"
            />
          </div>

          {/* Location & Type */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="font-medium text-sm">Location</Label>
              <Input
                placeholder="e.g. Kigali, Rwanda"
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
                className="h-9 border-border text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-medium text-sm">Job Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    type: value as typeof form.type,
                  }))
                }
              >
                <SelectTrigger className="h-9 border-border text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-medium text-sm">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    status: value as typeof form.status,
                  }))
                }
              >
                <SelectTrigger className="h-9 border-border text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-1.5">
            <Label className="font-medium text-sm">
              Requirements <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a requirement and press Enter..."
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addRequirement)}
                className="h-9 border-border text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequirement}
                className="h-9 border-border px-3"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            {form.requirements.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {form.requirements.map((req) => (
                  <Badge
                    key={req}
                    variant="secondary"
                    className="gap-1 py-1 pr-1 pl-2.5 text-xs"
                  >
                    {req}
                    <button
                      type="button"
                      onClick={() => removeRequirement(req)}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-1.5">
            <Label className="font-medium text-sm">Skills (tags)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill and press Enter..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, addSkill)}
                className="h-9 border-border text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSkill}
                className="h-9 border-border px-3"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            {form.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {form.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="gap-1 border-primary/20 bg-primary/10 py-1 pr-1 pl-2.5 text-primary text-xs"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Salary Range */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="font-medium text-sm">Min Salary</Label>
              <Input
                type="number"
                placeholder="50000"
                value={form.salaryMin}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, salaryMin: e.target.value }))
                }
                className="h-9 border-border text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-medium text-sm">Max Salary</Label>
              <Input
                type="number"
                placeholder="120000"
                value={form.salaryMax}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, salaryMax: e.target.value }))
                }
                className="h-9 border-border text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-medium text-sm">Closing Date</Label>
              <Input
                type="date"
                value={form.closingDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, closingDate: e.target.value }))
                }
                className="h-9 border-border text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createJob.isPending}
              className="gap-2 bg-primary font-semibold text-white hover:bg-primary/90"
            >
              {createJob.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Briefcase className="h-4 w-4" />
                  Create Job
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
