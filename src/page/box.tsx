import { Key, useEffect, useState } from "react";
import Boxes from "./boxes";
import { useParams } from "react-router-dom";

export default function MailboxContainer() {
    const { mailbox = 'inbox' } = useParams();
    const [_, setKey] = useState<Key>(mailbox);

    useEffect(() => {
        setKey(mailbox);
    }, [mailbox]);

    return <Boxes path={mailbox} />;
}