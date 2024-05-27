import { VscAccount, VscLibrary, VscMap, VscSearch } from "react-icons/vsc";
import { Link, Outlet, useLocation } from "react-router-dom";
import { classes } from "../../utils/utils";
import { SearchBar } from "../widgets/SearchBar";
import { useAppSelector } from "../../redux/hooks";
import { imageURL, useMyDetailsQuery } from "../../redux/tmdb";

export function Root() {
  const { pathname } = useLocation();

  return (
    <>
      <div className="mb-16">
        {(pathname === "/search" || pathname === "/") && (
          <div className="mt-3 mx-3">
            <SearchBar />
          </div>
        )}
        <Outlet />
      </div>
      <div className="fixed bottom-0 w-screen bg-neutral-100 text-neutral-900 py-1 h-14 grid grid-cols-4">
        <NavIcon label="Explore" />
        <NavIcon label="Search" />
        <NavIcon label="Downloads" />
        <AccountTab />
      </div>
    </>
  );
}

type Label = "Explore" | "Search" | "Downloads";
function NavIcon({ label }: { label: Label }) {
  const location = useLocation();

  const icons = {
    Explore: VscMap,
    Search: VscSearch,
    Downloads: VscLibrary,
  };
  const links = {
    Explore: "/",
    Search: "/search",
    Downloads: "/downloads",
  };

  const Icon = icons[label];
  const link = links[label];
  const isFocused = location.pathname === link;

  return (
    <div
      className={
        "h-full justify-center flex flex-col" +
        classes({
          "text-cyan-500": isFocused,
        })
      }
    >
      <Link to={link}>
        <Icon className="block m-auto text-2xl" />
        <span className="text-xs text-center block">{label}</span>
      </Link>
    </div>
  );
}

function AccountTab() {
  const location = useLocation();
  const isFocused = location.pathname.startsWith("/account");

  return (
    <div
      className={
        "h-full justify-center flex flex-col" +
        classes({
          "text-cyan-500": isFocused,
        })
      }
    >
      <Link to={"/account"}>
        <AccountIcon />
        <span className="text-xs text-center block">Account</span>
      </Link>
    </div>
  );
}

function AccountIcon() {
  const isAuth = useAppSelector((s) => s.auth.authenticated);
  const userDetails = useMyDetailsQuery(undefined, {
    skip: !isAuth,
  });

  if (!isAuth || !userDetails.isSuccess) {
    return <VscAccount className="block m-auto text-2xl" />;
  }

  return (
    <img
      style={{ height: "1.5rem" }}
      className="block m-auto rounded-full"
      src={imageURL(userDetails.data.avatar.tmdb.avatar_path, "w300")}
      alt="user avatar"
    />
  );
}
