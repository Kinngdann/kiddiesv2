"use client";

import { usePaystackPayment } from "react-paystack";
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
import { Lock } from "lucide-react";
import BankTransferInstructions from "./bank-transfer-intructions";
import { useState } from "react";

type Props = {
  contestant: {
    contestantId: string;
    name: string;
    stage1votes: number;
  };
};

interface IFormInput {
  voterName: string;
  numberOfVotes: string;
  keepAnonymous?: boolean;
  votingMethod: "paystack" | "bankTransfer";
}

export default function VotingForm({ contestant }: Props) {
  const { contestantId, name, stage1votes } = contestant;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>();

  const isPaystackSelected = watch("votingMethod") === "paystack";
  const numberOfVotes = watch("numberOfVotes");

  const [activeDialog, setActiveDialog] = useState<"none" | "first" | "second">(
    "none"
  );

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const COST_PER_VOTE = 50;
    const config = {
      reference: new Date().getTime().toString(),
      email: "user@example.com",
      amount: Number(data.numberOfVotes) * (COST_PER_VOTE * 100),
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    };

    const initializePayment = usePaystackPayment(config);

    initializePayment({
      onSuccess: () => {
        console.log("Voting successful");
      },
      onClose: () => console.log("Payment closed"),
    });
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
              Help this contestant get{" "}
              <span className="font-bold">{500 - stage1votes} more votes</span>{" "}
              to qualify for the <span className="font-bold">final</span>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {/* VOTER NAME */}
              <Field className="grid gap-3">
                <FieldLabel htmlFor="voterName">Voter&apos;s Name</FieldLabel>
                <Input
                  {...register("voterName", {
                    required: "Your name is required",
                    maxLength: 50,
                  })}
                  placeholder="Jane"
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Votes" />
                      </SelectTrigger>
                      <SelectContent className="border-0">
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
                        <SelectValue placeholder="Select Voting Method" />
                      </SelectTrigger>
                      <SelectContent className="border-0">
                        <SelectItem value="paystack">Paystack</SelectItem>
                        <SelectItem value="bankTransfer">
                          Bank Transfer
                        </SelectItem>
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
                            This will hide your name from public records
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
                  <Button type="submit" disabled={isSubmitting}>
                    Continue <Lock />
                  </Button>
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
