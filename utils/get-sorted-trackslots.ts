import { ITrack } from "@/app/models/track";

export type TrackDifference = {
  previousTrackEnds: Date;
  nextTrackStarts: Date;
  difference: number; // difference in milliseconds
};

export const getSortedTrackSlots = (tracks: ITrack[]): TrackDifference[] => {
  // Filter out tracks without trackEnds or trackStarts and parse dates
  const filteredTracks = tracks
    .filter((track) => track.trackEnds && track.trackStarts)
    .map((track) => ({
      ...track,
      trackEnds: new Date(Number(track.trackEnds!)),
      trackStarts: new Date(Number(track.trackStarts!)),
    }));

  // Sort the filtered array by trackEnds in ascending order
  const sortedTracks = filteredTracks.sort(
    (a, b) => a.trackEnds!.getTime() - b.trackEnds!.getTime()
  );

  // Map the sorted array to the desired output
  const trackDifferences: TrackDifference[] = [];

  for (let i = 1; i < sortedTracks.length; i++) {
    const previousTrack = sortedTracks[i - 1];
    const nextTrack = sortedTracks[i];

    const difference =
      nextTrack.trackStarts!.getTime() - previousTrack.trackEnds!.getTime();

    trackDifferences.push({
      previousTrackEnds: previousTrack.trackEnds!,
      nextTrackStarts: nextTrack.trackStarts!,
      difference: difference,
    });
  }
  if (sortedTracks.length > 0) {
    const lastTrack = sortedTracks[sortedTracks.length - 1];
    const farFutureDate = new Date();
    farFutureDate.setFullYear(farFutureDate.getFullYear() + 100); // 100 years from now

    trackDifferences.push({
      previousTrackEnds: lastTrack.trackEnds!,
      nextTrackStarts: farFutureDate,
      difference: Number.MAX_SAFE_INTEGER,
    });
  }

  return trackDifferences;
};
