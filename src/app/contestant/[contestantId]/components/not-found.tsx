// import { IconFolderCode } from "@tabler/icons-react";
import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@ui/empty";
import Link from "next/link";

export default function NoUserFound() {
  return (
    <div className="fb-col-wrapper min-h-dvh grid place-items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-user-exclamation">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.008 .128" />
              <path d="M19 16v3" />
              <path d="M19 22v.01" />
            </svg>
          </EmptyMedia>
          <EmptyTitle>No Contestant Found</EmptyTitle>
          <EmptyDescription>
            This contestant could not be found and may no longer be active in
            the contest.
          </EmptyDescription>
          <EmptyDescription>
            If this seems wrong, confirm the ID in the URL:{" "}
            <code className="bg-gray-200 rounded-xs px-0.5 font-semibold">
              kidscrown.net/contestant/[ID]
            </code>
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/all-contestants">See all contestants</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </EmptyContent>
        <Button
          variant="link"
          asChild
          className="text-muted-foreground"
          size="sm">
          <Link href="/#about">
            Learn More <ArrowUpRightIcon />
          </Link>
        </Button>
      </Empty>
    </div>
  );
}
