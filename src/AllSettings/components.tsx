export const SettingTitle: React.FC<{
    children: React.ReactNode,
    className?: string
}> = ({ children, className}) => {
    return (
        <h2 className={`text-base ${className || ""} font-medium text-gray-700 dark:text-gray-200 mt-1 mb-3`}>
            {children}
        </h2>
    )
}

export const SettingDiv: React.FC<{
    children: React.ReactNode,
    className?: string
}> = ({ children, className}) => {
    return (
        <div className={`mt-2 mb-8 ${className || ""} `}>
            {children}
        </div>
    )
}


