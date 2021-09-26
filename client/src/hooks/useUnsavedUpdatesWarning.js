import React, {useState, useEffect} from "react";
import {Prompt} from "react-router-dom";

const useUnsavedUpdatesWarning = (message = "Are you sure you want to discard the changes you made?") => {
    const [isDirty, setDirty] = useState(false);

    useEffect(() => {
        window.onbeforeunload = isDirty && (() => message);

        return () => {
            window.onbeforeunload = null;
        };
    }, [isDirty]);

    const promptWarning = <Prompt when={isDirty} message={message} />
    
    return [promptWarning, () => setDirty(true), () => setDirty(false)];
}

export default useUnsavedUpdatesWarning;