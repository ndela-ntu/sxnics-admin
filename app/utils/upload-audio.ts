export default async function uploadAudio(
  audio: File,
  artistName: string,
  trackName: string
): Promise<string | null> {
  const owner = "ndela-ntu";
  const repo = "sxnics-audio-files";

  // Sanitize artist name and track name for use in file path
  const sanitizedArtistName = artistName
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();
  const sanitizedTrackName = trackName
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();

  // Get file extension from original file name
  const fileExtension = audio.name.split(".").pop();

  const path = `${artistName} - ${trackName}.${fileExtension}`;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    const content = await audio.arrayBuffer();
    const contentEncoded = Buffer.from(content).toString("base64");

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload audio file: ${artistName} - ${trackName}`,
        content: contentEncoded,
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.content.path || null;
  } catch (error) {
    console.error("Error uploading audio to GitHub:", error);
    return null;
  }
}
