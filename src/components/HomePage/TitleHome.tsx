export default function TitleHome({ username }: { username: string }) {
  return (
    <h1 className="text-5xl text-center mt-10 font-bold">
      Bienvenido <span className="text-purple-700">{username}</span>
    </h1>
  );
}
