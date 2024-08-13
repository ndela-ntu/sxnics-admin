import CreateArtistButton from "@/app/ui/audio-manager/create-artist";

export default function Page() {
  return (
    <div className="">
      <h1 className="mb-5">Store Manager</h1>
      <div className="flex justify-between">
        <div className="flex items-center w-full space-x-5">
          <label>Filter By</label>
          <input type="search" placeholder="Search for artist..." className="p-2.5 rounded-lg placeholder:text-black" />
        </div>
        <CreateArtistButton />
      </div>
      <div className="border-t border-white my-4"></div>
      <div className="grid grid-cols-4 w-full border"></div>
    </div>
  );
}
