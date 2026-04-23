"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Loader2, Plus, X, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { motion } from "framer-motion";
import { useForm } from "@tanstack/react-form";
import { CreateJobSchema } from "@ai-hackathon/shared";

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
      // Validate with zod manually since we are not using the adapter to avoid dependency issues
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
      className="max-w-4xl mx-auto pb-20"
    >
      <div className="flex items-center gap-4 mb-10">
         <button 
           onClick={() => router.back()}
           className="h-10 w-10 flex items-center justify-center rounded-full border border-border/50 bg-background transition-all hover:bg-secondary"
         >
           <ArrowLeft className="h-4 w-4" />
         </button>
         <div>
            <h1 className="font-display text-[32px] font-light text-foreground tracking-tight leading-none mb-1">Create New Job</h1>
            <p className="text-[13px] text-muted-foreground/60 font-medium tracking-tight">AI will screen candidates against these requirements.</p>
         </div>
      </div>

      <div className="bg-background rounded-section border border-border/50 overflow-hidden shadow-premium">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }} 
          className="p-10 space-y-10"
        >
          <div className="space-y-8">
             <div className="border-b border-border/10 pb-4">
                <h3 className="font-display text-[18px] font-light text-foreground uppercase tracking-[0.1em]">Basic Information</h3>
             </div>

             <div className="grid gap-8 sm:grid-cols-2">
               <form.Field
                 name="title"
                 validators={{
                   onChange: CreateJobSchema.shape.title,
                 }}
                 children={(field) => (
                   <div className="space-y-2">
                     <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                       Job Title <span className="text-destructive">*</span>
                     </Label>
                     <Input
                       placeholder="e.g. Senior Backend Engineer"
                       value={field.state.value}
                       onBlur={field.handleBlur}
                       onChange={(e) => field.handleChange(e.target.value)}
                       className={`h-12 border-border/50 bg-secondary/10 rounded-xl text-[15px] font-medium tracking-tight ${field.state.meta.errors.length ? 'border-destructive/50' : ''}`}
                     />
                     {field.state.meta.errors.length > 0 && (
                       <p className="text-[10px] text-destructive font-bold uppercase tracking-wider pl-1">
                         {field.state.meta.errors[0]?.toString()}
                       </p>
                     )}
                   </div>
                 )}
               />
               
               <form.Field
                 name="department"
                 children={(field) => (
                   <div className="space-y-2">
                     <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Department</Label>
                     <Input
                       placeholder="e.g. Engineering"
                       value={field.state.value}
                       onBlur={field.handleBlur}
                       onChange={(e) => field.handleChange(e.target.value)}
                       className="h-12 border-border/50 bg-secondary/10 rounded-xl text-[15px] font-medium tracking-tight"
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
                 <div className="space-y-2">
                   <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                     Description <span className="text-destructive">*</span>
                   </Label>
                   <Textarea
                     placeholder="Describe the role, responsibilities, and ideal candidate profile..."
                     value={field.state.value}
                     onBlur={field.handleBlur}
                     onChange={(e) => field.handleChange(e.target.value)}
                     className={`min-h-32 resize-none border-border/50 bg-secondary/10 rounded-2xl text-[15px] font-medium tracking-tight leading-relaxed p-4 ${field.state.meta.errors.length ? 'border-destructive/50' : ''}`}
                   />
                   {field.state.meta.errors.length > 0 && (
                     <p className="text-[10px] text-destructive font-bold uppercase tracking-wider pl-1">
                       {field.state.meta.errors[0]?.toString()}
                     </p>
                   )}
                 </div>
               )}
             />

             <div className="grid gap-8 sm:grid-cols-3">
               <form.Field
                 name="location"
                 children={(field) => (
                   <div className="space-y-2">
                     <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Location</Label>
                     <Input
                       placeholder="e.g. Kigali, Rwanda"
                       value={field.state.value}
                       onBlur={field.handleBlur}
                       onChange={(e) => field.handleChange(e.target.value)}
                       className="h-12 border-border/50 bg-secondary/10 rounded-xl text-[15px] font-medium tracking-tight"
                     />
                   </div>
                 )}
               />
               
               <form.Field
                 name="type"
                 children={(field) => (
                   <div className="space-y-2">
                     <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Job Type</Label>
                     <Select
                       value={field.state.value}
                       onValueChange={(value) => field.handleChange(value as any)}
                     >
                       <SelectTrigger className="h-12 border-border/50 bg-secondary/10 rounded-xl text-[15px] font-medium tracking-tight">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl border-border/50 shadow-premium">
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
                   <div className="space-y-2">
                     <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Status</Label>
                     <Select
                       value={field.state.value}
                       onValueChange={(value) => field.handleChange(value as any)}
                     >
                       <SelectTrigger className="h-12 border-border/50 bg-secondary/10 rounded-xl text-[15px] font-medium tracking-tight">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl border-border/50 shadow-premium">
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

          <div className="space-y-8">
             <div className="border-b border-border/10 pb-4">
                <h3 className="font-display text-[18px] font-light text-foreground uppercase tracking-[0.1em]">Detailed Criteria</h3>
             </div>

             <form.Field
               name="requirements"
               validators={{
                 onChange: CreateJobSchema.shape.requirements,
               }}
               children={(field) => (
                 <div className="space-y-4">
                   <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                     Requirements <span className="text-destructive">*</span>
                   </Label>
                   <div className="flex gap-4">
                     <Input
                       placeholder="Add a requirement and press Enter..."
                       value={requirementInput}
                       onChange={(e) => setRequirementInput(e.target.value)}
                       onKeyDown={(e) => handleKeyDown(e, () => {
                         if (requirementInput.trim()) {
                           field.handleChange([...field.state.value, requirementInput.trim()]);
                           setRequirementInput("");
                         }
                       })}
                       className={`h-12 border-border/50 bg-secondary/10 rounded-xl text-[15px] font-medium tracking-tight ${field.state.meta.errors.length ? 'border-destructive/50' : ''}`}
                     />
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => {
                         if (requirementInput.trim()) {
                           field.handleChange([...field.state.value, requirementInput.trim()]);
                           setRequirementInput("");
                         }
                       }}
                       className="h-12 border-border/50 px-6 rounded-xl hover:bg-secondary"
                     >
                       <Plus className="h-4 w-4" />
                     </Button>
                   </div>
                   {field.state.meta.errors.length > 0 && (
                     <p className="text-[10px] text-destructive font-bold uppercase tracking-wider pl-1">
                       {field.state.meta.errors[0]?.toString()}
                     </p>
                   )}
                   {field.state.value.length > 0 && (
                     <div className="mt-4 flex flex-wrap gap-2">
                       {field.state.value.map((req, i) => (
                         <Badge
                           key={i}
                           variant="secondary"
                           className="gap-2 py-2.5 pr-2.5 pl-4 text-[11px] font-bold uppercase tracking-widest bg-secondary/50 border border-border/10 rounded-lg"
                         >
                           {req}
                           <button
                             type="button"
                             onClick={() => field.handleChange(field.state.value.filter((_, idx) => idx !== i))}
                             className="rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
                           >
                             <X className="h-3 w-3" />
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
                 <div className="space-y-4">
                   <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Skills (tags)</Label>
                   <div className="flex gap-4">
                     <Input
                       placeholder="Add a skill and press Enter..."
                       value={skillInput}
                       onChange={(e) => setSkillInput(e.target.value)}
                       onKeyDown={(e) => handleKeyDown(e, () => {
                         if (skillInput.trim()) {
                           field.handleChange([...field.state.value, skillInput.trim()]);
                           setSkillInput("");
                         }
                       })}
                       className="h-12 border-border/50 bg-secondary/10 rounded-xl text-[15px] font-medium tracking-tight"
                     />
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => {
                         if (skillInput.trim()) {
                           field.handleChange([...field.state.value, skillInput.trim()]);
                           setSkillInput("");
                         }
                       }}
                       className="h-12 border-border/50 px-6 rounded-xl hover:bg-secondary"
                     >
                       <Plus className="h-4 w-4" />
                     </Button>
                   </div>
                   {field.state.value.length > 0 && (
                     <div className="mt-4 flex flex-wrap gap-2">
                       {field.state.value.map((skill, i) => (
                         <Badge
                           key={i}
                           variant="outline"
                           className="gap-2 py-2.5 pr-2.5 pl-4 text-[11px] font-bold uppercase tracking-widest bg-primary/5 text-primary border-primary/10 rounded-lg"
                         >
                           {skill}
                           <button
                             type="button"
                             onClick={() => field.handleChange(field.state.value.filter((_, idx) => idx !== i))}
                             className="rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                           >
                             <X className="h-3 w-3" />
                           </button>
                         </Badge>
                       ))}
                     </div>
                   )}
                 </div>
               )}
             />

             <div className="grid gap-8 sm:grid-cols-3">
               <form.Field
                 name="salaryMin"
                 children={(field) => (
                   <div className="space-y-2">
                     <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Min Salary</Label>
                     <Input
                       type="number"
                       placeholder="50000"
                       value={field.state.value ?? ""}
                       onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                       className="h-12 border-border/50 bg-secondary/10 rounded-xl text-[15px] font-medium tracking-tight"
                     />
                   </div>
                 )}
               />
               
               <form.Field
                 name="salaryMax"
                 children={(field) => (
                   <div className="space-y-2">
                     <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Max Salary</Label>
                     <Input
                       type="number"
                       placeholder="120000"
                       value={field.state.value ?? ""}
                       onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                       className="h-12 border-border/50 bg-secondary/10 rounded-xl text-[15px] font-medium tracking-tight"
                     />
                   </div>
                 )}
               />
               
               <form.Field
                 name="closingDate"
                 children={(field) => (
                   <div className="space-y-2">
                     <Label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Closing Date</Label>
                     <Input
                       type="date"
                       value={field.state.value}
                       onChange={(e) => field.handleChange(e.target.value)}
                       className="h-12 border-border/50 bg-secondary/10 rounded-xl text-[15px] font-medium tracking-tight"
                     />
                   </div>
                 )}
               />
             </div>
          </div>

          <div className="flex justify-end gap-5 pt-10 border-t border-border/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/jobs")}
              className="h-12 px-10 rounded-full border-border/50 text-[13px] font-bold uppercase tracking-[0.1em]"
            >
              Discard Changes
            </Button>
            
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || createJob.isPending}
                  className="h-12 px-12 rounded-full bg-primary text-white text-[13px] font-bold uppercase tracking-[0.15em] shadow-premium hover:shadow-lift transition-all"
                >
                  {isSubmitting || createJob.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-3" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Briefcase className="h-4 w-4 mr-3" />
                      Publish Position
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
