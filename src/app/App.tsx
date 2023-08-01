import {
  RouterProvider,
  createBrowserRouter,
  useParams,
} from "react-router-dom";
import { Root } from "./pages/Root";
import { Explore } from "./pages/Explore";
import { Movie } from "./pages/Movie";
import { Downloads } from "./pages/Downloads";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Explore />,
      },
      {
        path: "/movie/:movieId",
        element: <MovieLoader />,
      },
      {
        path: "/downloads",
        element: <Downloads />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

function MovieLoader() {
  const { movieId } = useParams();
  if (!movieId) {
    // TODO: Handle error
    return <>This is very bad!</>;
  }
  const parts = movieId.split("-");
  const idStr = parts[parts.length - 1];
  const id = parseInt(idStr);

  return <Movie id={id} />;
}

export default App;
