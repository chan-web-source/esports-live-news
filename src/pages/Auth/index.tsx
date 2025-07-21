import { useEffect } from "react"
import BottomAds from "@/components/BottomAds"
import Header from "@/components/Header"
import Spacer from "@/components/Spacer"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/components/auth/AuthContext"
import ChatBubble from "@/components/ChatBubble"

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isRegisterRoute = location.pathname === "/register";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <Spacer space={55} />
      {isRegisterRoute ? (
        <RegisterForm onSubmit={handleSuccess} />
      ) : (
        <LoginForm onSubmit={handleSuccess} />
      )}
      <Spacer space={60} />
      <BottomAds alwaysVisible={true} />
      <ChatBubble />
    </>
  )
}

export default Login