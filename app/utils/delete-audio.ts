export default async function deleteAudio(filePath: string): Promise<boolean> {
  const owner = "ndela-ntu";
  const repo = "sxnics-audio-files";
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  try {
    // First, we need to get the file's SHA
    const getResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to get file info: ${getResponse.status}`);
    }

    const fileInfo = await getResponse.json();
    const fileSha = fileInfo.sha;

    // Now we can delete the file
    const deleteResponse = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Delete audio file: ${filePath}`,
        sha: fileSha,
      }),
    });

    if (!deleteResponse.ok) {
      throw new Error(
        `GitHub API responded with status: ${deleteResponse.status}`
      );
    }

    return true; // File successfully deleted
  } catch (error) {
    console.error("Error deleting audio from GitHub:", error);
    return false; // Failed to delete file
  }
}
