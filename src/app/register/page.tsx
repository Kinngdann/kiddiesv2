'use client';

import {useEffect, useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import Image from 'next/image';

import {Field, FieldError, FieldLabel, FieldSeparator} from '@ui/field';
import {Button} from '@ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import {Input} from '@ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';
import {Spinner} from '@ui/spinner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ui/alert-dialog';

import {AlertCircleIcon} from 'lucide-react';
import {Alert, AlertDescription, AlertTitle} from '@ui/alert';
import {BadgeCheckIcon} from 'lucide-react';
import Link from 'next/link';

interface IFormInput {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | '';
  age: string;
  phone: string;
  whatsapp: string;
  picture: FileList | null;
  parentName: string;
}

export default function RegistrationForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<boolean>(false);
  const [regError, setRegError] = useState<boolean>(false);
  const [contestant, setContestant] = useState<{
    name: string | null;
    id: string | null;
  }>({
    name: null,
    id: null,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {errors, isSubmitting},
  } = useForm<IFormInput>({
    defaultValues: {
      gender: '',
      age: '',
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const imageFile = watch('picture');

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('gender', data.gender);
    formData.append('age', data.age);
    formData.append('parent', data.parentName);
    formData.append('phone', data.phone);
    formData.append('whatsapp', data.whatsapp);

    if (data.picture && data.picture.length > 0) {
      formData.append('picture', data.picture[0]);
    }

    try {
      const response = await fetch('/api/contestant', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 200 && response.statusText === 'OK') {
        const contestant = await response.json();
        setContestant({
          ...contestant,
        });
        setRegSuccess(true);
      } else {
        setRegError(true);
        throw new Error('Request failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="h-dvh grid lg:grid-cols-2 w-full">
        <div className="hidden lg:block bg-[url(/bg2.jpg)] bg-no-repeat bg-center bg-cover"></div>
        <div className="grid place-items-center">
          <Card className="w-full max-w-xl bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">Registration Form</CardTitle>
              <CardDescription>
                Kindly fill out the form to enroll your child into the{' '}
                <span className="font-bold">Kiddies Crown Contest</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid lg:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel
                      htmlFor="firstName"
                      className='max-w-fit relative after:absolute after:text-red-500 after:content-["*"] after:-right-2'>
                      First Name Name
                    </FieldLabel>
                    <Input
                      {...register('firstName', {
                        required: 'First Name is required',
                        maxLength: 20,
                      })}
                      placeholder="Jane"
                    />
                    <FieldError>{errors.firstName?.message}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      {...register('lastName', {
                        required: 'Last Name is required',
                        maxLength: 20,
                      })}
                      placeholder="Akintola"
                    />
                    <FieldError> {errors.lastName?.message} </FieldError>
                  </Field>
                </div>

                <div className="grid lg:grid-cols-2 gap-4 mb-6">
                  <Field>
                    <FieldLabel htmlFor="gender">Gender</FieldLabel>
                    <Controller
                      name="gender"
                      control={control}
                      rules={{required: 'Select a valid gender'}}
                      render={({field}) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError> {errors.gender?.message} </FieldError>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="age">Age</FieldLabel>
                    <Controller
                      name="age"
                      control={control}
                      rules={{required: 'Select a valid age'}}
                      render={({field}) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Age" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Less than 1 year</SelectItem>
                            <SelectItem value="1">1 year</SelectItem>
                            <SelectItem value="2">2 years</SelectItem>
                            <SelectItem value="3">3 years</SelectItem>
                            <SelectItem value="4">4 years</SelectItem>
                            <SelectItem value="5">5 years</SelectItem>
                            <SelectItem value="6">6 years</SelectItem>
                            <SelectItem value="7">7 years</SelectItem>
                            <SelectItem value="8">8 years</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError> {errors.age?.message} </FieldError>
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="picture">Upload a Picture</FieldLabel>
                  <div className="flex gap-4">
                    <Input
                      className="h-18 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:text-sm file:font-semibold file:text-gray-500 hover:file:bg-gray-200"
                      id="picture"
                      type="file"
                      accept="image/*"
                      {...register('picture', {
                        required: 'Picture is required',
                      })}
                    />
                    {preview && (
                      <Image
                        src={preview}
                        width={18}
                        height={18}
                        alt="Preview"
                        className="w-auto h-18 rounded-md border"
                      />
                    )}
                  </div>
                  <FieldError> {errors.picture?.message} </FieldError>
                </Field>
                <FieldSeparator className="my-6" />
                <Field>
                  <FieldLabel htmlFor="parentName">
                    Parent&apos;s Full Name
                  </FieldLabel>
                  <Input
                    {...register('parentName', {
                      required: 'Parent name is required',
                      maxLength: 70,
                    })}
                    placeholder="Onyinyechi Akintola"
                  />
                  <FieldError> {errors.parentName?.message} </FieldError>
                </Field>
                <div className="grid lg:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                    <Input
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^(?:(?:0|\+234)\s?)?[789]\d{9}$/,
                          message: 'Invalid phone number format',
                        },
                      })}
                      placeholder="+2348012345678"
                    />
                    <FieldError>{errors.phone?.message}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="whatsapp">WhatsApp Number</FieldLabel>
                    <Input
                      {...register('whatsapp', {
                        required: 'WhatsApp number is required',
                        pattern: {
                          value: /^(?:(?:0|\+234)\s?)?[789]\d{9}$/,
                          message: 'Invalid WhatsApp number format',
                        },
                      })}
                      placeholder="+2348012345678"
                    />
                    <FieldError>{errors.whatsapp?.message}</FieldError>
                  </Field>
                </div>
                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full mt-8"
                    disabled={isSubmitting}>
                    {isSubmitting && <Spinner />}
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </Button>
                  {regError && (
                    <Alert variant="destructive">
                      <AlertCircleIcon />
                      <AlertTitle>
                        Unable to process your registration.
                      </AlertTitle>
                      <AlertDescription>
                        <ul className="list-inside list-disc text-sm">
                          <li>Check your internet service</li>
                          <li>Try again</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog open={regSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <BadgeCheckIcon className="size-7 fill-teal-400 mx-auto" />
            <AlertDialogTitle>Registration was succesfull</AlertDialogTitle>
            <AlertDialogDescription>
              Thank you for your interest in the{' '}
              <span className="font-semibold">Kiddies Crown Contest</span>, our
              customer care representative will reach out to you shortly over
              the phone.
            </AlertDialogDescription>
            <AlertDialogDescription className="font-semibold">
              {`${contestant.name}'s ID is`}{' '}
              <span className="font-black">{contestant.id}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link href="/">Okay </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
