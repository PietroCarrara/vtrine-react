import { VscClose, VscSearch } from "react-icons/vsc";
import { useSearch } from "../../redux/search";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const { search, setSearch, resetSearch } = useSearch();
  const navigate = useNavigate();

  const onSearch = (s: string) => {
    navigate("/search");
    setSearch(s);
  };
  const onReset = () => {
    navigate("/");
    resetSearch();
  };

  return (
    <label className="relative block w-full">
      <span className="text-black absolute inset-y-0 left-0 flex items-center pl-2">
        <VscSearch />
      </span>

      {search.length > 0 && (
        <span
          onClick={onReset}
          className="cursor-pointer text-red-400 absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <VscClose />
        </span>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search for anything..."
        className="block bg-white text-black border shadow-sm w-full py-1 pl-8 mb-4 focus:outline-none rounded placeholder:italic"
      />
    </label>
  );
}
