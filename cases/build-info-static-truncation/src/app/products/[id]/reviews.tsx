import { getReviews } from "@/lib/data";

export async function Reviews({ productId }: { productId: string }) {
  const reviews = await getReviews(productId);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-lg font-semibold">
        Reviews{" "}
        <span className="text-sm font-normal text-zinc-500">
          ({reviews.length})
        </span>
      </h2>
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{review.author}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < review.rating ? "text-amber-400" : "text-zinc-700"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-1 text-sm text-zinc-400">{review.comment}</p>
            <p className="mt-2 text-xs text-zinc-600">{review.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
