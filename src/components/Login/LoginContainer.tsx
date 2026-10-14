import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import InputLogin from "./InputLogin";
import Title from "./Title";
import { useAuth } from "../../context/AuthContext";

export default function LoginContainer() {
  const navigate = useNavigate();
  const { login, logout, user, loading, error } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!identifier.trim() || !password.trim()) {
      setLocalError("Por favor ingresa usuario y contraseña.");
      return;
    }

    const ok = await login(identifier.trim(), password.trim());
    if (ok) {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    await logout();
    setIdentifier("");
    setPassword("");
  };

  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center px-4">
      <Title />

      {/* Si el usuario ya está autenticado */}
      {user ? (
        <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl border border-slate-100 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">¡Hola, {user.username}!</h2>
            <p className="text-sm text-slate-500 mt-1">{user.email}</p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer"
            >
              Ir al Inicio
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition-colors cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-md bg-white rounded-xl p-6 shadow-xl border border-slate-100"
        >
          <div className="text-center mb-1">
            <h2 className="text-lg font-bold text-slate-800">Iniciar Sesión</h2>
            <p className="text-xs text-slate-500">Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>

          {(error || localError) && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm text-red-700">
              <p className="font-semibold">Error al autenticar</p>
              <p>{localError || error}</p>
            </div>
          )}

          <InputLogin
            label="Usuario o Email"
            name="identifier"
            placeholderVal="Ej: gaston o gaston.nuevo@test.com"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="username"
            disabled={loading}
          />

          <InputLogin
            label="Contraseña"
            name="password"
            placeholderVal="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>
      )}
    </section>
  );
}