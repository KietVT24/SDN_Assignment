// app/auth/login/page.js
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Đang đăng nhập...");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      setMsg("Đăng nhập thành công!");
      router.push("/");
    } else {
      setMsg("Đăng nhập thất bại: " + (res.error || ""));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-indigo-700 to-blue-600">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">Đăng nhập</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 transition"
          >
            Đăng nhập
          </button>
        </form>

        {msg && (
          <p className="text-center text-indigo-200 mt-4 animate-fadeIn">{msg}</p>
        )}

        <p className="text-center text-indigo-300 mt-6">
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" className="hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </motion.div>
    </div>
  );
}



// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Gửi yêu cầu login
//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (res.ok) {
//       alert("Đăng nhập thành công!");
//       router.push("/");
//     } else {
//       alert("Sai tài khoản hoặc mật khẩu");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
//       <div
//         className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md
//         transition-all duration-500 hover:shadow-2xl"
//       >
//         <h2 className="text-2xl font-bold text-center text-gray-700 mb-6 animate-fade-in">
//           Đăng nhập tài khoản
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold mb-1 text-gray-600">
//               Email
//             </label>
//             <input
//               type="email"
//               className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400 transition"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold mb-1 text-gray-600">
//               Mật khẩu
//             </label>
//             <input
//               type="password"
//               className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400 transition"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white rounded-lg p-2 font-semibold hover:bg-blue-600 active:scale-95 transition-transform duration-200"
//           >
//             Đăng nhập
//           </button>
//         </form>

//         <p className="text-center mt-4 text-gray-600 text-sm">
//           Chưa có tài khoản?{" "}
//           <Link
//             href="/auth/register"
//             className="text-blue-500 hover:underline hover:text-blue-600"
//           >
//             Đăng ký ngay
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

