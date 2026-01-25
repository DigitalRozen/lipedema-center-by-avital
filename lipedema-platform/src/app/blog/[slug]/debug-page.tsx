import { getPostBySlug } from '@/lib/keystatic';

export default async function DebugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="p-8" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
      
      <div className="mb-4">
        <strong>Title:</strong> {post.title}
      </div>
      
      <div className="mb-4">
        <strong>Content Type:</strong> {typeof post.content}
      </div>
      
      <div className="mb-4">
        <strong>Content Constructor:</strong> {post.content?.constructor?.name || 'N/A'}
      </div>
      
      <div className="mb-8">
        <strong>Is React Element:</strong> {typeof post.content === 'object' && post.content !== null ? 'Yes' : 'No'}
      </div>

      <hr className="my-8" />

      <h2 className="text-xl font-bold mb-4">Raw Content Output:</h2>
      <div className="border p-4 bg-gray-50">
        {post.content}
      </div>

      <hr className="my-8" />

      <h2 className="text-xl font-bold mb-4">With Prose Classes:</h2>
      <div className="prose prose-lg max-w-none border p-4 bg-white">
        {post.content}
      </div>
    </div>
  );
}
