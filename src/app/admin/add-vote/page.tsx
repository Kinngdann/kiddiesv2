"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Field, FieldError, FieldLabel } from "@ui/field";
import { Spinner } from "@ui/spinner";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Input } from "@ui/input";
import { SubmitHandler, useForm } from "react-hook-form";

import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";

interface IFormInput {
  contestantId: string;
  voterName: string;
  amount: number;
}

export default function AddVote() {
  const [addVoteError, setAddVoteError] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    defaultValues: {
      voterName: "Anonymous",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const response = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, voteMethod: "bank_tx" }),
    });

    const vote = await response.json();
    console.log(vote);

    if (!response.ok) {
      setAddVoteError(true);
    } else {
      toast.success("Request was successful", {
        description: `${vote.numberOfVotes} votes was added for contestant ${vote.contestantId}`,
      });
      reset();
    }
  };

  return (
    <div className="fb-col-wrapper min-h-dvh grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Add votes</CardTitle>
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
                <FieldLabel
                  htmlFor="contestantId"
                  className='max-w-fit relative after:absolute after:text-red-500 after:content-["*"] after:-right-2'>
                  Amount
                </FieldLabel>
                <Input
                  {...register("amount", {
                    required: "Amount is required",
                  })}
                  type="number"
                  placeholder="3000"
                />
                <FieldError>{errors.amount?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="voterName" className="max-w-fit">
                  Voters&apos;s Name
                </FieldLabel>
                <Input
                  {...register("voterName", {
                    maxLength: 50,
                  })}
                  placeholder="Mummy"
                />
                <FieldError>{errors.voterName?.message}</FieldError>
              </Field>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Spinner />}
                Add vote
              </Button>
            </div>
          </form>
        </CardContent>
        {addVoteError && (
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
