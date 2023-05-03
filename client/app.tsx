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
import { Preferences } from "./routes/preferences";
import { IdScanner } from "./components/id-scanner";
import { Disclaimer } from "./components/disclaimer";
import { PrivacyPolicy } from "./routes/privacy-policy";
import { NotFound } from "./routes/not-found";
import { Graph } from "./routes/graph";
import { AllConnections } from "./routes/connections";
import { Requests } from "./routes/requests";
import { Recommendations } from "./routes/recommendations";
import { Search } from "./routes/search";
import { Reporting } from "./routes/reporting";

function App() {
  return (
    <RecoilRoot>
      {/* TODO: Replace with loading UI*/}
      <Suspense fallback={"Loading"}>
        <BrowserRouter>
          <Nav />
          <IdScanner />
          <Routes>
            <Route path="/" element={<Auth />}>
              <Route path="/" element={<SignIn />} />
            </Route>
            <Route path={Index.ADMIN()} element={<Admin />} />
            <Route path={Index.AUTH()} element={<Auth />}>
              <Route path={Index.AUTH_SIGN_UP()} element={<SignUp />} />
              <Route path={Index.AUTH_SIGN_IN()} element={<SignIn />} />
              <Route path={Index.AUTH()} element={<SignIn />} />
            </Route>
            <Route path={Index.PORTFOLIO()} element={<Portfolio />} />
            <Route path={Index.PREFERENCES()} element={<Preferences />} />
            <Route path={Index.PRIVACY_POLICY()} element={<PrivacyPolicy />} />
            <Route path={Index.NOT_FOUND()} element={<NotFound />} />
            <Route path={Index.GRAPH()} element={<Graph />} />
            <Route path={Index.CONNECTIONS()} element={<AllConnections />} />
            <Route path={Index.REPORTING()} element={<Reporting />} />
            <Route path={Index.REQUESTS()} element={<Requests />} />
            <Route
              path={Index.RECOMMENDATIONS()}
              element={<Recommendations />}
            />
            <Route path={Index.GRAPH()} element={<Graph />} />
            <Route path={"*"} element={<NotFound />} />
            <Route path={Index.SEARCH()} element={<Search />} />
          </Routes>
        </BrowserRouter>
        <Disclaimer />
      </Suspense>
    </RecoilRoot>
  );
}

export default App;
