// Importing a Logo
import logo from "/PlayletLogo.png";

// Importing custom components
import LoginCard from "../../components/LoginCard";

const Login = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {/* Icon and Tool Name */}
      <div className="flex flex-row items-center gap-5">
        <img src={logo} alt="logo" className="w-20" />
        <div className="text-3xl font-semibold">Playlet Tools</div>
      </div>

      {/* Login card */}
      <LoginCard current_path="/" />
    </div>
  );
};

export default Login;
