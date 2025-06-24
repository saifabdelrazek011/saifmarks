import { DashboardProvider } from "./context";
import Router from "./router/router";

function App() {
  return (
    <DashboardProvider>
      <Router />
    </DashboardProvider>
  );
}

export default App;
