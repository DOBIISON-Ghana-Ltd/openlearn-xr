'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZOnboardingMetadata, IOnboardingMetadata, IOnboardingRole } from '@/store/onboarding/schema'
import { useOnboardingStore } from '@/store/onboarding/store'
import { Tabs, TabsPanel } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError } from '@/components/ui/field'
import useApi from '@/data/hooks/use-api'
import { nuqs } from '@/lib/utils/nuqs'
import { ROUTES } from '@/lib/constants/routes'
import { toastManager } from '@/components/ui/toast'
import { LoaderIcon, GraduationCap, BookOpen, Compass, Check, Atom, FlaskConical, Dna, ChevronLeftIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { authClient } from '@/adapters/auth/client'

type IForm = IOnboardingMetadata;

const roles = [
  {
    id: 'educator' as const,
    label: 'For teaching',
    description: 'Collaborate on labs and build courses.',
    icon: GraduationCap,
  },
  {
    id: 'student' as const,
    label: 'For learning',
    description: 'Explore virtual labs and study.',
    icon: BookOpen,
  },
  {
    id: 'other' as const,
    label: 'For personal use',
    description: 'Experiment and learn on your own.',
    icon: Compass,
  },
];

const subjectsList = [
  {
    id: 'Physics' as const,
    label: 'Physics',
    description: 'Explore mechanics, light, and forces in 3D.',
    icon: Atom,
  },
  {
    id: 'Chemistry' as const,
    label: 'Chemistry',
    description: 'Experiment with elements, reactions, and atoms.',
    icon: FlaskConical,
  },
  {
    id: 'Biology' as const,
    label: 'Biology',
    description: 'Discover DNA, cells, and ecosystems.',
    icon: Dna,
  },
];

export default function ClientPage() {
  const [params] = nuqs.getStates("onboarding");
  const router = useRouter();
  const { mutate: completeOnboarding, isPending } = useApi.mutate("public:user:patch:onboarding");

  const { currentTab, setTab, updateMetadata, clearStore } = useOnboardingStore();
  const [mounted, setMounted] = useState(false);

  const { handleSubmit, control, trigger, watch, formState: { errors }, reset } = useForm<IForm>({
    resolver: zodResolver(ZOnboardingMetadata),
    defaultValues: {
      role: undefined,
      school: '',
      subjects: [],
    }
  });

  // Client-side hydration safety: load persisted values and set mounted
  useEffect(() => {
    const persistedMetadata = useOnboardingStore.getState().metadata;
    reset({
      role: persistedMetadata.role,
      school: persistedMetadata.school || '',
      subjects: persistedMetadata.subjects || [],
    });
    setMounted(true);

    if (!persistedMetadata.role) {
      setTab('role');
    }
  }, [reset, setTab]);

  // Sync form edits to Zustand store on change
  useEffect(() => {
    const subscription = watch((value) => {
      updateMetadata({
        role: value.role as IOnboardingRole,
        school: value.school,
        subjects: value.subjects as string[],
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateMetadata]);

  const handleNext = async () => {
    if (currentTab === 'role') {
      const isValid = await trigger(['role']);
      if (isValid) setTab('school');
    } else if (currentTab === 'school') {
      const isValid = await trigger(['school']);
      if (isValid) setTab('interests');
    }
  };

  const handleBack = () => {
    if (currentTab === 'interests') {
      setTab('school');
    } else if (currentTab === 'school') {
      setTab('role');
    }
  };

  const onSubmit = (data: IForm) => {
    completeOnboarding(data, {
      onSuccess: async () => {
        toastManager.add({
          title: "Welcome to OpenLearn! Setup completed.",
          type: "success"
        });
        await authClient.getSession();
        router.push(params.redirect || ROUTES.APP.DASHBOARD);
        clearStore();
      },
      onError: (err) => {
        toastManager.add({
          title: err.message || "Something went wrong. Please try again.",
          type: "error"
        });
      }
    });
  };

  if (!mounted) {
    return (
      <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-12">
        <div className="text-center mb-10 max-w-2xl px-4">
          <LoaderIcon className="animate-spin size-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 py-10 px-4 min-h-[85vh] flex flex-col justify-center">

      {/* Minimal Header with Progress */}
      <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center w-full text-xs text-muted-foreground font-medium select-none h-4">
          {currentTab !== 'role' ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center hover:text-foreground transition-colors cursor-pointer text-xs font-normal"
            >
              <ChevronLeftIcon className='size-4' />
              <span>go back</span>
            </button>
          ) : (
            <span />
          )}
          <span className="font-normal text-muted-foreground/80">
            {currentTab === 'role' ? '1 / 3' : currentTab === 'school' ? '2 / 3' : '3 / 3'}
          </span>
        </div>
        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: currentTab === 'role' ? '33.33%' : currentTab === 'school' ? '66.66%' : '100%' }}
          />
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="flex-1 flex flex-col justify-between py-4">
        <Tabs value={currentTab} className="flex-1 flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-center">

            {/* Step 1: Role Selection */}
            <TabsPanel value="role" className="space-y-8 focus:outline-none w-full animate-in fade-in duration-200">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-normal tracking-tight text-foreground">
                  How are you planning to use OpenLearn?
                </h2>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll streamline your setup experience accordingly.
                </p>
              </div>

              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {roles.map((r) => {
                        const Icon = r.icon;
                        const isSelected = field.value === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => field.onChange(r.id)}
                            className={cn(
                              "relative flex flex-col items-center text-center p-6 rounded-xl border bg-card cursor-pointer transition-all duration-200",
                              "hover:border-primary/50 hover:shadow-xs outline-none focus-visible:ring-1 focus-visible:ring-primary/30",
                              isSelected
                                ? "border-primary ring-1 ring-primary text-foreground"
                                : "border-border text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {/* Checkbox indicator */}
                            <div className={cn(
                              "absolute top-3 right-3 size-4.5 rounded-full border flex items-center justify-center transition-all",
                              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                            )}>
                              {isSelected && <Check className="size-3 stroke-3" />}
                            </div>

                            <div className={cn(
                              "p-4 rounded-full mb-4 bg-muted/40 transition-colors duration-200",
                              isSelected ? "text-primary bg-primary/5" : "text-muted-foreground"
                            )}>
                              <Icon className="size-8 stroke-[1.25]" />
                            </div>
                            <span className="text-sm font-semibold mb-1 text-foreground">{r.label}</span>
                            <span className="text-xs text-muted-foreground leading-normal font-light">{r.description}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.role && (
                      <p className="text-xs text-destructive-foreground text-center mt-2 font-medium">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </TabsPanel>

            {/* Step 2: School */}
            <TabsPanel value="school" className="space-y-8 focus:outline-none w-full animate-in fade-in duration-200">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-normal tracking-tight text-foreground">
                  Where do you study or teach?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your school or organization (optional).
                </p>
              </div>

              <div className="space-y-4 max-w-md mx-auto py-4 w-full">
                <Controller
                  control={control}
                  name="school"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error || undefined} className="gap-2 w-full">
                      <Input
                        id="school"
                        ref={field.ref}
                        placeholder="Enter school name"
                        autoComplete="organization"
                        aria-invalid={!!fieldState.error}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        value={field.value}
                        className="rounded-full px-6 flex items-center text-lg h-14 bg-background border-border hover:border-muted-foreground/40 focus-visible:border-primary w-full shadow-sm text-center"
                      />
                      {fieldState.error && (
                        <FieldError className="w-full mt-1">{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </div>
            </TabsPanel>

            {/* Step 3: Subjects */}
            <TabsPanel value="interests" className="space-y-8 focus:outline-none w-full animate-in fade-in duration-200">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-normal tracking-tight text-foreground">
                  What are you interested in?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select the subjects you want to explore.
                </p>
              </div>

              <Controller
                control={control}
                name="subjects"
                render={({ field }) => (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {subjectsList.map((subject) => {
                        const Icon = subject.icon;
                        const isSelected = (field.value || []).includes(subject.id);
                        return (
                          <button
                            key={subject.id}
                            type="button"
                            onClick={() => {
                              const currentValues = field.value || [];
                              const newValue = isSelected
                                ? currentValues.filter((s: string) => s !== subject.id)
                                : [...currentValues, subject.id];
                              field.onChange(newValue);
                            }}
                            className={cn(
                              "relative flex flex-col items-center text-center p-6 rounded-xl border bg-card cursor-pointer transition-all duration-200",
                              "hover:border-primary/50 hover:shadow-xs outline-none focus-visible:ring-1 focus-visible:ring-primary/30 w-full",
                              isSelected
                                ? "border-primary ring-1 ring-primary text-foreground"
                                : "border-border text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {/* Checkbox indicator */}
                            <div className={cn(
                              "absolute top-3 right-3 size-4.5 rounded-full border flex items-center justify-center transition-all",
                              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                            )}>
                              {isSelected && <Check className="size-3 stroke-3" />}
                            </div>

                            <div className={cn(
                              "p-4 rounded-full mb-4 bg-muted/40 transition-colors duration-200",
                              isSelected ? "text-primary bg-primary/5" : "text-muted-foreground"
                            )}>
                              <Icon className="size-8 stroke-[1.25]" />
                            </div>
                            <span className="text-sm font-semibold mb-1 text-foreground">{subject.label}</span>
                            <span className="text-xs text-muted-foreground leading-normal font-light">{subject.description}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.subjects && (
                      <p className="text-xs text-destructive-foreground text-center mt-2 font-medium">
                        {errors.subjects.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </TabsPanel>

          </div>

          {/* Bottom Centered Nav Action */}
          <div className="flex justify-center pt-8 mt-6">
            {currentTab !== 'interests' ? (
              <Button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-100 h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all text-lg font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isPending}
                onClick={handleSubmit(onSubmit)}
                className="w-full sm:w-100 h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all text-lg font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shadow-sm"
              >
                {isPending ? (
                  <LoaderIcon className="animate-spin size-4" />
                ) : (
                  <>
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </Tabs>
      </form>
    </div>
  );
}
