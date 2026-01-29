export default function ConfirmDialog({ message, onNo, onYes }) {
  return (
    <div
      className="
        fixed inset-0 z-[999]
        bg-black/45
        flex items-center justify-center
      "
      onClick={onNo}
    >
      <div
        className="
          w-[min(640px,92vw)]
          bg-white
          rounded-[14px]
          p-4
          shadow-[0_10px_22px_rgba(0,0,0,.10)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mt-0 mb-2 font-bold text-[18px]">
          Confirm
        </h3>

        <p className="mb-4 text-[#222]">
          {message}
        </p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onNo}
            className="
              px-3 py-2
              rounded-[10px]
              border border-[#ddd]
              bg-transparent
              font-bold
              cursor-pointer
            "
          >
            No
          </button>

          <button
            onClick={onYes}
            className="
              px-3 py-2
              rounded-[10px]
              bg-[#c0392b]
              text-white
              font-bold
              cursor-pointer
            "
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
