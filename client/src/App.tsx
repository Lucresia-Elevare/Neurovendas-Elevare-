import { Route, Switch, Redirect } from "wouter";
import { useAuth } from "./_core/hooks/useAuth";
import Home from "./pages/Home";
import GenerateContent from "./pages/GenerateContent";
import GenerateEbookNew from "./pages/GenerateEbookNew";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Protected Route wrapper
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <Component {...rest} />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        
        {/* Protected routes - Generation Flow */}
        <Route path="/generate-content">
          {() => <ProtectedRoute component={GenerateContent} />}
        </Route>
        <Route path="/generate-ebook-new">
          {() => <ProtectedRoute component={GenerateEbookNew} />}
        </Route>
        
        {/* Legacy route - redirect to new flow */}
        <Route path="/generate-ebook">
          {() => <Redirect to="/generate-content" />}
        </Route>
        
        {/* Other protected routes */}
        <Route path="/dashboard">
          {() => <ProtectedRoute component={Dashboard} />}
        </Route>
        <Route path="/projects">
          {() => <ProtectedRoute component={Projects} />}
        </Route>
        <Route path="/projects/:id">
          {(params) => <ProtectedRoute component={ProjectDetail} {...params} />}
        </Route>
        
        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}
