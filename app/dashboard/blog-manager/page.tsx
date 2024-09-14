import BlogPost, { IBlogPost } from "@/app/models/blog-post";
import BlogPostCard from "@/app/ui/blog-manager/blog-post-card";
import CreateBlogButton from "@/app/ui/blog-manager/create-blog-button";
import connectMongo from "@/app/utils/connect-mongo";
import { convertDocumentsToBlogPost } from "@/app/utils/convert-to-plain-object";

export default async function Page() {
  await connectMongo();
  const docs = await BlogPost.find();
  const posts: IBlogPost[] = convertDocumentsToBlogPost(docs);

  return (
    <div className="">
      <h1 className="mb-5">Blog Manager</h1>
      <div className="flex justify-between">
        <div className="flex items-center w-full space-x-5">
          <input
            type="search"
            placeholder="Search for artist..."
            className="p-2.5 rounded-lg placeholder:text-black"
          />
        </div>
        <CreateBlogButton />
      </div>
      <div className="border-t border-white my-4"></div>
      <div className="grid grid-cols-4 w-full border">
        {posts.map((post) => (
         <BlogPostCard key={post._id.toString()} post={post} />
        ))}
      </div>
    </div>
  );
}
