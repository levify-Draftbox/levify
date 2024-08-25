export const SettingTitle: React.FC<{
    children: React.ReactNode,
    className?: string
}> = ({ children, className }) => {
    return (
        <h2 className={`px-16 text-base ${className || ""} font-bold text-gray-700 dark:text-gray-200 pt-3 mb-3`}>
            {children}
        </h2>
    )
}

export const SettingDiv: React.FC<{
    children: React.ReactNode,
    className?: string
}> = ({ children, className }) => {
    return (
        <div className={`mt-3 mb-8 px-16 ${className || ""} `}>
            {children}
        </div>
    )
}

export const SettingHr: React.FC<{
    className?: string
}> = ({ className }) => {
    return <div className={`mx-16 border-t border-border ${className || ""}`} />
}
