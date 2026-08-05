"use client";

import React, { useState } from "react";
import { useToast } from "@/providers/toast-provider";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    // Simulate API call (replace with real endpoint when available)
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setEmail("");
    toast(`🎉 Email ${email} đã được đăng ký nhận thông báo!`, "success");
  };

  return (
    <form className="newsletter-box__form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Nhập email của bạn"
        className="newsletter-box__input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        aria-label="Địa chỉ email đăng ký"
      />
      <button type="submit" className="newsletter-box__btn" disabled={loading}>
        {loading ? "Đang đăng ký..." : "Đăng ký"}
      </button>
    </form>
  );
}

export default NewsletterForm;
