import './index.css';
import { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './store/auth-slice';
import { AuthContext } from 'react-oauth2-code-pkce';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import ActivityPage from './pages/activities';
import ActivityDetails from './components/view/ActivityDetails';
import { Dumbbell, LogIn, LogOut, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({
        user: tokenData,
        token: token,
      }));
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md space-y-8"
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <Dumbbell className="h-12 w-12 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome to FitTrack</h1>
              <p className="text-gray-600">
                Track your workouts, monitor progress, and get AI-powered fitness recommendations
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={()=> logIn()}
                className="px-8 py-6 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  <span>Get Started</span>
                </div>
              </Button>
            </motion.div>
            
            <div className="grid grid-cols-3 gap-4 pt-8">
              {['🏃‍♂️', '🏋️‍♀️', '🧘‍♂️'].map((emoji, index) => (
                <motion.div
                  key={index}
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                  className="text-4xl"
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-900">FitTrack</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Hi, {tokenData?.name || 'User'}!
                </span>
                <Button
                  onClick={logOut}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: isHovering ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LogOut className="h-4 w-4" />
                    </motion.div>
                    <span>Logout</span>
                  </div>
                </Button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="border-0 shadow-sm">
              <Routes>
                <Route path="/activities" element={<ActivityPage />} />
                <Route path="/activities/:id" element={<ActivityDetails />} />
                <Route 
                  path="/" 
                  element={<Navigate to="/activities" replace />} 
                />
              </Routes>
            </Card>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;