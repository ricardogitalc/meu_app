"use client";

import { useEffect, useState } from "react";
import { getUserDetailsAction } from "@/auth/api/users/users-server-actions";
import { UserDetails200 } from "@/auth/api/orval-api.schemas";

export default function UserDetailsPage() {
  const [userDetails, setUserDetails] = useState<UserDetails200 | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetailsAction();
        if (response.status === 200) {
          setUserDetails(response.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor");
      }
    };

    fetchUserDetails();
  }, []);

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!userDetails) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Usuário</h1>
      <div className="space-y-2">
        <p>
          <strong>Nome:</strong> {userDetails.firstName} {userDetails.lastName}
        </p>
        <p>
          <strong>Email:</strong> {userDetails.email}
        </p>
        <p>
          <strong>WhatsApp:</strong>{" "}
          {userDetails.whatsappNumber || "Não informado"}
        </p>
        <p>
          <strong>Função:</strong> {userDetails.role}
        </p>
        <p>
          <strong>Verificado:</strong> {userDetails.verified ? "Sim" : "Não"}
        </p>
        <p>
          <strong>Criado em:</strong>{" "}
          {new Date(userDetails.createdAt || "").toLocaleDateString()}
        </p>
        <p>
          <strong>Atualizado em:</strong>{" "}
          {new Date(userDetails.updatedAt || "").toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
