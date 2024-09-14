import BlogPost, { IBlogPost } from "@/app/models/blog-post";
import EditBlogPostForm from "@/app/ui/blog-manager/edit-blog-post-form";
import connectMongo from "@/app/utils/connect-mongo";
import { convertDocumentsToBlogPost } from "@/app/utils/convert-to-plain-object";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  await connectMongo();

  const docs = await BlogPost.find();
  const blogPosts: IBlogPost[] = convertDocumentsToBlogPost(docs);
  const blogPost: IBlogPost | undefined = blogPosts.find(
    (blogPost) => blogPost._id.toString() === params.id
  );

  if (!blogPost) {
    notFound();
  }

  return (
    <div className="h-full">
      <EditBlogPostForm blogPost={blogPost} />
    </div>
  );
}
