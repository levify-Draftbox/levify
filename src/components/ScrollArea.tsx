import React, { useEffect, useRef, useState } from "react";

export default function ScrollArea({
    children,
    className,
    border,
}: {
    children: React.ReactNode,
    className?: string,
    border?: boolean
}): React.ReactNode {

    const scrollSideBarDivRef = useRef<HTMLDivElement>(null);
    const [sideBarTop, setSideBarTop] = useState(true);
    const [sideBarbottom, setSideBarBottom] = useState(false);

    useEffect(() => {
        const sEvent = (e: any) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            setSideBarTop(scrollTop === 0);
            setSideBarBottom(scrollTop + clientHeight >= scrollHeight);
            console.log(11);
            
        };

        const scrollDiv = scrollSideBarDivRef.current;
        sEvent({ target: scrollDiv })

        scrollDiv?.addEventListener("scroll", sEvent);
        scrollDiv?.addEventListener("mouseenter", sEvent);

        return () => {
            scrollDiv?.removeEventListener("scroll", sEvent);
            scrollDiv?.removeEventListener("mouseenter", sEvent);
        };
    }, []);

    return (
        <div className={`h-full relative ${border ? `border-dashed  ${!sideBarTop ? "border-t" : ""} ${!sideBarbottom ? "border-b" : ""}` : 0}`}>
            <div className={`h-10 ${sideBarTop ? "" : "bg-gradient-to-b from-background to-transparent"} absolute top-0 w-full pointer-events-none`}></div>
            <div className={`h-full overflow-auto scroll-bar ${className || ""}`} ref={scrollSideBarDivRef}>
                {children}
            </div>
            <div className={`h-10 ${sideBarbottom ? "" : "bg-gradient-to-t from-background to-transparent"} absolute bottom-0 w-full pointer-events-none`}></div>
        </div>
    )
}