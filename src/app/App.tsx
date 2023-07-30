import {
  RouterProvider,
  createBrowserRouter,
  useParams,
} from "react-router-dom";
import { Root } from "./pages/Root";
import { Main } from "./pages/Main";
import { Movie } from "./pages/Movie";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/movie/:movieId",
        element: <MovieLoader />,
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
