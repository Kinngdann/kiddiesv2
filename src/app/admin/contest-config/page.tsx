"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/card";
import { Input } from "@ui/input";
import { Field, FieldLabel } from "@ui/field";
import { Switch } from "@ui/switch";
import { Spinner } from "@ui/spinner";

type Config = {
  votingOpen: boolean;
  currentStage: number;
  stageLabel: string;
  endDate: string | null;
};

export default function ContestConfigPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/contest-config")
      .then((r) => r.json())
      .then((data) => setConfig(data));
  }, []);

  const save = async () => {
    if (!config) return;
    setSaving(true);
    const response = await fetch("/api/contest-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    if (response.ok) {
      toast.success("Contest config saved");
    } else {
      toast.error("Failed to save config");
    }
  };

  if (!config) {
    return (
      <div className="fb-col-wrapper min-h-dvh grid place-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="fb-col-wrapper min-h-dvh grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Contest Config</CardTitle>
          <CardDescription>Control voting and stage settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Voting Open</p>
                <p className="text-xs text-muted-foreground">Allow votes to be submitted</p>
              </div>
              <Switch
                checked={config.votingOpen}
                onCheckedChange={(checked) =>
                  setConfig((c) => c && { ...c, votingOpen: checked })
                }
              />
            </div>

            <Field>
              <FieldLabel>Current Stage (1, 2, or 3)</FieldLabel>
              <Input
                type="number"
                min={1}
                max={3}
                value={config.currentStage}
                onChange={(e) =>
                  setConfig((c) => c && { ...c, currentStage: Number(e.target.value) })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Stage Label</FieldLabel>
              <Input
                value={config.stageLabel}
                onChange={(e) =>
                  setConfig((c) => c && { ...c, stageLabel: e.target.value })
                }
                placeholder="e.g. The Final"
              />
            </Field>

            <Field>
              <FieldLabel>Contest End Date</FieldLabel>
              <Input
                type="date"
                value={config.endDate ? config.endDate.split("T")[0] : ""}
                onChange={(e) =>
                  setConfig((c) => c && { ...c, endDate: e.target.value || null })
                }
              />
            </Field>

            <Button onClick={save} disabled={saving} className="w-full">
              {saving && <Spinner />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
