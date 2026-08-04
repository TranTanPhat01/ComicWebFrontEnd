"use client";

import React, { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    alert(`Cảm ơn bạn! Email ${email} đã được đăng ký nhận thông báo thành công.`);
    setEmail("");
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
        aria-label="Địa chỉ email đăng ký"
      />
      <button type="submit" className="newsletter-box__btn">
        Đăng ký
      </button>
    </form>
  );
}

export default NewsletterForm;
