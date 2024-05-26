export function TMDBButton({ link, text }: { link: string; text: string }) {
  return (
    <a
      href={link}
      target="_blank"
      className="py-2 w-full block text-center font-semibold rounded-md bg-[#032541]"
    >
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C0FECF] to-[#1ED5A9]">
        {text}
      </span>
    </a>
  );
}
