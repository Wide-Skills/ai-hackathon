"use client";

import { CreateJobSchema } from "@ai-hackathon/shared";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiCloseLine,
  RiLoader2Line,
} from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { invalidateHiringData, trpc } from "@/utils/trpc";

export function CreateJobForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createJob = useMutation(
    trpc.jobs.create.mutationOptions({
      onSuccess: () => {
        toast.success("Job created successfully!");
        void invalidateHiringData(queryClient);
        router.push("/dashboard/jobs");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create job");
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      department: "",
      location: "",
      type: "Full-time" as const,
      requirements: [] as string[],
      skills: [] as string[],
      salaryMin: undefined as number | undefined,
      salaryMax: undefined as number | undefined,
      currency: "USD",
      closingDate: "",
      status: "active" as const,
    },
    onSubmit: async ({ value }) => {
      const result = CreateJobSchema.safeParse(value);
      if (!result.success) {
        toast.error("Invalid form data");
        return;
      }
      createJob.mutate(result.data as any);
    },
  });

  const [requirementInput, setRequirementInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl pb-20"
    >
      <div className="mb-section-gap flex items-center gap-base">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-micro border border-line bg-surface shadow-none transition-all hover:bg-bg-alt active:scale-95"
        >
          <RiArrowLeftLine className="size-4 text-ink-faint" />
        </button>
        <div>
          <span className="mb-micro block font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
            Job Setup
          </span>
          <h1 className="font-serif text-[32px] text-primary leading-tight">
            Create Job
          </h1>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-line bg-surface shadow-none">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-section-gap p-comfortable"
        >
          <div className="space-y-base">
            <div className="border-line border-b pb-base">
              <h3 className="font-serif text-[22px] text-primary">
                Job Details
              </h3>
            </div>

            <div className="grid gap-base sm:grid-cols-2">
              <form.Field
                name="title"
                validators={{
                  onChange: CreateJobSchema.shape.title,
                }}
                children={(field) => (
                  <div className="space-y-micro">
                    <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                      Job Title{" "}
                      <span className="text-status-error-text">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. Senior Backend Engineer"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`h-10 rounded-standard border-line bg-bg2 font-normal font-sans text-[13px] text-primary shadow-none transition-all focus:bg-surface ${field.state.meta.errors.length ? "border-status-error-text/50" : ""}`}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="pl-1 font-medium font-sans text-[10px] text-status-error-text uppercase tracking-wider">
                        {field.state.meta.errors[0]?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="department"
                children={(field) => (
                  <div className="space-y-micro">
                    <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                      Department
                    </Label>
                    <Input
                      placeholder="e.g. Engineering"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-10 rounded-standard border-line bg-bg2 font-normal font-sans text-[13px] text-primary shadow-none transition-all focus:bg-surface"
                    />
                  </div>
                )}
              />
            </div>

            <form.Field
              name="description"
              validators={{
                onChange: CreateJobSchema.shape.description,
              }}
              children={(field) => (
                <div className="space-y-micro">
                  <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                    Job Description{" "}
                    <span className="text-status-error-text">*</span>
                  </Label>
                  <Textarea
                    placeholder="Describe the role and responsibilities..."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`min-h-40 resize-none rounded-standard border-line bg-bg2 p-4 font-light font-sans text-[14px] text-primary leading-relaxed shadow-none transition-all focus:bg-surface ${field.state.meta.errors.length ? "border-status-error-text/50" : ""}`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="pl-1 font-medium font-sans text-[10px] text-status-error-text uppercase tracking-wider">
                      {field.state.meta.errors[0]?.toString()}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="grid gap-base sm:grid-cols-3">
              <form.Field
                name="location"
                children={(field) => (
                  <div className="space-y-micro">
                    <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                      Location
                    </Label>
                    <Input
                      placeholder="e.g. Remote"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-10 rounded-standard border-line bg-bg2 font-normal font-sans text-[13px] text-primary shadow-none transition-all focus:bg-surface"
                    />
                  </div>
                )}
              />

              <form.Field
                name="type"
                children={(field) => (
                  <div className="space-y-micro">
                    <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                      Employment Type
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as any)
                      }
                    >
                      <SelectTrigger className="h-10 rounded-standard border-line bg-bg2 font-medium font-sans text-[12px] text-primary shadow-none">
                        <SelectValue>
                          {field.state.value}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="border-line bg-surface shadow-none">
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              <form.Field
                name="status"
                children={(field) => (
                  <div className="space-y-micro">
                    <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                      Job Status
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as any)
                      }
                    >
                      <SelectTrigger className="h-10 rounded-standard border-line bg-bg2 font-medium font-sans text-[12px] text-primary shadow-none">
                        <SelectValue>
                          {field.state.value.charAt(0).toUpperCase() + field.state.value.slice(1)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="border-line bg-surface shadow-none">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="space-y-base">
            <div className="border-line border-b pb-base">
              <h3 className="font-serif text-[22px] text-primary">
                Requirements
              </h3>
            </div>

            <form.Field
              name="requirements"
              validators={{
                onChange: CreateJobSchema.shape.requirements,
              }}
              children={(field) => (
                <div className="space-y-base">
                  <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                    Key Requirements{" "}
                    <span className="text-status-error-text">*</span>
                  </Label>
                  <div className="flex gap-base">
                    <Input
                      placeholder="Add a requirement and press Enter..."
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => {
                          if (requirementInput.trim()) {
                            field.handleChange([
                              ...field.state.value,
                              requirementInput.trim(),
                            ]);
                            setRequirementInput("");
                          }
                        })
                      }
                      className={`h-10 rounded-standard border-line bg-bg2 font-normal font-sans text-[13px] text-primary shadow-none transition-all focus:bg-surface ${field.state.meta.errors.length ? "border-status-error-text/50" : ""}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (requirementInput.trim()) {
                          field.handleChange([
                            ...field.state.value,
                            requirementInput.trim(),
                          ]);
                          setRequirementInput("");
                        }
                      }}
                      className="h-10 rounded-standard border-line px-4 shadow-none hover:bg-bg-alt"
                    >
                      <RiAddLine className="size-4 text-ink-faint" />
                    </Button>
                  </div>
                  {field.state.value.length > 0 && (
                    <div className="mt-base flex flex-wrap gap-small">
                      {field.state.value.map((req, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="gap-base rounded-micro border border-line bg-bg2 py-1 pr-1.5 pl-3 font-medium font-sans text-[11px] text-primary uppercase"
                        >
                          {req}
                          <button
                            type="button"
                            onClick={() =>
                              field.handleChange(
                                field.state.value.filter((_, idx) => idx !== i),
                              )
                            }
                            className="rounded-full p-0.5 transition-colors hover:bg-surface"
                          >
                            <RiCloseLine className="size-3 text-ink-faint" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            />

            <form.Field
              name="skills"
              children={(field) => (
                <div className="space-y-base">
                  <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                    Skill Tags
                  </Label>
                  <div className="flex gap-base">
                    <Input
                      placeholder="Add a skill tag..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => {
                          if (skillInput.trim()) {
                            field.handleChange([
                              ...field.state.value,
                              skillInput.trim(),
                            ]);
                            setSkillInput("");
                          }
                        })
                      }
                      className="h-10 rounded-standard border-line bg-bg2 font-normal font-sans text-[13px] text-primary shadow-none transition-all focus:bg-surface"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (skillInput.trim()) {
                          field.handleChange([
                            ...field.state.value,
                            skillInput.trim(),
                          ]);
                          setSkillInput("");
                        }
                      }}
                      className="h-10 rounded-standard border-line px-4 shadow-none hover:bg-bg-alt"
                    >
                      <RiAddLine className="size-4 text-ink-faint" />
                    </Button>
                  </div>
                  {field.state.value.length > 0 && (
                    <div className="mt-base flex flex-wrap gap-small">
                      {field.state.value.map((skill, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="gap-base rounded-micro border border-line bg-bg-deep py-1 pr-1.5 pl-3 font-medium font-sans text-[11px] text-primary uppercase"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() =>
                              field.handleChange(
                                field.state.value.filter((_, idx) => idx !== i),
                              )
                            }
                            className="rounded-full p-0.5 transition-colors hover:bg-surface"
                          >
                            <RiCloseLine className="size-3 text-ink-faint" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex justify-end gap-base border-line border-t pt-section-gap">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/jobs")}
              className="h-10 rounded-standard border-line px-8 font-medium font-sans text-[13px]"
            >
              Discard Changes
            </Button>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || createJob.isPending}
                  className="h-10 rounded-standard bg-primary px-10 font-medium font-sans text-[13px] text-white shadow-none"
                >
                  {isSubmitting || createJob.isPending ? (
                    <>
                      <RiLoader2Line className="mr-base size-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <RiBriefcaseLine className="mr-base size-3.5" />
                      Publish Job
                    </>
                  )}
                </Button>
              )}
            />
          </div>
        </form>
      </div>
    </motion.div>
  );
}
