import { createBrowserRouter, createRoutesFromElements, Outlet, redirect, Route } from "react-router-dom";

import React, { lazy, Suspense } from "react";

import RootLayout from "@/pages/layout";
import WithTabbarLayout from "@/pages/(authenticated)/(with-tabbar)/layout";
import AuthenticatedLayout from "./(authenticated)/layout";
import { LoaderSpinner } from "@repo/ui";

import HomePage from "@/pages/(authenticated)/(with-tabbar)/home/page.tsx";

const WelcomePage = lazy(() => import("@/pages/welcome/page.tsx"));
const EssayPage = lazy(() => import("@/pages/(authenticated)/(with-tabbar)/essay/page"));
const AccountPage = lazy(() => import("@/pages/(authenticated)/(with-tabbar)/account/page.tsx"));
const SettingsPage = lazy(() => import("@/pages/(authenticated)/settings/page.tsx"));
const SubscriptionPage = lazy(() => import("@/pages/(authenticated)/subscription/page.tsx"));
const SubsciptionBuyPage = lazy(() => import("@/pages/(authenticated)/subscription/SubscriptionBuy/SubsciptionBuyPage.tsx"));
const EssayDetailPage = lazy(() => import("@/pages/(authenticated)/(with-tabbar)/essay/EssayDetailPage.tsx"));


const LessonPage = lazy(() => import("@/pages/(authenticated)/lesson/page.tsx"));
const SetLessonPage = lazy(() => import("@/pages/(authenticated)/lesson/SetLessonPage/SetLessonPage.tsx"));


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route
        path="/welcome"
        element={
          <Suspense
            fallback={
              <div
                style={{
                  width: "100dvw",
                  height: "100dvh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LoaderSpinner size={25} />
              </div>
            }
          >
            <WelcomePage />
          </Suspense>
        }
      />

      <Route element={<AuthenticatedLayout />}>
        <Route element={<WithTabbarLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/essay" element={<EssayPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        <Route
          element={
            <React.Suspense>
              <Outlet />
            </React.Suspense>
          }
        >
          <Route path="/set/lesson/*" element={<SetLessonPage />} />
          <Route path="/set/lesson/:topicId/*" element={<SetLessonPage />} />
          <Route path="/lesson/*" element={<LessonPage />} />
          <Route path="/lesson/topic/:topicId/*" element={<LessonPage />} />
        </Route>
        
        <Route path="/essay/:essayId/*" element={<EssayDetailPage />} />

        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/subscription/:planId/*" element={<SubsciptionBuyPage />} />
        <Route path="/settings" element={<SettingsPage />} />

      </Route>

      <Route
        path="/*"
        loader={() => {
          throw redirect("/welcome");
        }}
      />
    </Route>,
  ),
);

export { router };

