export async function GET() {
  const random = Math.floor(Math.random() * 100);
  return Response.json({ data: `Random number: ${random}` });
}
