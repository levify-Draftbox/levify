import { IoDocumentTextOutline } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';

interface props{
    name:string,
    route:string,
}

const Document = ({name,route}:props) => {
  return (
    <NavLink
            className={({ isActive }) => {
              return (
                "flex w-full px-3 py-4 h-10 rounded-md hover:bg-[#ededeb] hover:cursor-pointer dark:hover:bg-[#383838] " +
                (isActive ? "bg-[#ededeb] dark:bg-[#2c2c2c]" : "")
              );
            }}
            to={route}
          >
            <div className="flex items-center justify-center gap-3">
              <IoDocumentTextOutline
                fontSize={20}
                className="text-[#91918e] dark:text-[#a3a3a3]"
              />
              <h1 className=" dark:text-[#a3a3a3]">{name}</h1>
            </div>
          </NavLink>
  )
}

export default Document