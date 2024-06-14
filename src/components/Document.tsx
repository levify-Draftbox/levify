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
                "flex w-full px-3 py-4 h-10 rounded-md hover:bg-[rgba(0,0,0,0.1)] hover:cursor-pointer dark:hover:bg-[rgba(255,255,255,0.2)] " +
                (isActive ? "bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.2)]" : "")
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