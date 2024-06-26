import {
  IoDocumentTextOutline,
  IoChevronDown,
  IoEllipsisHorizontal,
  IoAdd,
} from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useState } from "react";

interface props {
  name: string;
  route: string;
}

const Document = ({ name, route }: props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={({ isActive }) => {
        return (
          "flex w-full px-3 py-4 h-10 rounded-md hover:bg-[rgba(0,0,0,0.1)] hover:cursor-pointer dark:hover:bg-[rgba(255,255,255,0.2)] " +
          (isActive
            ? "bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.2)]"
            : "")
        );
      }}
      to={route}
    >
      <div className="flex w-full justify-between">
        <div className="flex items-center justify-center gap-3">
          {isHovered ? (
            <IoChevronDown className="text-[#91918e] dark:text-[#a3a3a3]" />
          ) : (
            <IoDocumentTextOutline
              fontSize={20}
              className="text-[#91918e] dark:text-[#a3a3a3]"
            />
          )}
          <h1 className=" dark:text-[#a3a3a3]">{name}</h1>
        </div>

        {isHovered && (
          <div className="flex items-center gap-1">
            <IoEllipsisHorizontal title="delete,duplicate and..." size={18}/>
            <IoAdd title="Add page" size={18}/>
          </div>
        )}
      </div>
    </NavLink>
  );
};

export default Document;
