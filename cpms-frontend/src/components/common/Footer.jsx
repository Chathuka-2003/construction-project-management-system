export default function Footer() {
  return (
    <footer
      className="
        fixed left-0 right-0 bottom-0 z-50
        bg-[#4b3f3a] text-white
        px-[18px] py-[10px]
        flex items-center justify-center
        text-[13px]
      "
    >
      © {new Date().getFullYear()} EcoBuild — All rights reserved
    </footer>
  );
}
