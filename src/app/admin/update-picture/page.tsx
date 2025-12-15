"use client";

import { Field, FieldError, FieldLabel } from "@/src/components/ui/field";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Input } from "@ui/input";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Spinner } from "@/src/components/ui/spinner";

interface IFormInput {
  contestantId: string;
  picture: FileList;
}

export default function UpdatePicture() {
  const [preview, setPreview] = useState<string | null>(null);
  const [updatePictureError, setUpdatePictureError] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>();

  // eslint-disable-next-line react-hooks/incompatible-library
  const imageFile = watch("picture");

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
    formData.append("contestantId", data.contestantId);
    if (data.picture && data.picture.length > 0) {
      formData.append("picture", data.picture[0]);
    }

    try {
      const response = await fetch("/api/contestant", {
        method: "PUT",
        body: formData,
      });

      if (response.statusText === "OK") {
        const updatedContestant = await response.json();
        console.log(updatedContestant);
      } else {
        setUpdatePictureError("Request failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fb-col-wrapper min-h-dvh grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Update Profile Picture</CardTitle>
          <CardDescription>Fill out the form correctly</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <Field>
                <FieldLabel
                  htmlFor="contestantId"
                  className='max-w-fit relative after:absolute after:text-red-500 after:content-["*"] after:-right-2'>
                  Contestant&apos;s ID
                </FieldLabel>
                <Input
                  {...register("contestantId", {
                    required: "Contestant's ID is required",
                    maxLength: 3,
                  })}
                  placeholder="001"
                />
                <FieldError>{errors.contestantId?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="picture">Upload a Picture</FieldLabel>
                <div className="flex gap-4">
                  <Input
                    className="h-18 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:text-sm file:font-semibold file:text-gray-500 hover:file:bg-gray-200"
                    id="picture"
                    type="file"
                    accept="image/*"
                    {...register("picture", {
                      required: "Picture is required",
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Spinner />}
                Add vote
              </Button>
            </div>
          </form>
        </CardContent>
        {updatePictureError && (
          <Alert variant="destructive" className="border-0">
            <AlertCircleIcon />
            <AlertTitle>Unable to process this request.</AlertTitle>
            <AlertDescription>
              <ul className="list-inside list-disc text-sm">
                <li>Check if contestant account is active</li>
                <li>Check your internet connection</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
}
