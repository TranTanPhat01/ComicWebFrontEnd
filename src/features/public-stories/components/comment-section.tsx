"use client";

import React, { useState } from "react";
import { useComments } from "../hooks/use-comments";
import { useAuthSession } from "../hooks/use-auth-session";
import { useToast } from "@/providers/toast-provider";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface CommentSectionProps {
  storyId: number;
  chapterId?: number | null;
}

export function CommentSection({ storyId, chapterId = null }: CommentSectionProps) {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuthSession();
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const {
    comments,
    isLoading,
    page,
    totalPages,
    totalCount,
    addComment,
    removeComment,
    goToPage,
  } = useComments({
    storyId,
    chapterId,
    onToast: (msg, variant) => toast(msg, variant),
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const success = await addComment(newCommentText.trim(), null);
    if (success) {
      setNewCommentText("");
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const success = await addComment(replyText.trim(), parentId);
    if (success) {
      setReplyText("");
      setReplyingToId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Đang cập nhật";
    }
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section__title">
        Bình luận ({totalCount})
      </h3>

      {/* Write comment section */}
      {isAuthenticated ? (
        <form className="comment-section__form" onSubmit={handleSubmitComment}>
          <textarea
            placeholder="Bạn nghĩ gì về bộ truyện này? Chia sẻ cảm nhận của bạn..."
            className="comment-section__textarea"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            maxLength={2000}
            required
          />
          <div className="comment-section__form-footer">
            <span className="comment-section__char-count">{newCommentText.length}/2000</span>
            <button type="submit" className="comment-section__submit-btn">
              Gửi bình luận
            </button>
          </div>
        </form>
      ) : (
        <div className="comment-section__auth-prompt">
          <p>
            Vui lòng <Link href={ROUTES.login} className="comment-section__link">Đăng nhập</Link> để viết bình luận.
          </p>
        </div>
      )}

      {/* Comments list */}
      <div className="comment-section__list">
        {isLoading && comments.length === 0 ? (
          <div className="comment-section__loading">Đang tải bình luận...</div>
        ) : comments.length === 0 ? (
          <div className="comment-section__empty">Chưa có bình luận nào. Hãy là người đầu tiên cảm nhận!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-section__item">
              <div className="comment-section__item-header">
                <span className="comment-section__author">{comment.author.username}</span>
                <span className="comment-section__date">{formatDate(comment.createdAt)}</span>
              </div>
              <div className="comment-section__item-content">{comment.content}</div>
              
              <div className="comment-section__item-actions">
                {isAuthenticated && (
                  <button
                    type="button"
                    className="comment-section__action-btn"
                    onClick={() => {
                      setReplyingToId(replyingToId === comment.id ? null : comment.id);
                      setReplyText("");
                    }}
                  >
                    Trả lời
                  </button>
                )}
                {isAuthenticated && (user?.id === comment.author.id || user?.role === "Admin") && (
                  <button
                    type="button"
                    className="comment-section__action-btn comment-section__action-btn--delete"
                    onClick={() => removeComment(comment.id, null)}
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Reply form */}
              {replyingToId === comment.id && (
                <form className="comment-section__reply-form" onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                  <textarea
                    placeholder="Viết phản hồi..."
                    className="comment-section__reply-textarea"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    maxLength={2000}
                    required
                  />
                  <div className="comment-section__reply-footer">
                    <button
                      type="button"
                      className="comment-section__cancel-btn"
                      onClick={() => setReplyingToId(null)}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="comment-section__submit-btn">
                      Trả lời
                    </button>
                  </div>
                </form>
              )}

              {/* Replies list (nested) */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="comment-section__replies">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="comment-section__reply-item">
                      <div className="comment-section__item-header">
                        <span className="comment-section__author">{reply.author.username}</span>
                        <span className="comment-section__date">{formatDate(reply.createdAt)}</span>
                      </div>
                      <div className="comment-section__item-content">{reply.content}</div>
                      <div className="comment-section__item-actions">
                        {isAuthenticated && (user?.id === reply.author.id || user?.role === "Admin") && (
                          <button
                            type="button"
                            className="comment-section__action-btn comment-section__action-btn--delete"
                            onClick={() => removeComment(reply.id, comment.id)}
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="comment-section__pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              className={`comment-section__page-btn ${p === page ? "comment-section__page-btn--active" : ""}`}
              onClick={() => goToPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <style jsx global>{`
        .comment-section {
          margin-top: var(--space-8);
          background: var(--color-surface-1);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-border);
        }
        .comment-section__title {
          font-size: 1.3rem;
          color: var(--color-text-primary);
          margin-bottom: var(--space-4);
          font-weight: 600;
        }
        .comment-section__form {
          margin-bottom: var(--space-6);
        }
        .comment-section__textarea {
          width: 100%;
          min-height: 100px;
          background: var(--color-surface-2);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-3) var(--space-4);
          color: var(--color-text-primary);
          font-family: inherit;
          resize: vertical;
          outline: none;
          transition: border-color var(--transition-fast);
        }
        .comment-section__textarea:focus {
          border-color: var(--color-primary);
        }
        .comment-section__form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--space-2);
        }
        .comment-section__char-count {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .comment-section__submit-btn {
          background: var(--color-primary);
          color: white;
          border: none;
          padding: var(--space-2) var(--space-5);
          border-radius: var(--radius-md);
          font-weight: 500;
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .comment-section__submit-btn:hover {
          background: var(--color-primary-dark);
        }
        .comment-section__auth-prompt {
          background: rgba(255, 255, 255, 0.02);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          text-align: center;
          color: var(--color-text-secondary);
          border: 1px dashed var(--color-border);
          margin-bottom: var(--space-6);
        }
        .comment-section__link {
          color: var(--color-primary-light);
          font-weight: 500;
          text-decoration: underline;
        }
        .comment-section__list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .comment-section__item {
          border-bottom: 1px solid var(--color-border);
          padding-bottom: var(--space-4);
        }
        .comment-section__item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .comment-section__item-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-1);
        }
        .comment-section__author {
          font-weight: 600;
          color: var(--color-primary-light);
          font-size: 0.95rem;
        }
        .comment-section__date {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .comment-section__item-content {
          color: var(--color-text-primary);
          font-size: 0.95rem;
          line-height: 1.5;
          word-break: break-word;
        }
        .comment-section__item-actions {
          display: flex;
          gap: var(--space-4);
          margin-top: var(--space-2);
        }
        .comment-section__action-btn {
          background: none;
          border: none;
          color: var(--color-text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0;
        }
        .comment-section__action-btn:hover {
          color: var(--color-primary-light);
        }
        .comment-section__action-btn--delete:hover {
          color: var(--color-error);
        }
        .comment-section__reply-form {
          margin-top: var(--space-3);
          background: var(--color-surface-2);
          padding: var(--space-3);
          border-radius: var(--radius-md);
        }
        .comment-section__reply-textarea {
          width: 100%;
          min-height: 60px;
          background: var(--color-surface-1);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-2) var(--space-3);
          color: var(--color-text-primary);
          font-family: inherit;
          resize: vertical;
          outline: none;
        }
        .comment-section__reply-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-2);
          margin-top: var(--space-2);
        }
        .comment-section__cancel-btn {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          padding: var(--space-1-5) var(--space-4);
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .comment-section__replies {
          margin-top: var(--space-3);
          margin-left: var(--space-6);
          border-left: 2px solid var(--color-border);
          padding-left: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .comment-section__reply-item {
          background: rgba(255, 255, 255, 0.01);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
        }
        .comment-section__loading,
        .comment-section__empty {
          text-align: center;
          color: var(--color-text-muted);
          padding: var(--space-8);
          font-size: 0.95rem;
        }
        .comment-section__pagination {
          display: flex;
          justify-content: center;
          gap: var(--space-2);
          margin-top: var(--space-6);
        }
        .comment-section__page-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-surface-2);
          color: var(--color-text-secondary);
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        .comment-section__page-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary-light);
        }
        .comment-section__page-btn--active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}
export default CommentSection;
