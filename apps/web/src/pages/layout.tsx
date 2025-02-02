import { Outlet } from "react-router-dom";
import dayjs from "dayjs";

import "dayjs/locale/ru";
import customParseFormat from "dayjs/plugin/customParseFormat";

import "@/styles/globals.scss";
import { TgBottomFix } from "@/components/layout/TgBottomFix";
import { Suspense, useEffect } from "react";
import WebApp from "@twa-dev/sdk";

dayjs.locale("ru");
dayjs.extend(customParseFormat);

export default function RootLayout() {
  useEffect(() => {
    WebApp.expand();
    WebApp.ready();
  }, []);

  return (
    <Suspense>
      <Outlet />
      <TgBottomFix />
    </Suspense>
  );
}
