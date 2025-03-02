import FloatingShape from "./components/FloatingShape";
import {Navigate, Route,Routes} from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster } from 'react-hot-toast';
import HomePage from "./pages/HomePage";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};


const RedirectAuthenticatedUser = ({children}) => {
  const {isAuthenticated,user} = useAuthStore();
  if(isAuthenticated && user.isVerified){
    return <Navigate to="/" replace/>;
  }
  return children;
}
function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner/>;

  return (
    <div className="min-h-screen bg-black flex justify-center items-center relative overflow-hidden">
      {/* Space Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 opacity-80" />

      {/* Moving Twinkling Stars */}
      <FloatingShape isStars />

      {/* Floating Nebula-Like Shapes */}
      <FloatingShape color="bg-blue-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-purple-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-indigo-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route
          path="/signup"
          element={<RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>}
        />
        <Route
          path="/login"
          element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>}
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgotPasswordPage/></RedirectAuthenticatedUser>} />
        <Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				{/* catch all routes */}
				<Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
