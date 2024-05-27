import { useEffect } from "react";
import {
  useMyDetailsQuery,
  useNewAuthTokenMutation,
  useNewSessionMutation,
} from "../../redux/tmdb";
import { TMDBButton } from "../components/TMDBButton";
import { LoadingElement } from "../components/LoadingElement";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { authenticate } from "../../redux/auth.slice";
import { Redirect } from "../../utils/utils";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorAlert } from "../components/ErrorAlert";

export function Account() {
  const auth = useAppSelector((s) => s.auth);

  return (
    <div className="m-3">
      {(auth.authenticated && <ProfilePage />) || <LoginPage />}
    </div>
  );
}

function ProfilePage() {
  const user = useMyDetailsQuery();

  if (user.isLoading || user.isUninitialized) {
    return <LoadingSpinner />;
  }

  if (user.isError) {
    return <ErrorAlert text="An error ocurred when fetching your user data!" />;
  }

  return (
    <>
      <h1 className="text-3xl my-3 mx-3 font-black">{user.data.name}</h1>
    </>
  );
}

function LoginPage() {
  const [getNewAuthToken, authToken] = useNewAuthTokenMutation();

  useEffect(() => {
    getNewAuthToken();
  }, [getNewAuthToken]);

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
  // TODO: This login seems flaky
  const [createNewSession, newSession] = useNewSessionMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    createNewSession(requestToken)
      .unwrap()
      .then((res) => {
        dispatch(authenticate(res.session_id));
      })
      .catch(console.error);
  }, [createNewSession, dispatch, requestToken]);

  if (newSession.isLoading || newSession.isUninitialized) {
    return <>Authenticating...</>;
  }

  return <Redirect url="/account" />;
}
