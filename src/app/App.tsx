import {
  RouterProvider,
  createBrowserRouter,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Root } from "./pages/Root";
import { Explore } from "./pages/Explore";
import { Media } from "./pages/Media";
import { Downloads } from "./pages/Downloads";
import { Search } from "./pages/Search";
import { Account, CreateTMDBSession } from "./pages/Account";
import { Redirect } from "../utils/utils";
import { ErrorAlert } from "./components/ErrorAlert";

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
        path: "/show/:showId",
        element: <ShowLoader />,
      },
      {
        path: "/downloads",
        element: <Downloads />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/account/create-tmdb-session",
        element: <TMDBSessionLoader />,
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
    return <ErrorAlert text="This movie was not found" />;
  }
  const parts = movieId.split("-");
  const idStr = parts[parts.length - 1];
  const id = parseInt(idStr);

  return <Media id={id} mediaType="movie" />;
}

function ShowLoader() {
  const { showId } = useParams();
  if (!showId) {
    return <ErrorAlert text="This show was not found" />;
  }
  const parts = showId.split("-");
  const idStr = parts[parts.length - 1];
  const id = parseInt(idStr);

  return <Media id={id} mediaType="show" />;
}

function TMDBSessionLoader() {
  const [searchParams] = useSearchParams();
  const requestToken = searchParams.get("request_token");

  if (typeof requestToken !== "string") {
    return <Redirect url="/account" />;
  }

  return <CreateTMDBSession requestToken={requestToken} />;
}

export default App;
