'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProfileFormProps {
  form: {
    name: string;
    username: string;
    email: string;
    phone: string;
    bio: string;
  };

  isSaving: boolean;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ProfileForm({
  form,
  isSaving,
  handleChange,
  handleSubmit,
}: ProfileFormProps) {
  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5 md:flex-1'>
      {/* Name */}
      <div className='flex flex-col gap-2'>
        <Label htmlFor='name'>Name</Label>

        <Input
          id='name'
          value={form.name ?? ''}
          onChange={handleChange}
          className='h-13 rounded-xl border border-neutral-900 bg-neutral-900 font-semibold text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0'
        />
      </div>

      {/* Username */}
      <div className='flex flex-col gap-2'>
        <Label htmlFor='username'>Username</Label>

        <Input
          id='username'
          value={form.username ?? ''}
          onChange={handleChange}
          className='h-13 rounded-xl border border-neutral-900 bg-neutral-900 font-semibold text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0'
        />
      </div>

      {/* Email */}
      <div className='flex flex-col gap-2'>
        <Label htmlFor='email'>Email</Label>

        <Input
          id='email'
          disabled
          value={form.email ?? ''}
          onChange={handleChange}
          className='h-13 cursor-not-allowed rounded-xl border border-neutral-900 bg-neutral-900 text-neutral-500'
        />
      </div>

      {/* Phone */}
      <div className='flex flex-col gap-2'>
        <Label htmlFor='phone'>Number Phone</Label>

        <Input
          id='phone'
          value={form.phone ?? ''}
          onChange={handleChange}
          className='h-13 rounded-xl border border-neutral-900 bg-neutral-900 font-semibold text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0'
        />
      </div>

      {/* Bio */}
      <div className='flex flex-col gap-2'>
        <Label htmlFor='bio'>Bio</Label>

        <Textarea
          id='bio'
          rows={3}
          value={form.bio ?? ''}
          onChange={handleChange}
          placeholder='Tell something about yourself...'
          className='h-30 resize-none rounded-xl border border-neutral-900 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0'
        />
      </div>

      <Button
        type='submit'
        disabled={isSaving}
        className='mt-2 h-13 rounded-full bg-primary-300 font-bold text-white hover:bg-purple-700 disabled:opacity-60'
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
