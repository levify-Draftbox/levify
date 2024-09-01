import { Key, useEffect, useState } from "react";
import Boxes from "./boxes";
import { useParams } from "react-router-dom";

export default function MailboxContainer() {
    const { mailbox = 'inbox' } = useParams();
    const [key, setKey] = useState<Key>(mailbox);

    useEffect(() => {
        setKey(mailbox);
    }, [mailbox]);

    return <Boxes key={key} path={mailbox} />;
}