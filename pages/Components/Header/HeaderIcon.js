export default function HeaderIcon({ Icon, active }) {
  return (
    <div className="flex items-center rounded-xl active:border-b-2 active:border-blue-500 group cursor-pointer md:hover:bg-gray-100 md:px-10 sm:h-14">
      <Icon
        className={`h-5 text-gray-500 group-hover:text-blue-500 text-center sm:h-7 mx-auto ${
          active && "text-blue-500"
        }`}
      />
    </div>
  );
}
