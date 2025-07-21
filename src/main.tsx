import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './i18n/i18n'
import Auth from './pages/Auth/index.tsx'
import Profile from './pages/Profile/index.tsx'
import { AuthProvider } from './components/auth/AuthContext.tsx'
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx'
import Matches from './pages/Matches/index.tsx'
import News from './pages/News/index.tsx'
import Tournaments from './pages/Tournaments/index.tsx'
import TeamDetail from './pages/TeamDetail/index.tsx'
import MatchDetail from './pages/MatchDetail/index.tsx'
import TournamentDetail from './pages/TournamentDetail/index.tsx'
import Home from './pages/Home/index.tsx'
import { NavigationContextProvider } from './context/NavigationContext.tsx'
import Teams from './pages/Teams/index.tsx'
import NewsArticle from './pages/NewsArticle/index.tsx'
import StaticPage from './pages/StaticPage/index.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <NavigationContextProvider>
          <Routes>
            {/* Availble sections: news, matches, tournaments, teams, team */}
            <Route path="/" element={<Home />} />
            <Route path="/:gameType/matches" element={<Matches />} />
            <Route path="/:gameType/matches/:matchId" element={<MatchDetail />} />
            <Route path="/:gameType/tournaments/:countryId" element={<Tournaments />} />
            <Route path="/:gameType/tournament/:tournamentId" element={<TournamentDetail />} />
            <Route path="/:gameType/teams/:countryId" element={<Teams />} />
            <Route path="/:gameType/team/:teamId" element={<TeamDetail />} />
            <Route path="/:gameType/news" element={<News />} />
            <Route path="/:gameType/news/article/:articleId" element={<NewsArticle />} />
            <Route path="/info/:pageName" element={<StaticPage />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/account" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </NavigationContextProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)