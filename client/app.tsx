import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Routes as Index } from "./routes";
import { Nav } from "./components/nav";
import { Auth } from "./routes/auth";
import { SignUp } from "./routes/auth/sign-up";
import { SignIn } from "./routes/auth/sign-in";
import "./app.scss";
import { RecoilRoot } from "recoil";
import { Portfolio } from "./routes/portfolio";
import { Admin } from "./routes/admin";
import { IdScanner } from "./components/id-scanner";

function App() {
  return (
    <RecoilRoot>
      {/* TODO: Replace with loading UI*/}
      <Suspense fallback={"Loading"}>
        <Nav />
        <IdScanner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path={Index.ADMIN()} element={<Admin />} />
            <Route path={Index.AUTH()} element={<Auth />}>
              <Route path={Index.AUTH_SIGN_UP()} element={<SignUp />} />
              <Route path={Index.AUTH_SIGN_IN()} element={<SignIn />} />
              <Route path={Index.AUTH()} element={<SignUp />} />
            </Route>
            <Route path={Index.PORTFOLIO()} element={<Portfolio />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </RecoilRoot>
  );
}

export default App;
