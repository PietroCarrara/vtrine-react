import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { MediaCard } from "./components/MediaCard";
import { Root } from "./pages/Root";
import { Main } from "./pages/Main";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
