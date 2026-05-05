"use client";

import { useState } from "react";
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
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Share2, Copy, Check } from "lucide-react";

type ShareLinkProps = {
  contestantName?: string;
};

export function ShareLink({ contestantName }: ShareLinkProps) {
  const [url] = useState(() =>
    typeof window === "undefined" ? "" : window.location.href,
  );
  const [copied, setCopied] = useState(false);

  const whatsappText = contestantName
    ? `Help ${contestantName} win the Future Star Challenge! Every vote is only ₦50. Vote here: ${url}`
    : `Vote now on The Future Star Challenge! Every vote is only ₦50. Vote here: ${url}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full max-w-2xl mx-auto flex items-center justify-center gap-2 mt-8 bg-white text-black font-bold text-sm px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_#111] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition">
          <Share2 className="w-4 h-4" />
          Share {contestantName ? `${contestantName}'s` : "this"} profile
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md border-2 border-black shadow-[6px_6px_0px_#111] bg-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-black text-xl">
            Share this contestant
          </DialogTitle>
          <DialogDescription>
            Share{contestantName ? ` ${contestantName}'s` : ""} profile and help them get more votes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* WhatsApp share */}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold gap-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_#111] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share on WhatsApp
            </Button>
          </a>

          {/* Copy link */}
          <div className="flex gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                value={url}
                readOnly
                className="text-xs border-2 border-black rounded-xl"
              />
            </div>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={copyLink}
              className="shrink-0 border-2 border-black rounded-xl hover:bg-[#FACC14] transition"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-2 border-black rounded-xl font-bold"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
