export default function register(req) {
  const { email, password } = req.body;

  if (!email || !password) {
    return { status: 400, error: "Email and password are required" };
  }

  const password_hash = t.password.hash(password);
  t.log(password_hash)

  // HARD GUARD — REQUIRED
  if (typeof password_hash !== "string") {
    return { status: 500, error: "Password hashing failed" };
  }

  const res = t.fetch(
    "https://cirfwtkudcckuvmaaqdn.supabase.co/rest/v1/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal"
      },
      // ✅ REQUIRED
      body: JSON.stringify({
        email,
        password_hash
      })
    }
  );

  // Duplicate email
  if (res.status === 409) {
    return { status: 409, error: "Email already registered" };
  }

  // Any other failure
  if (res.status < 200 || res.status >= 300) {
    return {
      status: res.status,
      error: res.body || "User creation failed"
    };
  }

  return {
    status: 201,
    message: "User registered successfully"
  };
}
