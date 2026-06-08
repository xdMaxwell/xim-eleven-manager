import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "./lib/game-state";
import { Layout } from "./components/layout";
import NotFound from "@/pages/not-found";

import StadiumHQ from "./pages/stadium-hq";
import Packs from "./pages/packs";
import Locker from "./pages/locker";
import FeverBoard from "./pages/fever-board";
import FormationBuilder from "./pages/formation-builder";
import FeverMatch from "./pages/fever-match";
import Receipts from "./pages/receipts";
import Season from "./pages/season";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={StadiumHQ} />
        <Route path="/packs" component={Packs} />
        <Route path="/locker" component={Locker} />
        <Route path="/fever" component={FeverBoard} />
        <Route path="/formation" component={FormationBuilder} />
        <Route path="/fever-match" component={FeverMatch} />
        <Route path="/receipts" component={Receipts} />
        <Route path="/season" component={Season} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App;
