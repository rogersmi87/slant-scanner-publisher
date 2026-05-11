'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FREE_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'me.com', 'aol.com'];

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .refine(email => {
      const domain = email.split('@')[1]?.toLowerCase();
      return !FREE_EMAIL_DOMAINS.includes(domain);
    }, 'Please use your work email address'),
  publisher: z.string().min(2, 'Please enter your publisher or imprint name'),
  role: z.string().min(1, 'Please select your role'),
  listSize: z.string().min(1, 'Please select your list size'),
  genre: z.string().min(1, 'Please select your primary genre'),
  context: z.string().max(500, 'Please keep this under 500 characters').optional(),
});

type FormData = z.infer<typeof schema>;

export default function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const contextValue = watch('context') ?? '';

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const res = await fetch('/api/publisher-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Submission failed. Please try again.');
      }
      setSubmitted(true);
    } catch (e: any) {
      setServerError(e.message);
    }
  };

  if (submitted) {
    return (
      <section id="lead-form" className="py-24 px-6 bg-white border-t border-[#E2E0DA]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-lg border border-[#E2E0DA] rounded p-10">
            <p className="text-xs tracking-[0.2em] uppercase text-[#1B2B4B] mb-4">Request received</p>
            <h3 className="font-serif text-2xl font-semibold text-[#1A1A18] mb-3">
              We&rsquo;ll be in touch within one business day.
            </h3>
            <p className="text-sm text-[#6B6860] leading-relaxed">
              Someone from the Slant Scanner team will reach out to confirm your pilot titles and schedule the results walkthrough.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lead-form" className="py-24 px-6 bg-white border-t border-[#E2E0DA]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#6B6860] mb-4">Request a pilot</p>
            <h2 className="font-serif text-4xl font-semibold text-[#1A1A18] mb-4">
              Three titles. Free. No commitment.
            </h2>
            <p className="text-[#6B6860] leading-relaxed mb-8">
              Submit three forthcoming titles at no cost. Each receives a full Slant Scanner report. We schedule a 30-minute walkthrough to review the findings with your team. In exchange, we ask for candid feedback on the methodology.
            </p>
            <div className="border-l-2 border-[#1B2B4B] pl-4">
              <p className="text-sm text-[#6B6860] italic">
                &ldquo;A tool that only tells you where to go isn&rsquo;t doing its job. Slant Scanner also tells you where not to.&rdquo;
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-xs font-medium text-[#1A1A18] mb-1.5 block">
                  Full name <span className="text-[#C0392B]">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  className="text-sm"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && <p id="name-error" className="text-xs text-[#C0392B] mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="text-xs font-medium text-[#1A1A18] mb-1.5 block">
                  Work email <span className="text-[#C0392B]">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="text-sm"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && <p id="email-error" className="text-xs text-[#C0392B] mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="publisher" className="text-xs font-medium text-[#1A1A18] mb-1.5 block">
                Publisher / imprint name <span className="text-[#C0392B]">*</span>
              </Label>
              <Input
                id="publisher"
                {...register('publisher')}
                className="text-sm"
                aria-describedby={errors.publisher ? 'publisher-error' : undefined}
              />
              {errors.publisher && <p id="publisher-error" className="text-xs text-[#C0392B] mt-1">{errors.publisher.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role" className="text-xs font-medium text-[#1A1A18] mb-1.5 block">
                  Role <span className="text-[#C0392B]">*</span>
                </Label>
                <Select onValueChange={v => setValue('role', v as string, { shouldValidate: true })}>
                  <SelectTrigger id="role" className="text-sm" aria-describedby={errors.role ? 'role-error' : undefined}>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acquisitions-editor">Acquisitions Editor</SelectItem>
                    <SelectItem value="editorial-director">Editorial Director</SelectItem>
                    <SelectItem value="marketing-director">Marketing Director</SelectItem>
                    <SelectItem value="publisher-lead">Publisher / Imprint Lead</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p id="role-error" className="text-xs text-[#C0392B] mt-1">{errors.role.message}</p>}
              </div>
              <div>
                <Label htmlFor="listSize" className="text-xs font-medium text-[#1A1A18] mb-1.5 block">
                  Annual list size <span className="text-[#C0392B]">*</span>
                </Label>
                <Select onValueChange={v => setValue('listSize', v as string, { shouldValidate: true })}>
                  <SelectTrigger id="listSize" className="text-sm" aria-describedby={errors.listSize ? 'list-error' : undefined}>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1–10 titles/year</SelectItem>
                    <SelectItem value="11-50">11–50 titles/year</SelectItem>
                    <SelectItem value="51-200">51–200 titles/year</SelectItem>
                    <SelectItem value="200+">200+ titles/year</SelectItem>
                  </SelectContent>
                </Select>
                {errors.listSize && <p id="list-error" className="text-xs text-[#C0392B] mt-1">{errors.listSize.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="genre" className="text-xs font-medium text-[#1A1A18] mb-1.5 block">
                Primary genre focus <span className="text-[#C0392B]">*</span>
              </Label>
              <Select onValueChange={v => setValue('genre', v as string, { shouldValidate: true })}>
                <SelectTrigger id="genre" className="text-sm" aria-describedby={errors.genre ? 'genre-error' : undefined}>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiction">Fiction</SelectItem>
                  <SelectItem value="nonfiction">Non-fiction</SelectItem>
                  <SelectItem value="childrens-ya">Children&apos;s / YA</SelectItem>
                  <SelectItem value="academic">Academic / Reference</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
              {errors.genre && <p id="genre-error" className="text-xs text-[#C0392B] mt-1">{errors.genre.message}</p>}
            </div>

            <div>
              <Label htmlFor="context" className="text-xs font-medium text-[#1A1A18] mb-1.5 block">
                Tell us about a recent title where worldview-audience fit mattered{' '}
                <span className="text-[#6B6860] font-normal">(optional)</span>
              </Label>
              <Textarea
                id="context"
                {...register('context')}
                rows={3}
                className="text-sm resize-none"
                maxLength={500}
              />
              <p className="text-xs text-[#6B6860] mt-1 text-right">{contextValue.length}/500</p>
            </div>

            {serverError && (
              <p className="text-sm text-[#C0392B] border border-[#C0392B]/20 bg-[#C0392B]/5 rounded px-3 py-2">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1B2B4B] text-white text-sm font-medium px-5 py-3.5 rounded hover:bg-[#243a63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting…' : 'Request my pilot'}
            </button>

            <p className="text-xs text-[#6B6860] text-center">
              No contract. No payment. We&rsquo;ll reach out within one business day.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
