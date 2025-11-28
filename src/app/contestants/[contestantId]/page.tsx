export default async function Contestant({params}: {params: any}) {
  const {contestantId} = await params;
  return <div>Hello contestant {contestantId}</div>;
}
