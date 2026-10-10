import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import GuestGuard from './guards/GuestGuard';
import TokenManager from './components/test/TokenManager';
import AuthGuard from './guards/AuthGuard';
import RoleGuard from './guards/RoleGuard';
import Preloader from './components/preloader/Preloader';
import { useSelector } from 'react-redux';
import SignUpOAuth2Handler from './components/auth/SignUpOAuth2Handler';
import LoginOAuth2Handler from './components/auth/LoginOAuth2Handler';
import OAuth2Error from './components/auth/OAuth2Error';
import NotFound from './components/common/NotFound';

// Lazy loaded views
const LoginPage = lazy(() => import('./views/LoginPage'));
const SignUpPage = lazy(() => import('./views/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('./views/ForgotPasswordPage'));
const HomePage = lazy(() => import('./views/HomePage'));
const ReelsPage = lazy(() => import('./views/ReelsPage'));
const SearchPage = lazy(() => import('./views/SearchPage'));
const ChatPage = lazy(() => import('./views/ChatPage'));
const NotificationsPage = lazy(() => import('./views/NotificationsPage'));
const ProfilePage = lazy(() => import('./views/ProfilePage'));
const SharedMediaPage = lazy(() => import('./views/SharedMediaPage'));
const SettingsPage = lazy(() => import('./views/SettingsPage'));
const AdminDashboardPage = lazy(() => import('./views/AdminDashboardPage'));
const ContentControlPage = lazy(() => import('./views/ContentControlPage'));
const UserControlPage = lazy(() => import('./views/UserControlPage'));
const ModeratorControlPage = lazy(() => import('./views/ModeratorControlPage'));
const BanPage = lazy(() => import('./views/BanPage'));

const roleRedirect = (user) => {
  switch (user?.role) {
    case 'ADMIN':
      return <Navigate to="/admin" />;
    case 'MODERATOR':
      return <Navigate to="/moderator" />;
    default:
      return <Navigate to="/home" />;
  }
};

const RoutesConfig = () => {
  const user = useSelector((state) => state.user.profile);

  return (
    <Suspense fallback={<Preloader />}>
      <Routes>
        <Route path="/token-manage" element={<TokenManager />} />

        <Route path="/" element={<AuthGuard>{roleRedirect(user)}</AuthGuard>} />

        <Route
          path="/login"
          element={
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          }
        />

        <Route
          path="/login/oauth2"
          element={
            <GuestGuard>
              <LoginOAuth2Handler />
            </GuestGuard>
          }
        />

        <Route
          path="/signup"
          element={
            <GuestGuard>
              <SignUpPage />
            </GuestGuard>
          }
        />

        <Route
          path="/signup/oauth2"
          element={
            <GuestGuard>
              <SignUpOAuth2Handler />
            </GuestGuard>
          }
        />

        <Route
          path="/error/oauth2"
          element={
            <GuestGuard>
              <OAuth2Error />
            </GuestGuard>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <GuestGuard>
              <ForgotPasswordPage />
            </GuestGuard>
          }
        />

        <Route
          path="/home"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'USER'}>
                <HomePage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/search"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'USER'}>
                <SearchPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/chat"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'USER'}>
                <ChatPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/chat/:userId"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'USER'}>
                <ChatPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/reels"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'USER'}>
                <ReelsPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/profile/:userId"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'USER'}>
                <ProfilePage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/notifications"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'USER'}>
                <NotificationsPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/settings"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'USER'}>
                <SettingsPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route path="/share/:entity/:entityId" element={<SharedMediaPage />} />

        <Route
          path="/moderator"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'MODERATOR'}>
                <Navigate to="/moderator/moderate/content" />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/moderator/moderate/content"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'MODERATOR'}>
                <ContentControlPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/moderator/moderate/user"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'MODERATOR'}>
                <UserControlPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/admin"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'ADMIN'}>
                <Navigate to="/admin/dashboard" />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'ADMIN'}>
                <AdminDashboardPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/admin/moderate/content"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'ADMIN'}>
                <ContentControlPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/admin/moderate/user"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'ADMIN'}>
                <UserControlPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="/admin/moderators"
          element={
            <AuthGuard>
              <RoleGuard requiredRole={'ADMIN'}>
                <ModeratorControlPage />
              </RoleGuard>
            </AuthGuard>
          }
        />

        <Route
          path="banned"
          element={
            <GuestGuard>
              <BanPage />
            </GuestGuard>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default RoutesConfig;
