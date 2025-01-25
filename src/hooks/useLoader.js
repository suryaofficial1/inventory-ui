import React, { useState, useCallback } from 'react';
import { Loader } from 'react-overlay-loader';

/**
 * Hook for managing loading indicator state.
 * Allows you to start and stop the loading boolean, and manage the loading indicator message.
 * @param initState Initial loading state. Defaults to false.
 * @param initMessage Initial message. Defaults to undefined.
 */
export const useLoader = (
    initState = false,
    initMessage = "Loading..."
) => {
    const [isLoading, setIsLoading] = useState(initState);
    const [message, setMessage] = useState(initMessage);

    const start = useCallback((message = "Loading...") => {
        setIsLoading(true);
        setMessage(message);
    }, []);

    const stop = useCallback(() => {
        setIsLoading(false);
        setMessage(undefined);
    }, []);

    const LoaderComponent = React.useMemo(() => {
        const Component = () => {
            return (<Loader fullPage loading={isLoading} text={message} />);
        };
        return Component;
    }, [isLoading]);
    return [
        { start, stop },
        LoaderComponent, isLoading
    ];
};