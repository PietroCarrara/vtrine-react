import { useEffect } from "react";
import { useNewAuthTokenMutation } from "../../redux/tmdb";
import { TMDBButton } from "../components/TMDBButton";
import { LoadingElement } from "../components/LoadingElement";

export function Account() {
  return (
    <div className="m-3">
      <LoginPage />
    </div>
  );
}

function LoginPage() {
  const [getNewAuthToken, authToken] = useNewAuthTokenMutation();

  useEffect(() => {
    getNewAuthToken();
  }, []);

  return (
    <>
      <h1 className="text-3xl my-3 mx-3 font-black text-center">Login</h1>

      <div className="w-full">
        <LoadingElement
          loading={authToken.isLoading || authToken.isUninitialized}
        >
          <TMDBButton
            link={`https://www.themoviedb.org/authenticate/${authToken.data?.request_token}?redirect_to=${process.env.REACT_APP_HOSTNAME}/account/create-tmdb-session`}
            text="Login via TMDB"
          />
        </LoadingElement>
      </div>
    </>
  );
}

export function CreateTMDBSession({ requestToken }: { requestToken: string }) {
  return <>{requestToken}</>;
}
