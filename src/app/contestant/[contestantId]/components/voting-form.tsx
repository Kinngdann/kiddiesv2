"use client";

import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Input } from "@ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Checkbox } from "@ui/checkbox";
import BankTransferInstructions from "./bank-transfer-intructions";
import PaystackPaymentProcessing from "./paystack";

type Props = {
  updateSuccessDialogData: (numberOfVotes: string) => void;
  contestant: {
    contestantId: string;
    name: string;
    gender: string;
    stage2votes: number;
  };
};

interface IFormInput {
  voterName: string;
  numberOfVotes: string;
  keepAnonymous?: boolean;
  votingMethod: "paystack" | "bankTransfer";
}

export default function VotingForm({
  contestant,
  updateSuccessDialogData,
}: Props) {
  const { contestantId, name, stage2votes } = contestant;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<IFormInput>();

  // eslint-disable-next-line react-hooks/incompatible-library
  const isPaystackSelected = watch("votingMethod") === "paystack";
  const numberOfVotes = watch("numberOfVotes");

  const paymentData = {
    contestantId: contestant.contestantId,
    voteData: {
      voterName: watch("voterName"),
      keepAnonymous: watch("keepAnonymous") ?? null,
      numberOfVotes,
    },
  };

  const [activeDialog, setActiveDialog] = useState<"none" | "first" | "second">(
    "none"
  );

  const closeAllDialog = () => {
    setActiveDialog("none");
  };

  const onSubmit: SubmitHandler<IFormInput> = async () => {
    // console.log(data);
  };

  return (
    <>
      {/* FIRST DIALOG – VOTE FORM */}
      <Dialog
        open={activeDialog === "first"}
        onOpenChange={(open) => setActiveDialog(open ? "first" : "none")}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="h-12 px-8 font-bold rounded-sm bg-teal-500 hover:bg-teal-600 grow"
            onClick={() => setActiveDialog("first")}>
            VOTE
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-bold">
              Vote for <span className="font-black">{name}</span>
            </DialogTitle>
            <DialogDescription>
              Help <span className="font-bold">{contestant.name}</span> get{" "}
              <span className="font-bold"> more votes</span> to win the contest
              in this <span className="font-bold">final</span>.
            </DialogDescription>
            {/* {contestant.stage2votes < 300 ? (
              <DialogDescription>
                Help <span className="font-bold">{contestant.name}</span> get{" "}
                <span className="font-bold">
                  {300 - stage2votes} more votes
                </span>{" "}
                to qualify for the <span className="font-bold">final</span>.
              </DialogDescription>
            ) : (
              <DialogDescription>
                Help <span className="font-bold">{contestant.name}</span> get as
                much votes as possible to help{" "}
                {`${contestant.gender === "male" ? "him" : "her"}`}{" "}
                <span className="font-bold">win</span> the contest.
              </DialogDescription>
            )} */}
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {/* VOTER NAME */}
              <Field className="grid gap-3">
                <FieldLabel htmlFor="voterName">
                  What&apos;s your name
                </FieldLabel>
                <Input
                  {...register("voterName", {
                    required: "Your name is required",
                    maxLength: 50,
                  })}
                  placeholder="Adeola Chisom"
                />
                <FieldError>{errors.voterName?.message}</FieldError>
              </Field>

              {/* NUMBER OF VOTES */}
              <Field className="grid gap-3">
                <FieldLabel htmlFor="numberOfVotes">
                  Select number of votes{" "}
                  <span className="font-bold">(₦50/vote)</span>
                </FieldLabel>

                <Controller
                  name="numberOfVotes"
                  control={control}
                  rules={{ required: "Number of votes required" }}
                  render={({ field }) => (
                    <Select
                      disabled
                      onValueChange={field.onChange}
                      value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Voting is disabled" />
                      </SelectTrigger>
                      <SelectContent className="border-0 ">
                        {[5, 10, 20, 50, 100, 200, 500, 1000].map((v) => (
                          <SelectItem key={v} value={String(v)}>
                            {v} votes
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <FieldError>{errors.numberOfVotes?.message}</FieldError>
              </Field>

              {/* VOTING METHOD */}
              <Field>
                <FieldLabel htmlFor="votingMethod">
                  Select voting method
                </FieldLabel>

                <Controller
                  name="votingMethod"
                  control={control}
                  rules={{ required: "Voting method is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Voting method" />
                      </SelectTrigger>
                      <SelectContent className="border-0">
                        <SelectItem value="paystack">Paystack</SelectItem>
                        {/* <SelectItem value="bankTransfer">
                          Bank Transfer
                        </SelectItem> */}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.votingMethod?.message}</FieldError>
              </Field>

              {/* ANONYMOUS CHECKBOX */}
              {isPaystackSelected && (
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="keepAnonymous"
                    render={({ field }) => (
                      <div className="flex space-x-2 items-start">
                        <Checkbox
                          id="keepAnonymous"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <div className="grid gap-2">
                          <FieldLabel htmlFor="keepAnonymous">
                            Keep my vote anonymous
                          </FieldLabel>
                          <p className="text-muted-foreground text-sm">
                            This will hide your name on the contestant&apos;s
                            vote records
                          </p>
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}

              {/* FOOTER BUTTONS */}
              <div className="flex gap-4 justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                {isPaystackSelected ? (
                  <PaystackPaymentProcessing
                    isFormValid={isValid}
                    closeAllDialog={closeAllDialog}
                    paymentData={paymentData}
                    updateSuccessDialogData={updateSuccessDialogData}
                  />
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit(() => {
                      setActiveDialog("second"); // open second only if valid
                    })}>
                    Continue
                  </Button>
                )}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* SECOND DIALOG – BANK TRANSFER */}
      <Dialog
        open={activeDialog === "second"}
        onOpenChange={(open) => setActiveDialog(open ? "second" : "none")}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Bank Transfer Instructions</DialogTitle>
          </DialogHeader>

          <BankTransferInstructions
            contestantName={name}
            contestantId={contestantId}
            numberOfVotes={Number(numberOfVotes || 0)}
          />

          <div className="flex justify-end mt-6">
            <DialogClose asChild>
              <Button variant="outline">Okay</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
