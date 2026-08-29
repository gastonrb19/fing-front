import { useNavigate } from "react-router";
import InputLogin from "./InputLogin";
import Title from "./Title";

export default function LoginContainer() {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/");
    };

    return (
        <section className="">
            <Title/>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-2/4 mx-auto bg-white rounded-sm p-4 shadow-xl">
                <InputLogin name="Username" placeholderVal="Ingresa tu usuario" key="login-username" type=""/>
                <InputLogin name="Password" placeholderVal="Ingresa tu contraseña" key="login-password" type="password"/>
                <button type="submit" className="bg-purple-200 w-fit px-3 rounded-sm mx-auto text-white hover:bg-purple-700 duration-300">Login</button>
            </form>
        </section>
    )
}