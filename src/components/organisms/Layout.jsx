import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
function Layout() {
  // Define app-level state and methods to pass through outlet context
  const outletContext = {
    // Add app-level state/methods here as needed
    // Example: favorites, searchQuery, filterState, etc.
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet context={outletContext} />
      </main>
    </div>
  );
}

export default Layout;