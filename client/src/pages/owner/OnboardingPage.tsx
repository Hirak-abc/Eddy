import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBusinessSchema, type CreateBusinessInput } from '@/lib/validators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const OnboardingPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateBusinessInput>({
    resolver: zodResolver(createBusinessSchema),
  });

  const onSubmit = async (data: CreateBusinessInput) => {
    setIsSubmitting(true);
    console.log('Onboarding data:', data);
    // TODO: Connect to backend API
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Register Your Business</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <Input {...register('name')} placeholder="The Burger Joint" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Input {...register('category')} placeholder="Food & Beverage" />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input {...register('location')} placeholder="Hazratganj, Lucknow" />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register Business'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
