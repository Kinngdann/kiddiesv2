import PosterCanvas from "./poster-canvas";
import type { PosterData } from "./poster-canvas";

export default async function CampaignPosterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const id = params.id ?? "007";

  const data: PosterData = {
    contestantId: id,
    firstName: params.firstName ?? "Amara",
    lastName: params.lastName ?? "Okonkwo",
    age: params.age ?? "5",
    ageUnit: params.ageUnit ?? "yrs",
    pic: params.pic ?? null,
    gender: (params.gender === "male" ? "male" : "female"),
    profileUrl: `leadritehub.com/contestant/${id}`,
  };

  return <PosterCanvas data={data} />;
}
