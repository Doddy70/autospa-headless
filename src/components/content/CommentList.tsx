import Image from 'next/image';

import type { RestComment } from '@/lib/wordpress/rest';
import { formatArticleDate } from './ArticleCard';

/**
 * The comment list of the article page.
 *
 * Ported from the Agntix `PostboxComment`: the avatar, the author with the
 * date on the right, the comment body and a reply link. Replies are indented
 * under their parent, the way the template does it.
 */
export default function CommentList({ comments }: { comments: RestComment[] }) {
  if (comments.length === 0) {
    return (
      <p className="rounded-[20px] border border-white/10 bg-background-7 px-6 py-8 text-center text-sm text-white/50">
        Belum ada komentar untuk artikel ini. Jadilah yang pertama.
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className={comment.child ? 'border-l-2 border-primary-500/30 pl-6 md:pl-10' : ''}
        >
          <div className="flex gap-5 rounded-[20px] border border-white/10 bg-background-7 p-6">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
              <Image
                src="/assets/auto-logo.png"
                alt={comment.author}
                fill
                sizes="48px"
                className="object-contain p-2"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-white">{comment.author}</h4>
                <time dateTime={comment.date} className="text-xs text-white/40">
                  {formatArticleDate(comment.date)}
                </time>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {comment.content}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
