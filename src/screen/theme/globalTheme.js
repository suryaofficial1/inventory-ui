import { createTheme } from "@material-ui/core/styles";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { enUS } from '@material-ui/core/locale';

const unit = 'px';
const keys = ["xs", "sm", "md", "lt", "lg", "xl"];
const step = keys.length;
const values = {
    xs: 0,
    sm: 600,
    md: 960,
    lt: 1120,
    lg: 1280,
    xl: 1920,
}
const globalTheme = createTheme({

    palette: {
        primary: { main: '#0066a2', light: '#F5FCFF' },
        secondary: { main: '#f15e4a' },
        inherit: { main: '#fba82e' },
        important: (color) => {
            return color + " !important"
        }
    },
    breakpoints: createBreakpoints({

        down: (key) => {
            var endIndex = keys.indexOf(key) + 1;
            var upperbound = values[keys[endIndex]];
            if (endIndex === keys.length) {
                // xl down applies to all sizes
                return up('xs');
            }
            var value = typeof upperbound === 'number' && endIndex > 0 ? upperbound : key;
            return "@media (max-width:".concat(value - step / 100).concat(unit, ")");
        },
        up: (key) => {
            var value = typeof values[key] === 'number' ? values[key] : key;
            return "@media (min-width:".concat(value).concat(unit, ")");
        },

        between: (start, end) => {
            var endIndex = keys.indexOf(end);

            if (endIndex === keys.length - 1) {
                return up(start);
            }

            return "@media (min-width:".concat(typeof values[start] === 'number' ? values[start] : start).concat(unit, ") and ") + "(max-width:".concat((endIndex !== -1 && typeof values[keys[endIndex + 1]] === 'number' ? values[keys[endIndex + 1]] : end) - step / 100).concat(unit, ")");
        },
    }),
    overrides: {
        MuiTooltip: {
            tooltip: {
                fontSize: "1em !important"
            }
        },
        MuiSvgIcon: {
            root: {
                fontSize: "1.5em"
            }
        },
        MuiButton: {
            root: {
                fontFamily: "Montserrat",
                textTransform: "none"
            }
        },
        MuiTab: {
            root: {
                fontFamily: "Montserrat",
                textTransform: "none",
                '@media (min-width: 600px)': {
                    fontSize: "1em"
                }
            }
        },
        MuiTypography: {
            root: {

                justifyContent: "start"
            }, h1: {
                fontFamily: "Open Sans, sans-serif"
            },
            h2: {
                fontFamily: "Open Sans, sans-serif"
            },
            h3: {
                fontFamily: "Open Sans, sans-serif "
            },
            h4: {
                fontFamily: "Open Sans,sans-serif"
            },
            h5: {
                fontFamily: "Open Sans,sans-serif"
            },
            h6: {
                fontFamily: "Open Sans,sans-serif"
            },
            subtitle1: {
                fontFamily: "Open Sans, sans-serif"
            },
            subtitle2: {
                fontFamily: "Open Sans, sans-serif"
            },
            body1: {
                fontFamily: "Montserrat, sans-serif"
            },
            body2: {
                fontFamily: "Montserrat, sans-serif"
            },
            button: {
                fontFamily: "Open Sans, sans-serif"
            },
            caption: {
                fontFamily: "Open Sans, sans-serif"
            },
            overline: {
                fontFamily: "Open Sans, sans-serif"
            }
        },
        MuiOutlinedInput: {
            root: { borderRadius: 0 }
        },
        MuiOutlinedInput: {
            input: { padding: "1em" }
        },
        MuiToggleButton: {
            root: {
                fontFamily: "Open Sans, sans-serif",
                textTransform: "none",
            }
        }
    }
}, enUS);

export default globalTheme;