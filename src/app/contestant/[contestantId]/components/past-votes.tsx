import { ScrollArea } from "@ui/scroll-area";
import { Button } from "@ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@ui/drawer";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { List } from "lucide-react";
import { formatDate } from "@/utils/format-date";

export type VoteLog = {
  voterName: string;
  numberOfVotes: number;
  voteMethod: string;
  createdAt: string;
};

type voteProps = {
  voteLog: VoteLog[];
};

export default function PastVotes({ voteLog }: voteProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="link">
          <List />
          See Past Votes
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Voting Activities</DrawerTitle>
          <DrawerDescription>Most recent votes</DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="h-72 p-2 w-full max-w-lg mx-auto">
          <Table>
            <TableCaption>Showing the last 10 votes.</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Vote</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {voteLog.map((vote) => (
                <TableRow key={vote.createdAt}>
                  <TableCell className="font-medium">
                    {vote.voterName}
                  </TableCell>
                  <TableCell>{vote.numberOfVotes}</TableCell>
                  <TableCell>{vote.voteMethod}</TableCell>
                  <TableCell className="text-right">
                    {formatDate(vote.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button className="w-full max-w-lg mx-auto">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
