import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect, type ElementType } from "react";
import Skeletons from '../components/common/Skeletons';
import Layout from "../pages/Layout/Layout";

const pageImports = {
  overview: () => import("../pages/Overview/Overview"),
  // ભવિષ્યમાં બીજા પેજીસ અહીં ઉમેરી શકો છો
};

const pages = {
  Login: lazy(() => import("../auth/Login")),
  Overview: lazy(() => import("../pages/Overview/Overview")),
  // બાકીના પેજીસ અહીં ઉમેરો
};

type PageType = "form" | "dashboard" | "page";
type PageComponent = ElementType;

const Page = ({ 
  component: Component, 
  type = "page", 
  showSkeleton = true,
  title // નવું ટાઇટલ પ્રોપ ઉમેર્યું
}: { 
  component: PageComponent; 
  type?: PageType; 
  showSkeleton?: boolean;
  title: string; // ટાઇટલ ફરજિયાત આપવું પડશે
}) => {
  
  // પેજ રેન્ડર થતાંની સાથે જ document.title સેટ કરી દેશે
  useEffect(() => {
    if (title) {
      document.title = `${title} - Gurukul`;
    }
  }, [title]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const idle = (cb: () => void): number => {
      if ("requestIdleCallback" in window) return window.requestIdleCallback(cb);
      return setTimeout(cb, 120);
    };

    const cancelIdle = (id: number) => {
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(id);
      else clearTimeout(id);
    };

    const idleIds: number[] = [];

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const nextRoutes = ["/overview"];
        nextRoutes.forEach(route => {
          const key = route.split("/").pop() as keyof typeof pageImports;
          const idleId = idle(() => { pageImports[key]?.(); });
          idleIds.push(idleId);
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      idleIds.forEach(cancelIdle);
    };
  }, []);

  const getSkeleton = () => {
    if (!showSkeleton) return null;
    switch (type) {
      case "form": return <Skeletons.Form />;
      case "dashboard": return <Skeletons.Dashboard />;
      default: return <Skeletons.Page />;
    }
  };

  return (
    <Suspense fallback={getSkeleton()}>
      <Component />
    </Suspense>
  );
};

export default function Routers() {
  return (
    <Routes>
      {/* દરેક પેજ રાઉટમાં ટાઇટલ પ્રોપ પાસ કરી દીધું છે */}
      <Route path="/" element={<Page component={pages.Overview} type="dashboard" title="Overview" />} />
      <Route path="/login" element={<Page component={pages.Login} type="form" title="Login" />} />
      <Route path="/dashboard" element={<Layout/>}>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}