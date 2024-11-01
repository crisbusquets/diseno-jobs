"use client";

import { useState } from "react";
import { signIn, signUp } from "../actions/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    setMessage("");

    try {
      if (isLogin) {
        const result = await signIn(formData);
        if (result?.error) {
          setError(result.error);
        }
      } else {
        const result = await signUp(formData);
        if (result?.error) {
          setError(result.error);
        } else if (result?.message) {
          setMessage(result.message);
        }
      }
    } catch (e) {
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "¿Nuevo en la plataforma?" : "¿Ya tienes una cuenta?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setMessage("");
              }}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-md">{error}</div>}

        {message && <div className="bg-green-50 text-green-700 p-3 rounded-md">{message}</div>}

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                      shadow-sm focus:outline-none focus:ring-blue-500 
                      focus:border-blue-500"
              placeholder="tu@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                      shadow-sm focus:outline-none focus:ring-blue-500 
                      focus:border-blue-500"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent 
                    rounded-md shadow-sm text-sm font-medium text-white 
                    bg-blue-500 hover:bg-blue-600"
          >
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
