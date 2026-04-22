import { createBrowserRouter } from "react-router";
import Landing from "./screens/Landing";
import Auth from "./screens/Auth";
import Dashboard from "./screens/Dashboard";
import Upload from "./screens/Upload";
import Results from "./screens/Results";
import Quiz from "./screens/Quiz";
import SavedNotes from "./screens/SavedNotes";
import Chat from "./screens/Chat";
import Analytics from "./screens/Analytics";
import Profile from "./screens/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/auth",
    Component: Auth,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/upload",
    Component: Upload,
  },
  {
    path: "/results/:id",
    Component: Results,
  },
  {
    path: "/quiz/:id",
    Component: Quiz,
  },
  {
    path: "/chat/:id",
    Component: Chat,
  },
  {
    path: "/saved",
    Component: SavedNotes,
  },
  {
    path: "/analytics",
    Component: Analytics,
  },
  {
    path: "/profile",
    Component: Profile,
  },
]);
