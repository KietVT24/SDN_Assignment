// components/product/ProductCard.js (ví dụ)
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProductCard({ product, onDelete }) {
  const { data: session } = useSession();

  // Hàm xử lý xóa sản phẩm
  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Xóa sản phẩm thất bại");

      alert("Xóa thành công!");
      if (onDelete) onDelete(product._id); // gọi callback để refresh list
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi xóa sản phẩm.");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      {/* Ảnh sản phẩm */}
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            borderRadius: 6,
            marginBottom: 8,
          }}
        />
      ) : null}

      {/* Thông tin sản phẩm */}
      <h3 style={{ margin: "8px 0", fontWeight: "600" }}>{product.name}</h3>
      {product.description && (
        <p style={{ color: "#666", fontSize: 14, marginBottom: 4 }}>
          {product.description}
        </p>
      )}
      <p style={{ color: "#333", fontWeight: "bold" }}>💲{product.price}</p>

      {/* Các hành động */}
      <div style={{ marginTop: 8 }}>
        <Link
          href={`/products/${product._id}`}
          style={{ color: "#0070f3", textDecoration: "underline" }}
        >
          View
        </Link>

        {/* Nếu có session thì hiển thị thêm Edit + Delete */}
        {session && (
          <>
            <Link
              href={`/products/edit/${product._id}`}
              style={{
                marginLeft: 8,
                color: "#0070f3",
                textDecoration: "underline",
              }}
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              style={{
                marginLeft: 8,
                color: "#fff",
                backgroundColor: "#e00",
                border: "none",
                padding: "4px 8px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}



