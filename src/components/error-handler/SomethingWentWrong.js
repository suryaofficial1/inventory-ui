import Container from '@material-ui/core/Container';
import React, { useEffect } from 'react';


function SomethingWentWrong({ error, errorInfo }) {

    useEffect(() => {
        const req = { error, errorInfo, url: window.location.href };
        console.log("LOG_ERROR", req)
    }, [error])

    return (<>
        <Container maxWidth="md" style={{ marginTop: 80 }}>
            <h2>Something went wrong.</h2>
            <div style={{ whiteSpace: 'pre-wrap' }}>
                {error && error.toString()}
                <br />
                {errorInfo.componentStack}
            </div>
        </Container>
    </>);

}



export default SomethingWentWrong

