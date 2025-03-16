import React from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import { Outlet } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function RootLayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <div>
        <Header />
        <div className="mt-5 " style={{ minHeight: "90vh", height: "100%" }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </ClerkProvider>
  );
}

export default RootLayout;
