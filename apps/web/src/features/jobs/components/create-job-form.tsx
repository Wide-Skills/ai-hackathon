"use client";

import { CreateJobSchema, type Job } from "@ai-hackathon/shared";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiCloseLine,
  RiLoader2Line,
} from "@remixicon/react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
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

export function CreateJobForm({ initialData }: { initialData?: Job }) {
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

  const updateJob = useMutation(
    trpc.jobs.update.mutationOptions({
      onSuccess: () => {
        toast.success("Job updated successfully!");
        void invalidateHiringData(queryClient);
        router.push(`/dashboard/jobs/${initialData?.id}`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update job");
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      department: initialData?.department || "",
      location: initialData?.location || "",
      type: (initialData?.type as any) || "Full-time",
      requirements: initialData?.requirements || ([] as string[]),
      skills: initialData?.skills || ([] as string[]),
      techStack: initialData?.techStack || ([] as string[]),
      minExperience: initialData?.minExperience ?? 0,
      educationLevel: (initialData?.educationLevel as any) || "Bachelor's",
      screeningFocus: initialData?.screeningFocus || "",
      salaryMin: initialData?.salaryMin as number | undefined,
      salaryMax: initialData?.salaryMax as number | undefined,
      currency: initialData?.currency || "USD",
      closingDate: initialData?.closingDate || "",
      status: (initialData?.status as any) || "active",
      autoRejectThreshold: initialData?.autoRejectThreshold ?? 50,
      needsReviewThreshold: initialData?.needsReviewThreshold ?? 70,
    },
    onSubmit: async ({ value }) => {
      const result = CreateJobSchema.safeParse(value);
      if (!result.success) {
        toast.error("Invalid form data");
        return;
      }

      if (initialData) {
        updateJob.mutate({ id: initialData.id, data: result.data as any });
      } else {
        createJob.mutate(result.data as any);
      }
    },
  });

  const [requirementInput, setRequirementInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [techStackInput, setTechStackInput] = useState("");

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
            {initialData ? "Edit Job" : "Create Job"}
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
                        <SelectValue>{field.state.value}</SelectValue>
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
                          {field.state.value.charAt(0).toUpperCase() +
                            field.state.value.slice(1)}
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

            <div className="space-y-base rounded-xl border border-primary/10 bg-primary-alpha/5 p-comfortable">
              <div>
                <h4 className="font-medium font-sans text-[11px] text-primary uppercase tracking-widest">
                  AI Screening Parameters
                </h4>
                <p className="font-sans text-[10px] text-ink-muted/60">
                  Configure how the AI should evaluate candidates.
                </p>
              </div>

              <form.Field
                name="screeningFocus"
                children={(field) => (
                  <div className="space-y-micro">
                    <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                      Custom Screening Focus
                    </Label>
                    <Textarea
                      placeholder="e.g. Prioritize architectural experience, leadership skills, or specific industry knowledge."
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="min-h-20 resize-none rounded-standard border-line bg-surface/50 p-3 font-sans text-[13px] text-primary shadow-none focus:bg-surface focus:ring-4 focus:ring-primary-alpha/5"
                    />
                  </div>
                )}
              />

              <div className="grid gap-base sm:grid-cols-2">
                <form.Field
                  name="minExperience"
                  children={(field) => (
                    <div className="space-y-micro">
                      <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                        Min. Experience (Years)
                      </Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        className="h-10 rounded-standard border-line bg-surface/50 font-normal font-sans text-[13px] text-primary shadow-none transition-all focus:bg-surface"
                      />
                    </div>
                  )}
                />

                <form.Field
                  name="educationLevel"
                  children={(field) => (
                    <div className="space-y-micro">
                      <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                        Required Education
                      </Label>
                      <Select
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger className="h-10 w-full rounded-standard border-line bg-surface/50 shadow-none">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent className="border-line bg-surface shadow-none">
                          <SelectItem value="Any">Any Level</SelectItem>
                          <SelectItem value="High School">
                            High School
                          </SelectItem>
                          <SelectItem value="Bachelor's">
                            Bachelor's Degree
                          </SelectItem>
                          <SelectItem value="Master's">
                            Master's Degree
                          </SelectItem>
                          <SelectItem value="PhD">Doctorate (PhD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-base sm:grid-cols-2">
              <form.Field
                name="autoRejectThreshold"
                children={(field) => (
                  <div className="group/field relative space-y-base rounded-xl border border-line bg-bg-alt/5 p-comfortable transition-all hover:bg-bg-alt/10">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                        Auto-Reject Bar
                      </Label>
                      <Badge variant="warning" size="xs" className="font-mono">
                        {field.state.value}%
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-small">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-primary transition-all active:scale-[0.98]"
                      />
                      <p className="font-sans text-[10px] text-ink-muted/60 leading-tight">
                        Candidates scoring below this will be{" "}
                        <span className="font-bold text-status-error-text">
                          auto-rejected
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                )}
              />

              <form.Field
                name="needsReviewThreshold"
                children={(field) => (
                  <div className="group/field relative space-y-base rounded-xl border border-line bg-bg-alt/5 p-comfortable transition-all hover:bg-bg-alt/10">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                        Review Bar
                      </Label>
                      <Badge variant="info" size="xs" className="font-mono">
                        {field.state.value}%
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-small">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-primary transition-all active:scale-[0.98]"
                      />
                      <p className="font-sans text-[10px] text-ink-muted/60 leading-tight">
                        Scores below this will require{" "}
                        <span className="font-bold text-primary">
                          manual oversight
                        </span>
                        .
                      </p>
                    </div>
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

            <div className="grid gap-base sm:grid-cols-2">
              <form.Field
                name="skills"
                children={(field) => (
                  <div className="space-y-micro">
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
                        {field.state.value.map((skill: string, i: number) => (
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
                                  field.state.value.filter(
                                    (_, idx) => idx !== i,
                                  ),
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
                name="techStack"
                children={(field) => (
                  <div className="space-y-micro">
                    <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                      Primary Tech Stack
                    </Label>
                    <div className="flex gap-base">
                      <Input
                        placeholder="Add a technology..."
                        value={techStackInput}
                        onChange={(e) => setTechStackInput(e.target.value)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => {
                            if (techStackInput.trim()) {
                              field.handleChange([
                                ...field.state.value,
                                techStackInput.trim(),
                              ]);
                              setTechStackInput("");
                            }
                          })
                        }
                        className="h-10 rounded-standard border-line bg-bg2 font-normal font-sans text-[13px] text-primary shadow-none transition-all focus:bg-surface"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (techStackInput.trim()) {
                            field.handleChange([
                              ...field.state.value,
                              techStackInput.trim(),
                            ]);
                            setTechStackInput("");
                          }
                        }}
                        className="h-10 rounded-standard border-line px-4 shadow-none hover:bg-bg-alt"
                      >
                        <RiAddLine className="size-4 text-ink-faint" />
                      </Button>
                    </div>
                    {field.state.value.length > 0 && (
                      <div className="mt-base flex flex-wrap gap-small">
                        {field.state.value.map((tech: string, i: number) => (
                          <Badge
                            key={i}
                            variant="success"
                            className="gap-base rounded-micro border border-line py-1 pr-1.5 pl-3 font-medium font-sans text-[11px] uppercase shadow-none"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() =>
                                field.handleChange(
                                  field.state.value.filter(
                                    (_, idx) => idx !== i,
                                  ),
                                )
                              }
                              className="rounded-full p-0.5 transition-colors hover:bg-surface"
                            >
                              <RiCloseLine className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
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
                  disabled={
                    !canSubmit ||
                    isSubmitting ||
                    createJob.isPending ||
                    updateJob.isPending
                  }
                  className="h-10 rounded-standard bg-primary px-10 font-medium font-sans text-[13px] text-white shadow-none"
                >
                  {isSubmitting ||
                  createJob.isPending ||
                  updateJob.isPending ? (
                    <>
                      <RiLoader2Line className="mr-base size-3.5 animate-spin" />
                      {initialData ? "Saving..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <RiBriefcaseLine className="mr-base size-3.5" />
                      {initialData ? "Save Changes" : "Publish Job"}
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
