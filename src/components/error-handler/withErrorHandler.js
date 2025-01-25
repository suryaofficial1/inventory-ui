import React, { lazy, Suspense } from "react";
import { Loader } from "react-overlay-loader";

const SomethingWentWrong = lazy(() => import("./SomethingWentWrong"))

function withErrorHandler(WrappedComponent) {
    class HOC extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                error: '',
                errorInfo: undefined
            }
        }

        componentDidCatch(error, errorInfo) {
            this.setState({ error, errorInfo })
        }

        render() {
            if (this.state.errorInfo) {
                return <Suspense fallback={<Loader loading={true} className="loader" />}>
                    <SomethingWentWrong error={this.state.error} errorInfo={this.state.errorInfo} />
                </Suspense>
            }
            return <WrappedComponent {...this.additionalProps} {...this.props} />;
        }
    }
    return HOC;
}

export default withErrorHandler;