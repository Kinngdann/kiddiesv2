import { Button } from "@ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import BankTransferInstructions from "./bank-transfer-intructions";

export default function BankTransfer({
  contestantId,
  numberOfVotes,
  activateSecondDialog,
  deactivateFirstDialog,
}: {
  contestantId: string;
  numberOfVotes: number;
  activateSecondDialog: any;
  deactivateFirstDialog: any;
}) {
  return (
    <Dialog
      open={activeDialog === "second"}
      onOpenChange={(open) => {
        if (!open) setActiveDialog("none");
      }}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            deactivateFirstDialog(); // close first
            activateSecondDialog(); // open second
          }}>
          Bank Transfer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bank Transfer</DialogTitle>
        </DialogHeader>

        <BankTransferInstructions
          contestantId={contestantId}
          numberOfVotes={numberOfVotes}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
