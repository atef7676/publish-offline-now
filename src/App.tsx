import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CoinProvider } from "@/contexts/CoinContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Sitemap from "./pages/Sitemap";
import NotFound from "./pages/NotFound";
import JournalistsDirectory from "./pages/JournalistsDirectory";
import ExpertsDirectory from "./pages/ExpertsDirectory";
import CompaniesDirectory from "./pages/CompaniesDirectory";
import PublicationsDirectory from "./pages/PublicationsDirectory";
import JournalistProfile from "./pages/JournalistProfile";
import ExpertProfile from "./pages/ExpertProfile";
import CompanyProfile from "./pages/CompanyProfile";
import PublicationProfile from "./pages/PublicationProfile";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Wallet from "./pages/Wallet";
import Favorites from "./pages/Favorites";
import Pricing from "./pages/Pricing";
import TagResults from "./pages/TagResults";
import AdminReview from "./pages/AdminReview";
import AdminUsers from "./pages/AdminUsers";
import AdminStats from "./pages/AdminStats";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import Inbox from "./pages/Inbox";
import MyListings from "./pages/MyListings";
import CompleteProfile from "./pages/CompleteProfile";
import AccountActivity from "./pages/AccountActivity";
import Portfolio from "./pages/Portfolio";
import SubmitJournalist from "./pages/SubmitJournalist";
import SubmitPublication from "./pages/SubmitPublication";
import ExportContacts from "./pages/ExportContacts";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <CoinProvider>
          <TooltipProvider>
            <ErrorBoundary>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/sitemap" element={<Sitemap />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/tags/:slug" element={<TagResults />} />

                  {/* Directory listing pages */}
                  <Route path="/journalists" element={<JournalistsDirectory />} />
                  <Route path="/experts" element={<ExpertsDirectory />} />
                  <Route path="/companies" element={<CompaniesDirectory />} />
                  <Route path="/publications" element={<PublicationsDirectory />} />

                  {/* Profile detail pages */}
                  <Route path="/journalists/:slug" element={<JournalistProfile />} />
                  <Route path="/experts/:slug" element={<ExpertProfile />} />
                  <Route path="/companies/:slug" element={<CompanyProfile />} />
                  <Route path="/publications/:slug" element={<PublicationProfile />} />

                  {/* Authenticated user pages */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                  <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
                  <Route path="/me/listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                  <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
                  <Route path="/account-activity" element={<ProtectedRoute><AccountActivity /></ProtectedRoute>} />
                  <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />

                  {/* Admin pages */}
                  <Route path="/admin/review" element={<ProtectedRoute><AdminReview /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
                  <Route path="/admin/stats" element={<ProtectedRoute><AdminStats /></ProtectedRoute>} />
                  <Route path="/admin/logs" element={<ProtectedRoute><AdminAuditLogs /></ProtectedRoute>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
          </TooltipProvider>
        </CoinProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
