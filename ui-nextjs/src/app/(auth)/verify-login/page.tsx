export default async function VerifyLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ loginToken?: string }>;
}) {
  const params = await searchParams;
  const loginToken = params.loginToken;

  console.log("Token recebido:", loginToken);

  return (
    <div>
      <h1>Verificação de Login</h1>
      {loginToken ? (
        <p>Token recebido com sucesso!</p>
      ) : (
        <p>Nenhum token fornecido.</p>
      )}
    </div>
  );
}
